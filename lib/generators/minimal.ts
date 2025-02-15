import type { PreviewGeneratorProps } from "../types"
import { themes } from "../themes"
import { truncateText, roundedRect } from "../utils"

export const minimalPreview = ({
  repoData,
  options,
  canvas,
}: PreviewGeneratorProps & { canvas: HTMLCanvasElement }): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const colors = themes[options.theme as keyof typeof themes]

  // Background
  ctx.fillStyle = colors.base
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 24)
  ctx.fill()

  // Repository name
  ctx.font = "bold 72px system-ui"
  ctx.fillStyle = colors.text
  ctx.fillText(truncateText(ctx, repoData.name || "Unknown", canvas.width - 100), 50, 120)

  // Description
  ctx.font = "28px system-ui"
  ctx.fillStyle = colors.subtext1
  const description = truncateText(ctx, repoData.description || "No description available", canvas.width - 100)
  ctx.fillText(description, 50, 180)

  // Star count
  ctx.font = "bold 36px system-ui"
  ctx.fillStyle = colors.yellow
  const starText = `★ ${repoData.stargazers_count?.toLocaleString() || "0"}`
  const starMetrics = ctx.measureText(starText)
  ctx.fillText(starText, canvas.width - starMetrics.width - 50, 70)

  // Language
  if (repoData.language) {
    ctx.font = "28px system-ui"
    ctx.fillStyle = colors.blue
    ctx.fillText(`⬤ ${repoData.language}`, 50, canvas.height - 60)
  }


  return canvas
}

