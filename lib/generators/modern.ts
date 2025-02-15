import { themes } from "../themes"
import type { PreviewGeneratorProps } from "../types"
import { truncateText, roundedRect } from "../utils"

export const modernPreview = ({
  repoData,
  options,
  canvas,
}: PreviewGeneratorProps & { canvas: HTMLCanvasElement }): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const colors = themes[options.theme]

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, colors.mantle)
  gradient.addColorStop(1, colors.base)
  ctx.fillStyle = gradient
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 24)
  ctx.fill()

  // Add subtle grid pattern
  ctx.strokeStyle = colors.surface0
  ctx.lineWidth = 0.5
  for (let i = 0; i < canvas.width; i += 50) {
    for (let j = 0; j < canvas.height; j += 50) {
      ctx.strokeRect(i, j, 50, 50)
    }
  }

  // Repository name and owner
  ctx.font = "bold 56px system-ui"
  ctx.fillStyle = colors.text
  const repoText = `${repoData.owner.login}/${repoData.name}`
  ctx.fillText(truncateText(ctx, repoText, canvas.width - 80), 50, 100)

  // Description
  ctx.font = "32px system-ui"
  ctx.fillStyle = colors.subtext1
  const description = truncateText(ctx, repoData.description || "", canvas.width - 100)
  ctx.fillText(description, 50, 160)

  // Stats container
  const statsY = canvas.height - 120
  const stats = [
    { icon: "★", value: repoData.stargazers_count, color: colors.yellow },
    { icon: "⑂", value: repoData.forks_count, color: colors.green },
    { icon: "◉", value: repoData.open_issues_count, color: colors.red },
    { icon: "⬤", value: repoData.language, color: colors.blue, isText: true },
  ]

  // Draw large stats
  stats.forEach((stat, i) => {
    const x = 50 + (i * (canvas.width - 100)) / stats.length

    // Draw icon
    ctx.font = "bold 48px system-ui"
    ctx.fillStyle = stat.color
    ctx.fillText(stat.icon, x, statsY)

    // Draw value
    ctx.font = "bold 32px system-ui"
    ctx.fillStyle = colors.text
    const value = stat.isText ? stat.value : stat.value.toLocaleString()
    ctx.fillText(value, x + 50, statsY)
  })

  return canvas
}

