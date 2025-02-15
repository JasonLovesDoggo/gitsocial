import type { PreviewGeneratorProps } from "../types"
import { themes } from "../themes"
import { truncateText, roundedRect } from "../utils"

export const compactPreview = ({
  repoData,
  options,
  canvas,
}: PreviewGeneratorProps & { canvas: HTMLCanvasElement }): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const colors = themes[options.theme]

  // Background
  ctx.fillStyle = colors.base
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 16)
  ctx.fill()

  // Repository owner and name
  ctx.font = "bold 40px system-ui"
  ctx.fillStyle = colors.blue
  const repoText = `${repoData.owner?.login || "Unknown"}/${repoData.name || "Unknown"}`
  ctx.fillText(truncateText(ctx, repoText, canvas.width - 60), 30, 60)

  // Description
  ctx.font = "24px system-ui"
  ctx.fillStyle = colors.text
  const description = truncateText(ctx, repoData.description || "No description available", canvas.width - 60)
  ctx.fillText(description, 30, 100)

  // Stats
  const stats = [
    { icon: "★", value: repoData.stargazers_count, color: colors.yellow },
    { icon: "⑂", value: repoData.forks_count, color: colors.green },
    { icon: "◉", value: repoData.open_issues_count, color: colors.red },
  ]

  stats.forEach((stat, i) => {
    const x = 30 + i * 150
    ctx.font = "bold 32px system-ui"
    ctx.fillStyle = stat.color
    ctx.fillText(stat.icon, x, canvas.height - 40)
    ctx.fillStyle = colors.text
    ctx.fillText(stat.value?.toLocaleString() || "0", x + 40, canvas.height - 40)
  })

  // Language
  if (repoData.language) {
    ctx.font = "24px system-ui"
    ctx.fillStyle = colors.blue
    ctx.fillText(`⬤ ${repoData.language}`, canvas.width - 200, canvas.height - 40)
  }

  return canvas
}

