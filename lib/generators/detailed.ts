import type { PreviewGeneratorProps } from "../types"
import { themes } from "../themes"
import { truncateText, roundedRect } from "../utils"

export const detailedPreview = ({
  repoData,
  options,
  canvas,
}: PreviewGeneratorProps & { canvas: HTMLCanvasElement }): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const colors = themes[options.theme]

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, colors.base)
  gradient.addColorStop(1, colors.mantle)
  ctx.fillStyle = gradient
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 24)
  ctx.fill()

  // Repository owner and name
  ctx.font = "bold 56px system-ui"
  ctx.fillStyle = colors.text
  const repoText = `${repoData.owner?.login || "Unknown"}/${repoData.name || "Unknown"}`
  ctx.fillText(truncateText(ctx, repoText, canvas.width - 150), 75, 100)

  // Description
  ctx.font = "28px system-ui"
  ctx.fillStyle = colors.subtext1
  const description = truncateText(ctx, repoData.description || "No description available", canvas.width - 150)
  ctx.fillText(description, 75, 160)

  // Stats
  const stats = [
    { label: "Stars", value: repoData.stargazers_count, color: colors.yellow, icon: "★" },
    { label: "Forks", value: repoData.forks_count, color: colors.green, icon: "⑂" },
    { label: "Issues", value: repoData.open_issues_count, color: colors.red, icon: "◉" },
    { label: "Language", value: repoData.language, color: colors.blue, icon: "⬤" },
  ]

  stats.forEach((stat, i) => {
    const x = 75 + (i * (canvas.width - 150)) / stats.length
    const y = canvas.height - 180

    ctx.font = "bold 48px system-ui"
    ctx.fillStyle = stat.color
    ctx.fillText(stat.icon, x, y)

    ctx.font = "bold 36px system-ui"
    ctx.fillStyle = colors.text
    ctx.fillText(stat.value?.toLocaleString() || "N/A", x + 50, y)

    ctx.font = "24px system-ui"
    ctx.fillStyle = colors.subtext1
    ctx.fillText(stat.label, x + 50, y + 40)
  })

  // Graph
  const graphWidth = canvas.width - 150
  const graphHeight = 150
  const graphX = 75
  const graphY = 220

  // Draw graph background
  ctx.fillStyle = colors.surface0
  roundedRect(ctx, graphX, graphY, graphWidth, graphHeight, 12)
  ctx.fill()

  // Draw graph lines
  ctx.strokeStyle = colors.overlay0
  ctx.lineWidth = 2
  const points = [0, 30, 10, 50, 80, 40, 60, 90, 100]
  const stepX = graphWidth / (points.length - 1)
  const stepY = graphHeight / 100

  ctx.beginPath()
  ctx.moveTo(graphX, graphY + graphHeight - points[0] * stepY)
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(graphX + i * stepX, graphY + graphHeight - points[i] * stepY)
  }
  ctx.stroke()

  // Draw graph points
  ctx.fillStyle = colors.blue
  points.forEach((point, i) => {
    ctx.beginPath()
    ctx.arc(graphX + i * stepX, graphY + graphHeight - point * stepY, 4, 0, Math.PI * 2)
    ctx.fill()
  })

  // Topics
  if (repoData.topics?.length) {
    let topicX = 75
    const topicsY = canvas.height - 80
    ctx.font = "20px system-ui"

    repoData.topics.slice(0, 5).forEach((topic) => {
      const padding = 12
      const topicWidth = ctx.measureText(topic).width + padding * 2

      ctx.fillStyle = colors.surface0
      roundedRect(ctx, topicX, topicsY - 24, topicWidth, 36, 18)
      ctx.fill()

      ctx.fillStyle = colors.text
      ctx.fillText(topic, topicX + padding, topicsY)

      topicX += topicWidth + 12
    })
  }

  return canvas
}

