import { chromium } from "playwright-chromium"
import { getThumbhash } from "../../lib/image.js"
import debugFactory from "../../lib/log.js"
import { db } from "../../plugins/prisma.js"
import { uploadImage } from "../../plugins/storage.js"
import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { userInfo } from "node:os"
import { join } from "node:path"
import type { Buffer } from "node:buffer"

const debug = debugFactory("backend:create-screenshot")

interface UpdateImageUrlArgs {
  image: Buffer
  imageUrl: string
  url: string
  userId: string
}

interface ScreenshotArgs {
  url: string
}

export interface CreateScreenshot {
  url: string
  userId: string
}

export const createScreenshot = async (data: CreateScreenshot) => {
  if (
    !process.env.BUCKET_PUBLIC_URL
    || !process.env.BUCKET_SECRET_KEY
    || !process.env.BUCKET_ACCESS_KEY
    || !process.env.BUCKET_URL
  ) {
    console.error("Cannot take screenshot, missing object store credentials")
    return
  }
  debug("Creating Screenshot For:", data)
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

const updateImageUrl = async ({
  image,
  imageUrl,
  url,
  userId,
}: UpdateImageUrlArgs) => {
  // Generate thumbhash b64 string from image
  const imageBlur = await getThumbhash(image)

  await db.bookmark.update({
    data: {
      image: imageUrl,
      imageBlur,
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
    executablePath:
      process.env.NODE_ENV !== "development"
        ? chromium.executablePath()
        : localChromiumPath,
    headless: true,
  })

  const page = await browser.newPage({
    locale: "en-US",
    viewport: { width: 960, height: 540 },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  })
  await page.goto(url)

  // Finding and accepting cookie banners
  const selectors = [
    "[id*=cookie] a",
    "[class*=consent] button",
    "[class*=cookie] a",
    "[id*=cookie] button",
    "[class*=cookie] button",
  ]
  const cookieSelectors = page.locator(selectors.join(", "))

  const btnRegex = new RegExp(
    /(Accept all|I agree|Accept|Agree|Agree all|Ich stimme zu|Okay|OK)/,
    "gi",
  )
  const cookieBtnLocator = page.getByRole("button", { name: btnRegex })

  // Handler if one of these selectors appears
  await page.addLocatorHandler(cookieSelectors, async () => {
    await cookieBtnLocator.click()
  })

  // Snap screenshot
  const buffer = await page.screenshot({ type: "png", scale: "css" })

  await page.close()
  await browser.close()

  return buffer
}

// Workaround for NixOS Local Chromium Path
const getLocalChromiumPath = async () => {
  const osRelease = await readFile("/etc/os-release")
  const isNix = osRelease.includes("ID=nixos")
  if (isNix) {
    const user = userInfo()

    const chromiumBinPath = join(
      user.homedir,
      ".nix-profile",
      "bin",
      "chromium",
    )
    if (existsSync(chromiumBinPath)) {
      return chromiumBinPath
    }
  }
  return "/bin/chromium"
}
