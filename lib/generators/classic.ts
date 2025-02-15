import type { PreviewGeneratorProps } from "../types"
import { themes } from "../themes"
import { roundedRect } from "../utils"

export const classicPreview = ({
  repoData,
  options,
  canvas,
}: PreviewGeneratorProps & { canvas: HTMLCanvasElement }): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const colors = themes[options.theme]

  // Background
  ctx.fillStyle = colors.base
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 24)
  ctx.fill()

  // Window controls
  ;[colors.red, colors.yellow, colors.green].forEach((color, i) => {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(40 + i * 30, 40, 10, 0, Math.PI * 2)
    ctx.fill()
  })

  // Repository name and owner
  ctx.font = "bold 48px system-ui"
  ctx.fillStyle = colors.pink
  const ownerText = repoData.owner?.login || "Unknown"
  ctx.fillText(ownerText, 50, 120)

  ctx.fillStyle = colors.text
  ctx.fillText(" / ", 50 + ctx.measureText(ownerText).width, 120)

  ctx.fillStyle = colors.green
  const repoName = repoData.name || "Unknown"
  ctx.fillText(repoName, 50 + ctx.measureText(ownerText + " / ").width, 120)

  // Description
  ctx.font = "32px system-ui"
  ctx.fillStyle = colors.text
  const words = (repoData.description || "No description available").split(" ")
  let line = ""
  let y = 180
  words.forEach((word) => {
    const testLine = line + word + " "
    const metrics = ctx.measureText(testLine)
    if (metrics.width > canvas.width - 100) {
      ctx.fillText(line, 50, y)
      line = word + " "
      y += 50
    } else {
      line = testLine
    }
  })
  ctx.fillText(line, 50, y)

  // Star count
  ctx.font = "bold 36px system-ui"
  ctx.fillStyle = colors.yellow
  const starText = `★ ${repoData.stargazers_count?.toLocaleString() || "0"}`
  ctx.fillText(starText, canvas.width - ctx.measureText(starText).width - 50, 60)

  // Contributors
  const contributorCount = repoData.contributors?.length || 0
  ctx.fillStyle = colors.overlay0
  ctx.font = "24px system-ui"
  ctx.fillText(`${contributorCount} Contributors`, canvas.width - 250, canvas.height - 50)

  // Load and draw contributor avatars
  const avatarSize = 60
  const maxAvatars = 5
  repoData.contributors?.slice(0, maxAvatars).forEach((contributor, i) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(canvas.width - 70 - i * (avatarSize + 10), canvas.height - 80, avatarSize / 2, 0, Math.PI * 2)
      ctx.clip()
      ctx.drawImage(img, canvas.width - 100 - i * (avatarSize + 10), canvas.height - 110, avatarSize, avatarSize)
      ctx.restore()
    }
    img.src = contributor.avatar_url
  })

  return canvas
}

