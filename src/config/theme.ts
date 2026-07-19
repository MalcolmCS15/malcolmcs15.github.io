// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { IconType } from 'react-icons'
import { FaBrain, FaGlobe } from 'react-icons/fa'
import type { ProjectItem } from '../types'

/**
 * Terminal palette, category themes, and color config.
 *
 * Template users: customise these to match your own brand.
 */

/* ── Nord-inspired terminal palette (single source of truth) ──── */
export const terminalPalette = {
  /** 7-color rainbow bar palette */
  rainbow: ['#bf616a', '#d08770', '#ebcb8b', '#a3be8c', '#88c0d0', '#5e81ac', '#b48ead'] as const,

  /** All semantic terminal colors, dark/light variants */
  colors: (dk: boolean) => ({
    bg:        dk ? '#2e3440' : '#f8f9fc',
    text:      dk ? '#eceff4' : '#2b3648',
    header:    dk ? '#3b4252' : '#eaeef6',
    border:    dk ? '#4c566a' : '#cbd5e1',
    prompt:    dk ? '#a3be8c' : '#36805a',
    command:   dk ? '#88c0d0' : '#2a769c',
    param:     dk ? '#b48ead' : '#9a56a2',
    info:      dk ? '#81a1c1' : '#5079ad',
    highlight: dk ? '#ebcb8b' : '#c47d46',
    error:     dk ? '#bf616a' : '#b91c1c',
    success:   dk ? '#a3be8c' : '#34744e',
    warning:   dk ? '#d08770' : '#b35a2e',
    secondary: dk ? '#9099ab' : '#4a5568',
    muted:     dk ? '#627089' : '#718096',
    /** Touch bar background */
    touchBar:  dk ? '#252b35' : '#e2e6ee',
    /** Tab bar background */
    tabBar:    dk ? '#333a47' : '#e4e9f2',
  }),
} as const

/* ── Project category themes ──────────────────────────────────── */
export type CatTheme = {
  bg: string; border: string; stripe: string; color: string; glow: string
  icon: IconType; label: string; cmd: string
}

export const buildCategoryThemes = (dk: boolean): Record<ProjectItem['category'], CatTheme> => ({
  'web-app': {
    bg: dk ? '#2e2c2b' : '#fff2e9', border: dk ? '#d39d6b' : '#e2b287',
    stripe: 'linear-gradient(180deg,#ffb680,transparent)',
    color: dk ? '#ffbe8d' : '#c27435', glow: dk ? 'rgba(255,182,128,0.25)' : 'rgba(194,116,53,0.12)',
    icon: FaGlobe, label: 'WEB / APP', cmd: '$ npm run dev',
  },
  'ai-ml': {
    bg: dk ? '#243126' : '#eafff0', border: dk ? '#56b07b' : '#77d09a',
    stripe: 'linear-gradient(180deg,#6bd59c,transparent)',
    color: dk ? '#7ce3b6' : '#2f9e6a', glow: dk ? 'rgba(107,213,156,0.25)' : 'rgba(47,158,106,0.12)',
    icon: FaBrain, label: 'AI / ML', cmd: '$ python train.py',
  },
})

/* ── Article category labels & colors ─────────────────────────── */
export const articleCategoryLabels: Record<ProjectItem['category'], string> = {
  'web-app': 'Web / App', 'ai-ml': 'AI / ML',
}

export const articleCategoryColors: Record<ProjectItem['category'], { fg: (dk: boolean) => string; bg: (dk: boolean) => string }> = {
  'web-app':  { fg: dk => dk ? '#ffbe8d' : '#c27435', bg: dk => dk ? 'rgba(255,190,141,0.15)' : 'rgba(194,116,53,0.1)' },
  'ai-ml':    { fg: dk => dk ? '#7ce3b6' : '#2f9e6a', bg: dk => dk ? 'rgba(124,227,182,0.15)' : 'rgba(47,158,106,0.1)' },
}

/* ── Publication venue colors ─────────────────────────────────── */
export const publicationVenueColors: Record<string, { bg: (dk: boolean) => string; fg: (dk: boolean) => string; label: string }> = {
  conference: {
    bg: dk => dk ? 'rgba(136, 192, 208, 0.15)' : 'rgba(42, 118, 156, 0.1)',
    fg: dk => dk ? '#88c0d0' : '#2a769c',
    label: 'CONFERENCE',
  },
  workshop: {
    bg: dk => dk ? 'rgba(180, 142, 173, 0.15)' : 'rgba(154, 86, 162, 0.1)',
    fg: dk => dk ? '#b48ead' : '#9a56a2',
    label: 'WORKSHOP',
  },
  demo: {
    bg: dk => dk ? 'rgba(208, 135, 112, 0.15)' : 'rgba(179, 90, 46, 0.1)',
    fg: dk => dk ? '#d08770' : '#b35a2e',
    label: 'DEMO TRACK',
  },
  preprint: {
    bg: dk => dk ? 'rgba(163, 190, 140, 0.15)' : 'rgba(54, 128, 90, 0.1)',
    fg: dk => dk ? '#a3be8c' : '#36805a',
    label: 'PREPRINT',
  },
}
