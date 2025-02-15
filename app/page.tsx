"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ThemeName, themes } from "@/lib/themes"
import type { RepoData } from "@/lib/types"
import { generatePreview } from "@/lib/generators"
import { Github, Download } from "lucide-react"

const previewStyles = [
    { value: "classic", label: "Classic" },
    { value: "compact", label: "Compact" },
    { value: "detailed", label: "Detailed" },
    { value: "minimal", label: "Minimal" },
]

export default function Home() {
    const [repoUrl, setRepoUrl] = useState("")
    const [theme, setTheme] = useState<ThemeName>("catppuccin_mocha")
    const [repoData, setRepoData] = useState<RepoData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const shouldGeneratePreviewsRef = useRef(false)

    // Effect to handle the second click simulation
    useEffect(() => {
        if (shouldGeneratePreviewsRef.current && repoData) {
            shouldGeneratePreviewsRef.current = false

            // Add a small delay to ensure the DOM elements are ready
            const timer = setTimeout(() => {
                generatePreviews()
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [repoData])

    const fetchRepoData = async () => {
        try {
            setLoading(true)
            setError(null)
            const [owner, repo] = repoUrl.replace("https://github.com/", "").split("/").filter(Boolean)

            if (!owner || !repo) {
                throw new Error("Invalid GitHub URL")
            }

            const [repoResponse, contributorsResponse] = await Promise.all([
                fetch(`https://api.github.com/repos/${owner}/${repo}`),
                fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=6`),
            ])

            if (!repoResponse.ok || !contributorsResponse.ok) {
                throw new Error("Failed to fetch repository data")
            }

            const repoInfo = await repoResponse.json()
            const contributors = await contributorsResponse.json()

            const newRepoData = {
                ...repoInfo,
                contributors,
            }

            // Set flag to trigger preview generation after state update
            shouldGeneratePreviewsRef.current = true
            setRepoData(newRepoData)

        } catch (error) {
            console.error("Error fetching repo data:", error)
            setError(error instanceof Error ? error.message : "An unknown error occurred")
        } finally {
            setLoading(false)
        }
    }

    const generatePreviews = () => {
        if (!repoData) return

        previewStyles.forEach((style) => {
            const canvas = document.getElementById(`preview-canvas-${style.value}`) as HTMLCanvasElement
            if (canvas) {
                generatePreview(canvas, {
                    repoData: repoData,
                    options: {
                        theme,
                        style: style.value as any,
                    },
                })
            }
        })
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#1e1e2e] text-[#cdd6f4]">
            <main className="flex-grow p-8 flex flex-col items-center">
                <div className="max-w-6xl w-full space-y-8">
                    <div className="space-y-4 text-center">
                        <h1 className="text-3xl font-bold">GitSocial - Github Social Preview Generator</h1>
                        <p className="text-[#bac2de]">Generate beautiful social preview images for your GitHub
                            repositories</p>
                    </div>

                    <div className="grid gap-6 max-w-xl mx-auto w-full">
                        <div className="grid gap-2">
                            <Label htmlFor="repo-url">Repository URL</Label>
                            <Input
                                id="repo-url"
                                placeholder="https://github.com/JasonLovesDoggo/gitsocial"
                                value={repoUrl}
                                onChange={(e) => setRepoUrl(e.target.value)}
                                className="bg-[#313244] border-0"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="theme">Theme</Label>
                            <Select value={theme} onValueChange={(value: ThemeName) => setTheme(value)}>
                                <SelectTrigger className="bg-[#313244] border-0">
                                    <SelectValue placeholder="Select theme"/>
                                </SelectTrigger>
                                <SelectContent className="capitalize bg-[#313244]">
                                    {Object.keys(themes).map((themeName) => (
                                        <SelectItem className="text-[#bac2de]" key={themeName} value={themeName}>
                                            {themeName.replace("_", " ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            onClick={fetchRepoData}
                            disabled={loading}
                            className="bg-[#f5c2e7] text-[#1e1e2e] hover:bg-[#f5c2e7]/90"
                        >
                            {loading ? "Generating..." : "Generate Previews"}
                        </Button>
                    </div>

                    {error && <div className="bg-red-500 text-white p-4 rounded-md max-w-xl mx-auto w-full">{error}</div>}

                    {repoData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                            {previewStyles.map((style) => (
                                <div key={style.value} className="space-y-4">
                                    <div className="relative group">
                                        <canvas
                                            id={`preview-canvas-${style.value}`}
                                            className="w-full rounded-xl shadow-2xl transition-transform duration-200 group-hover:scale-[1.02]"
                                            style={{aspectRatio: "2/1"}}
                                        />
                                        <Button
                                            onClick={() => {
                                                const canvas = document.getElementById(`preview-canvas-${style.value}`) as HTMLCanvasElement
                                                if (canvas) {
                                                    const link = document.createElement("a")
                                                    link.download = `${repoData.name}-preview-${style.value}.png`
                                                    link.href = canvas.toDataURL("image/png")
                                                    link.click()
                                                }
                                            }}
                                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#a6e3a1] text-[#1e1e2e] hover:bg-[#a6e3a1]/90"
                                        >
                                            <Download className="w-4 h-4"/>
                                            <span className="sr-only">Download</span>
                                        </Button>
                                    </div>
                                    <h2 className="text-lg font-medium capitalize">{style.label} Style</h2>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <footer className="bg-[#181825] text-[#cdd6f4] py-4">
                <div className="max-w-6xl mx-auto px-8 flex justify-between items-center">
                    <p>Made by <a className="text-[#cdd6f4] hover:text-[#f5c2e7]"
                                  href="http://jasoncameron.dev"> Jason Cameron</a></p>
                    <a
                        href="https://github.com/JasonLovesDoggo/gitsocial"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#cdd6f4] hover:text-[#f5c2e7]"
                    >
                        <Github className="w-6 h-6"/>
                        <span className="sr-only">GitHub</span>
                    </a>
                </div>
            </footer>
        </div>
    )
}