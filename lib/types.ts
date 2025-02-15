import {ThemeName} from "@/lib/themes";

export interface RepoData {
  name: string
  owner: string
  description: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  license?: {
    name: string
  }
  language: string
  updated_at: string
  contributors: Array<{
    avatar_url: string
    login: string
  }>
  topics: string[]
}

export type PreviewStyle = "classic" | "modern" | "minimal" | "dashboard"

export interface PreviewOptions {
  theme: ThemeName
  style: PreviewStyle
  width?: number
  height?: number
}

export interface PreviewGeneratorProps {
  repoData: RepoData
  options: PreviewOptions
}

