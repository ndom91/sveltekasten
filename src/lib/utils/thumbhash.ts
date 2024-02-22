import sharp from "sharp"
import * as Thumbhash from "thumbhash"

const binaryToBase64 = (binary: Uint8Array) => btoa(String.fromCharCode(...binary))

export const getThumbhashNode = async (imgUrl: string) => {
  const imageData = await fetch(imgUrl)
  const imageBuffer = await imageData.arrayBuffer()
  const image = sharp(imageBuffer).resize(100, 100, { fit: "inside" })
  const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  const binaryThumbhash = Thumbhash.rgbaToThumbHash(info.width, info.height, data)
  return binaryToBase64(binaryThumbhash)
}

export const getThumbhashBrowser = async (imgUrl: string) => {
  const image = new Image()
  image.src = imgUrl
  await new Promise((resolve) => (image.onload = resolve))

  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d")
  const scale = 100 / Math.max(image.width, image.height)

  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  if (!context) throw new Error("Failed to get context")

  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  const pixels = context.getImageData(0, 0, canvas.width, canvas.height)
  if (!pixels) throw new Error("Failed to get image data")

  const binaryThumbhash = Thumbhash.rgbaToThumbHash(pixels.width, pixels.height, pixels.data)

  return binaryToBase64(binaryThumbhash)
}
