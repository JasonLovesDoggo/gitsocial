import type { PreviewGeneratorProps } from "../types"
import { themes } from "../themes"
import { truncateText, roundedRect } from "../utils"

export const dashboardPreview = ({
  repoData,
  options,
  canvas,
}: PreviewGeneratorProps & { canvas: HTMLCanvasElement }): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  const colors = themes[options.theme]

  // Background with subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, colors.base)
  gradient.addColorStop(1, colors.mantle)
  ctx.fillStyle = gradient
  roundedRect(ctx, 0, 0, canvas.width, canvas.height, 24)
  ctx.fill()

  // Repository info section (top left)
  ctx.font = "bold 48px system-ui"
  ctx.fillStyle = colors.text
  const repoText = `${repoData.owner.login}/${repoData.name}`
  ctx.fillText(truncateText(ctx, repoText, canvas.width / 2), 50, 80)

  // Stats grid
  const stats = [
    { label: "Stars", value: repoData.stargazers_count, color: colors.yellow, icon: "★" },
    { label: "Forks", value: repoData.forks_count, color: colors.green, icon: "⑂" },
    { label: "Issues", value: repoData.open_issues_count, color: colors.red, icon: "◉" },
    { label: "Language", value: repoData.language, color: colors.blue, icon: "⬤", isText: true },
  ]

  const gridStartY = 160
  const gridItemHeight = 120
  const gridItemWidth = (canvas.width - 100) / 2

  stats.forEach((stat, i) => {
    const x = 50 + (i % 2) * gridItemWidth
    const y = gridStartY + Math.floor(i / 2) * gridItemHeight

    // Stat background
    ctx.fillStyle = colors.surface0
    roundedRect(ctx, x, y, gridItemWidth - 20, gridItemHeight - 20, 16)
    ctx.fill()

    // Icon
    ctx.font = "bold 32px system-ui"
    ctx.fillStyle = stat.color
    ctx.fillText(stat.icon, x + 20, y + 40)

    // Value
    ctx.font = "bold 48px system-ui"
    ctx.fillStyle = colors.text
    const value = stat.isText ? stat.value : stat.value.toLocaleString()
    ctx.fillText(value, x + 20, y + 90)

    // Label
    ctx.font = "400 20px system-ui"
    ctx.fillStyle = colors.subtext1
    ctx.fillText(stat.label, x + 20, y + 30)
  })

  // Topics
  if (repoData.topics?.length) {
    let topicX = 50
    const topicsY = canvas.height - 50
    ctx.font = "500 18px system-ui"

    repoData.topics.slice(0, 4).forEach((topic) => {
      const padding = 16
      const topicWidth = ctx.measureText(topic).width + padding * 2

      // Topic background
      ctx.fillStyle = colors.surface0
      roundedRect(ctx, topicX, topicsY - 30, topicWidth, 40, 20)
      ctx.fill()

      // Topic text
      ctx.fillStyle = colors.text
      ctx.fillText(topic, topicX + padding, topicsY)

      topicX += topicWidth + 10
    })
  }

  return canvas
}

