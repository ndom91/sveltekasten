import chrome from "chrome-aws-lambda"
import { db } from "../../plugins/prisma.js"
import { chromium } from "playwright-core"
import { uploadImage } from "../../plugins/storage.js"
import { readFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { userInfo } from "node:os"
import { getThumbhash } from "../../lib/image.js"

type UpdateImageUrlArgs = {
  image: File
  imageUrl: string
  url: string
  userId: string
}

type ScreenshotArgs = {
  url: string
}

export const createScreenshot = async (data: any) => {
  if (
    !process.env.BUCKET_PUBLIC_URL ||
    !process.env.BUCKET_SECRET_KEY ||
    !process.env.BUCKET_ACCESS_KEY ||
    !process.env.BUCKET_URL
  ) {
    console.error("Cannot take screenshot, missing object store credentials")
    return
  }
  const { url, userId } = data

  // Visit URL and take screenshot with playwright-core
  const image = await screenshotUrl({ url })

  // Upload image to storage
  const publicImageUrl = await uploadImage({
    image,
    url,
    userId,
  })

  // Update bookmark.imageUrl database entry
  await updateImageUrl({ image, imageUrl: publicImageUrl, url, userId })
}

const updateImageUrl = async ({ image, imageUrl, url, userId }: UpdateImageUrlArgs) => {
  // Generate thumbhash b64 string from image
  const imageBlur = await getThumbhash(image)

  // bookmarks.user_userId is a unique constraint
  await db.bookmark.update({
    data: {
      image: imageUrl,
      imageBlur: imageBlur,
    },
    where: {
      url_userId: {
        url,
        userId,
      },
    },
  })
}

const screenshotUrl = async ({ url }: ScreenshotArgs) => {
  const localChromiumPath = await getLocalChromiumPath()
  const browser = await chromium.launch({
    args: chrome.args,
    executablePath: process.env.NODE_ENV !== "development" ? await chrome.executablePath : localChromiumPath,
    headless: true,
    // ignoreHTTPSErrors: true,
  })

  const page = await browser.newPage({
    // width: 1920,
    // height: 1080,
    deviceScaleFactor: 1,
  })
  await page.goto(url)

  // Accepting cookie banners
  const selectors = [
    "[id*=cookie] a",
    "[class*=consent] button",
    "[class*=cookie] a",
    "[id*=cookie] button",
    "[class*=cookie] button",
  ]

  const regex = /(Accept all|I agree|Accept|Agree|Agree all|Ich stimme zu|Okay|OK)/

  const elements = await page.$$(`'${selectors.join(", ")}'`)
  if (elements) {
    for (const el of elements) {
      const innerText = (await el.getProperty("innerText")).toString()
      regex.test(innerText) && el.click()
    }
  }
  // Snap screenshot
  const buffer = await page.screenshot({ type: "png" })

  await page.close()
  await browser.close()

  const urlObj = new URL(url)
  const filename = `{urlObj.hostname}${urlObj.pathname.replace(/\/$/, "")}.png`
  return new File([buffer], filename, { type: "image/png" })
}

// Workaround for NixOS Local Chromium Path
const getLocalChromiumPath = async () => {
  const osRelease = await readFile("/etc/os-release")
  const isNix = osRelease.includes("ID=nixos")
  if (isNix) {
    const user = userInfo()

    const chromiumBinPath = join(user.homedir, ".nix-profile", "bin", "chromium")
    if (existsSync(chromiumBinPath)) {
      return chromiumBinPath
    }
  }
  return "/bin/chromium"
}
