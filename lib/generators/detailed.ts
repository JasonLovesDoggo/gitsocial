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
  // @ts-ignore
  const repoText = `${repoData.owner?.login || "Unknown"}/${repoData.name || "Unknown"}`
  ctx.fillText(truncateText(ctx, repoText, canvas.width - 150), 75, 100)

  // Description
  ctx.font = "28px system-ui"
  ctx.fillStyle = colors.subtext1
  const description = truncateText(ctx, repoData.description || "No description available", canvas.width - 150)
  ctx.fillText(description, 75, 160)

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const last_pushed = formatDate(repoData.pushed_at)
  const created_at = formatDate(repoData.created_at)

  // Stats in two columns
  const leftStats = [
    { label: "Language", value: repoData.language || "N/A", icon: "🔠", color: colors.text },
    { label: "Created", value: created_at, icon: "📅", color: colors.blue },
    { label: "Last Push", value: last_pushed, icon: "🔄", color: colors.green },
  ]

  const rightStats = [
    { label: "Stars", value: repoData.stargazers_count?.toLocaleString() || "0", icon: "★", color: colors.yellow },
    { label: "Forks", value: repoData.forks_count?.toLocaleString() || "0", icon: "⑂", color: colors.text },
    { label: "Issues", value: repoData.open_issues_count?.toLocaleString() || "0", icon: "◉", color: colors.red },
  ]

  // Draw left column
  const statsY = 220
  const colWidth = (canvas.width - 150) / 2

  leftStats.forEach((stat, i) => {
    const y = statsY + i * 60

    // Icon
    ctx.font = "bold 32px system-ui"
    ctx.fillStyle = stat.color
    ctx.fillText(stat.icon, 75, y)

    // Label
    ctx.font = "bold 26px system-ui"
    ctx.fillStyle = colors.subtext1
    ctx.fillText(stat.label + ":", 115, y)

    // Value
    ctx.font = "26px system-ui"
    ctx.fillStyle = colors.text
    ctx.fillText(stat.value, 115 + ctx.measureText(stat.label + ":").width + 10, y)
  })

  // Draw right column
  rightStats.forEach((stat, i) => {
    const y = statsY + i * 60

    // Icon
    ctx.font = "bold 32px system-ui"
    ctx.fillStyle = stat.color
    ctx.fillText(stat.icon, 75 + colWidth, y)

    // Label
    ctx.font = "bold 26px system-ui"
    ctx.fillStyle = colors.subtext1
    ctx.fillText(stat.label + ":", 115 + colWidth, y)

    // Value
    ctx.font = "26px system-ui"
    ctx.fillStyle = colors.text
    ctx.fillText(stat.value, 115 + colWidth + ctx.measureText(stat.label + ":").width + 10, y)
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

  // Load and draw contributor avatars
  const avatarSize = 85
  const maxAvatars = 5
  repoData.contributors?.slice(0, maxAvatars).forEach((contributor, i) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(
          canvas.width - 70 - i * (avatarSize + 10),
          canvas.height - avatarSize/2 - 40,
          avatarSize / 2,
          0,
          Math.PI * 2
      )
      ctx.clip()
      ctx.drawImage(
          img,
          canvas.width - 70 - i * (avatarSize + 10) - avatarSize/2,
          canvas.height - avatarSize - 40,
          avatarSize,
          avatarSize
      )
      ctx.restore()
    }
    img.src = contributor.avatar_url
  })

  return canvas
}