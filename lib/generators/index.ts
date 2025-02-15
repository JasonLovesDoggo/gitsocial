import { classicPreview } from "./classic"
import { compactPreview } from "./compact"
import { detailedPreview } from "./detailed"
import { minimalPreview } from "./minimal"
import type { PreviewGeneratorProps, PreviewStyle } from "../types"

const generators: Record<
  PreviewStyle,
  (props: PreviewGeneratorProps & { canvas: HTMLCanvasElement }) => HTMLCanvasElement
> = {
  classic: classicPreview,
  compact: compactPreview,
  detailed: detailedPreview,
  minimal: minimalPreview,
}

export const generatePreview = (canvas: HTMLCanvasElement, props: PreviewGeneratorProps): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas

  // Set canvas size
  canvas.width = props.options.width || 1200
  canvas.height = props.options.height || 600

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Generate preview based on style
  const generator = generators[props.options.style]
  if (typeof generator === "function") {
    return generator({ ...props, canvas })
  } else {
    console.error(`Generator for style "${props.options.style}" not found`)
    return canvas
  }
}

