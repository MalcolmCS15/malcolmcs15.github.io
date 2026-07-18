// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

// ============================================================
// Data loader (multi-language ready)
//
// Loads content from two sources per language:
//   - Markdown files (content/**/*.md)
//   - JSON files (content/*.json)
//
// Currently English-only. To add a language (e.g. Spanish),
// mirror the English globs/imports against content/es/ and
// register the dataset in dataByLang below.
// ============================================================

import type {
  Research, Experience, NewsItem, About, Publication,
  ProjectItem, Award, ExperienceEntry, Talk, TeachingEntry,
} from '../types'

// ── Markdown glob imports (each .md → { frontmatter..., body: html }) ──

// English (default)
const projectMdsEn = import.meta.glob('/content/projects/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const articleMdsEn = import.meta.glob('/content/articles/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const publicationMdsEn = import.meta.glob('/content/publications/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const experienceMdsEn = import.meta.glob('/content/experience/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const aboutMdEn = import.meta.glob('/content/about.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>

// To add another language (e.g. Spanish), mirror the English globs above
// against a content/es/ directory and build an `esData` object like `enData`.

function collectMd(modules: Record<string, { default: Record<string, unknown> }>): Record<string, unknown>[] {
  return Object.values(modules).map(m => {
    const { body, ...frontmatter } = m.default
    return { ...frontmatter, _body: body }
  })
}

// Undo the entity escaping marked applies to text content
function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
}

// Convert Markdown body (already rendered to HTML) into the fields components expect
function mdToProject(raw: Record<string, unknown>): ProjectItem {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''

  // Bullet list items become resume-style highlights
  const highlights = [...bodyStr.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map(m => htmlToText(m[1]))
    .filter(Boolean)

  // Summary = intro content before the first heading or list
  const summary = htmlToText(bodyStr.split(/<(?:h\d|ul|ol)[\s>]/)[0])

  return {
    summary,
    highlights: highlights.length > 0 ? highlights : undefined,
    ...rest,
  } as unknown as ProjectItem
}

function mdToPublication(raw: Record<string, unknown>): Publication {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''
  const abstract = htmlToText(bodyStr)
  return { abstract, ...rest } as unknown as Publication
}

// One experience .md per role: frontmatter fields + bullet body → highlights.
// The Experience page sorts by `start` date itself, so file order doesn't matter.
function mdToExperience(raw: Record<string, unknown>): ExperienceEntry {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''
  const highlights = [...bodyStr.matchAll(/<li>([\s\S]*?)<\/li>/g)]
    .map(m => htmlToText(m[1]))
    .filter(Boolean)
  return { ...rest, highlights } as unknown as ExperienceEntry
}

function mdToAbout(raw: Record<string, unknown>): About {
  // about.md is imported directly (not via collectMd), so its rendered
  // markdown arrives as `body`, not `_body`
  const { body, ...rest } = raw
  const bodyStr = (body as string) || ''
  const journey = bodyStr.replace(/<[^>]+>/g, '').trim()
  // bodyHtml keeps the rendered markdown body for full-page display (Bio page)
  return { journey, bodyHtml: bodyStr, ...rest } as unknown as About
}

// ── JSON imports (both languages) ──

import educationJsonEn from '@content/education.json'
import newsJsonEn from '@content/news.json'
import awardsJsonEn from '@content/awards.json'
import researchJsonEn from '@content/research.json'
import logosJsonEn from '@content/logos.json'
import siteJsonEn from '@content/site.json'
import talksJsonEn from '@content/talks.json'
import teachingJsonEn from '@content/teaching.json'

// ── Build language datasets ──

const enData = {
  projects: collectMd(projectMdsEn).map(mdToProject),
  articles: collectMd(articleMdsEn).map(mdToProject),
  publications: collectMd(publicationMdsEn).map(mdToPublication),
  about: mdToAbout(Object.values(aboutMdEn)[0]?.default ?? {}),
  research: researchJsonEn as Research,
  experience: { ...educationJsonEn, professional: [], academic: [] } as Experience,
  experienceTimeline: collectMd(experienceMdsEn).map(mdToExperience),
  news: newsJsonEn as NewsItem[],
  awards: awardsJsonEn as Award[],
  talks: talksJsonEn as Talk[],
  teaching: teachingJsonEn as TeachingEntry[],
  institutionLogos: logosJsonEn as Record<string, string>,
  siteConfig: siteJsonEn,
}

// Register additional language datasets here (e.g. { en: enData, es: esData })
const dataByLang: Record<string, typeof enData> = { en: enData }

/** Get content data for a specific language (falls back to English).
 *  Accepts region-suffixed codes like 'es-MX' from browser detection. */
export function getLocalizedData(lang: string) {
  const base = lang?.toLowerCase().split('-')[0]
  return dataByLang[base] ?? enData
}

// ── Default exports (English, for backward compatibility) ──

export const projects = enData.projects
export const articles = enData.articles
export const publications = enData.publications
export const about = enData.about
export const research = enData.research
export const experience = enData.experience
export const experienceTimeline = enData.experienceTimeline
export const news = enData.news
export const awards = enData.awards
export const talks = enData.talks
export const teaching = enData.teaching
export const institutionLogos = enData.institutionLogos

// ── Helper functions ──

export const getPublicationsByYear = (year: number) =>
  publications.filter(pub => pub.year === year)

export const getPublicationsByVenue = (venueType: string) =>
  publications.filter(pub => pub.venueType === venueType)

export const getFirstAuthorPublications = () =>
  publications.filter(pub => pub.isFirstAuthor)

export const getPublicationStats = () => {
  const stats = {
    total: publications.length,
    byYear: {} as Record<number, number>,
    byVenue: {} as Record<string, number>,
    firstAuthor: 0,
    correspondingAuthor: 0,
    withCode: 0,
    withDataset: 0,
  }
  publications.forEach(pub => {
    stats.byYear[pub.year] = (stats.byYear[pub.year] || 0) + 1
    stats.byVenue[pub.venueType] = (stats.byVenue[pub.venueType] || 0) + 1
    if (pub.isFirstAuthor) stats.firstAuthor++
    if (pub.isCorrespondingAuthor) stats.correspondingAuthor++
    if (pub.links.code) stats.withCode++
    if (pub.links.dataset) stats.withDataset++
  })
  return stats
}
