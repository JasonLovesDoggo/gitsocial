export const truncateText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string => {
  if (ctx.measureText(text).width <= maxWidth) return text

  let truncated = text
  while (ctx.measureText(truncated + "...").width > maxWidth) {
    truncated = truncated.slice(0, -1)
  }
  return truncated + "..."
}

export const formatDate = (date: string): string => {
  const d = new Date(date)
  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    "day",
  )
}

export const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + width, y, x + width, y + height, radius)
  ctx.arcTo(x + width, y + height, x, y + height, radius)
  ctx.arcTo(x, y + height, x, y, radius)
  ctx.arcTo(x, y, x + width, y, radius)
  ctx.closePath()
}

