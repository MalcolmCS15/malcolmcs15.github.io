import React, { useCallback, useMemo, useState } from 'react'
import {
  Box, Collapse, Flex, HStack, Icon, Input, Link, Text, VStack,
  Image, useColorMode, useColorModeValue,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { IconType } from 'react-icons'
import {
  FaFolderOpen, FaUser, FaCrown, FaCog, FaSync, FaChevronDown,
  FaGithub, FaMedium, FaYoutube, FaExternalLinkAlt, FaPlay, FaPause,
} from 'react-icons/fa'
import { SiZhihu, SiCsdn } from 'react-icons/si'
import { useTranslation } from 'react-i18next'
import type { ProjectItem } from '../types'
import { withBase } from '@/utils/asset'
import { highlightData } from '@/utils/highlightData'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { buildCategoryThemes, terminalPalette, type CatTheme } from '@/config/theme'

/* ── Keyframes ─────────────────────────────────────────────────── */
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`
const bob = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}`

/* ── Types ─────────────────────────────────────────────────────── */
type TP = ProjectItem & { id: string }
type TabKey = 'all' | ProjectItem['category']

type CatThemeWithAnim = CatTheme & { anim: string }

/* ── Category themes (from config, with animation added) ──────── */
const buildThemes = (dk: boolean): Record<ProjectItem['category'], CatThemeWithAnim> => {
  const base = buildCategoryThemes(dk)
  const b = bob
  const durations: Record<ProjectItem['category'], number> = {
    'web-app': 2.0, 'ai-ml': 2.4,
  }
  const result = {} as Record<ProjectItem['category'], CatThemeWithAnim>
  for (const [k, v] of Object.entries(base) as [ProjectItem['category'], CatTheme][]) {
    result[k] = { ...v, anim: `${b} ${durations[k]}s ease-in-out infinite` }
  }
  return result
}

/* ── Role config ───────────────────────────────────────────────── */
const roleConfig: Record<string, { textKey: string; icon: IconType; color: (d: boolean) => string }> = {
  independent: { textKey: 'projects.independent', icon: FaUser,   color: d => d ? '#ebcb8b' : '#c47d46' },
  lead:        { textKey: 'projects.lead',        icon: FaCrown,  color: d => d ? '#d08770' : '#b35a2e' },
  'co-lead':   { textKey: 'projects.coLead',      icon: FaCrown,  color: d => d ? '#d08770' : '#b35a2e' },
  'tech-lead': { textKey: 'projects.techLead',    icon: FaCog,    color: d => d ? '#88c0d0' : '#2a769c' },
  maintainer:  { textKey: 'projects.maintainer',  icon: FaSync,   color: d => d ? '#a3be8c' : '#36805a' },
}

/* ── Helpers ────────────────────────────────────────────────────── */
const linkIcon = (url: string): IconType => {
  if (url.includes('github.com')) return FaGithub
  if (url.includes('medium.com')) return FaMedium
  if (url.includes('youtu.be') || url.includes('youtube.com')) return FaYoutube
  if (url.includes('zhihu.com')) return SiZhihu
  if (url.includes('csdn.net')) return SiCsdn
  return FaExternalLinkAlt
}

const fmtDate = (v?: string) => {
  if (!v) return '—'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}
const getYear = (v?: string) => {
  if (!v) return 'Unknown'
  const d = new Date(v)
  return Number.isNaN(d.getTime()) ? 'Unknown' : String(d.getFullYear())
}

/* ── Flow Node (About-page design language) ──────────────────── */
const FlowNode: React.FC<{
  item: TP; ct: CatTheme; isDark: boolean; isLast: boolean
  termText: string
  termSecondary: string; termMuted: string; termBorder: string
  hlc: { num: string; kw: string; str: string }
  onImageClick: (src: string, alt: string) => void
}> = ({ item, ct, isDark, isLast: _isLast, termText, termSecondary, termMuted, termBorder, hlc, onImageClick }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  // Animated GIFs with a poster start paused: poster shows until play is clicked
  const [gifPlaying, setGifPlaying] = useState(false)
  const role = roleConfig[item.role || 'independent']
  const hasImg = !!item.featuredImage
  const hasPoster = !!item.featuredImagePoster
  const imgSrc = hasPoster && !gifPlaying ? item.featuredImagePoster! : item.featuredImage!
  const res: { label: string; url: string }[] = []
  if (item.link?.trim()) res.push({ label: t('projects.source'), url: item.link.trim() })
  item.extraLinks?.forEach(l => { if (!res.some(r => r.url === l.url)) res.push(l) })
  const hasExpandable = !!item.story

  return (
    <Flex gap={[3, 3, 4]} align="start" py={3} position="relative">
      {/* Dot — hollow ring, filled for featured/last */}
      <Box flexShrink={0} mt="6px">
        <Box
          w="14px" h="14px" borderRadius="full"
          border="2px solid"
          borderColor={item.featured ? ct.color : termBorder}
          bg={item.featured ? ct.color : 'transparent'}
          boxShadow={item.featured ? `0 0 8px ${ct.glow}` : undefined}
          transition="all 0.2s"
        />
      </Box>

      {/* Content */}
      <Box flex={1} minW={0}>
        {/* Category + Role + Date label line */}
        <HStack spacing={2} mb={1} flexWrap="wrap" align="center">
          <Box h="2px" w="16px" bg={ct.color} borderRadius="full" />
          <HStack spacing={1} color={ct.color}>
            <Icon as={ct.icon} boxSize="10px" />
            <Text fontSize="2xs" fontFamily="mono" fontWeight="semibold"
              letterSpacing="wide" textTransform="uppercase">
              {ct.label}
            </Text>
          </HStack>
          <Text fontSize="2xs" color={termBorder}>/</Text>
          <HStack spacing={1}>
            <Icon as={role.icon} boxSize="9px" color={role.color(isDark)} />
            <Text fontSize="2xs" fontFamily="mono" color={role.color(isDark)} fontWeight="bold">
              {t(role.textKey)}
            </Text>
          </HStack>
          <Text fontSize="2xs" fontFamily="mono" color={termMuted} ml="auto" flexShrink={0}>
            {fmtDate(item.date)}
          </Text>
        </HStack>

        {/* Title */}
        <Text fontSize={['sm', 'md']} fontWeight="semibold" lineHeight="tall"
          color={termText} mb={1}
          cursor={hasExpandable ? 'pointer' : undefined}
          transition="color 0.15s"
          _hover={hasExpandable ? { color: ct.color } : undefined}
          onClick={hasExpandable ? () => setExpanded(p => !p) : undefined}>
          {item.title}
          {item.featured && (
            <Text as="span" ml={2} fontSize="xs" color={hlc.num}>★</Text>
          )}
        </Text>

        {/* Badges */}
        {item.badge && (
          <HStack spacing={1.5} mb={2} flexWrap="wrap">
            <Text fontSize="2xs" fontFamily="mono" px={2} py={0.5} borderRadius="sm"
              border={`1px solid ${ct.border}`} color={ct.color}
              bg={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}>
              {item.badge}
            </Text>
          </HStack>
        )}

        {/* Body: image left + summary right */}
        <Flex direction={['column', 'column', hasImg ? 'row-reverse' : 'column']}
          gap={[3, 3, 4]} align="stretch">
          {hasImg && (
            <VStack flexShrink={0} w={['full', 'full', '260px']} align="stretch" spacing={1.5}>
              <Box
                w="full"
                minH={['180px', '200px', 'auto']}
                cursor="zoom-in" overflow="hidden" borderRadius="sm"
                position="relative"
                onClick={() => {
                  const img = item.featuredImage
                  if (img) onImageClick(withBase(img) as string, item.title)
                }}
              >
                <Image src={withBase(imgSrc)} alt={item.title}
                  w="full" h="full" objectFit="contain"
                  bg={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)'} p={1}
                  transition="transform 0.3s" _hover={{ transform: 'scale(1.03)' }} />
                {hasPoster && (
                  <Flex
                    position="absolute"
                    bottom={2} right={2}
                    align="center" justify="center"
                    w="30px" h="30px" borderRadius="full"
                    bg="rgba(0,0,0,0.55)" color="white"
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{ bg: 'rgba(0,0,0,0.75)', transform: 'scale(1.1)' }}
                    onClick={e => { e.stopPropagation(); setGifPlaying(p => !p) }}
                    title={gifPlaying ? 'Pause' : 'Play'}
                  >
                    <Icon as={gifPlaying ? FaPause : FaPlay} boxSize="11px" ml={gifPlaying ? 0 : '2px'} />
                  </Flex>
                )}
              </Box>
              {item.featuredImageCaption && (
                <Text fontSize="2xs" lineHeight="short" color={termSecondary}
                  fontStyle="italic" textAlign="center" px={1}>
                  {item.featuredImageCaption}
                </Text>
              )}
            </VStack>
          )}

          <VStack align="start" spacing={2.5} flex={1} minW={0} justify="center">
            {/* Summary */}
            <Text fontSize="xs" lineHeight="tall" color={termSecondary}>
              {highlightData(item.summary, hlc)}
            </Text>

            {/* Highlights as resume-style bullets */}
            {item.highlights && item.highlights.length > 0 && (
              <Box>
                {item.highlights.map((h, i) => (
                  <Text key={i} fontSize="xs" color={termSecondary} lineHeight="1.8">
                    <Text as="span" color={ct.color} mr={1.5}>▸</Text>{highlightData(h, hlc)}
                  </Text>
                ))}
              </Box>
            )}

            {/* Divider */}
            <Box w="full" h="1px" bg={termBorder} opacity={0.4} />

            {/* Links + Expand button row */}
            <HStack spacing={1.5} flexWrap="wrap">
              {res.map(r => (
                <Link key={r.url} href={r.url} isExternal
                  onClick={e => e.stopPropagation()} _hover={{ textDecoration: 'none' }}>
                  <HStack spacing={1.5} px={2.5} py={1} borderRadius="sm"
                    border="1px solid" borderColor={termBorder}
                    color={termSecondary} fontSize="xs" fontFamily="mono"
                    transition="all 0.15s"
                    _hover={{ borderColor: ct.color, color: ct.color }}>
                    <Icon as={linkIcon(r.url)} boxSize="11px" />
                    <Text>{r.label}</Text>
                  </HStack>
                </Link>
              ))}
              {hasExpandable && (
                <HStack as="button" spacing={1.5} px={2.5} py={1} borderRadius="sm"
                  border="1px solid" fontSize="xs" fontFamily="mono"
                  borderColor={expanded ? ct.color : termBorder}
                  color={expanded ? ct.color : termSecondary}
                  transition="all 0.15s"
                  _hover={{ borderColor: ct.color, color: ct.color }}
                  onClick={() => setExpanded(p => !p)}>
                  <Icon as={FaChevronDown} boxSize="8px"
                    transition="transform 0.15s"
                    transform={expanded ? 'rotate(180deg)' : undefined} />
                  <Text>{expanded ? t('projects.less') : t('projects.details')}</Text>
                </HStack>
              )}
            </HStack>

            {/* Tags as simple pills */}
            {item.tags.length > 0 && (
              <HStack spacing={1.5} flexWrap="wrap">
                {item.tags.map(t => (
                  <Text key={t} fontSize="2xs" fontFamily="mono"
                    color={termMuted} px={1.5} py={0.5}
                    bg={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                    borderRadius="sm">
                    {t}
                  </Text>
                ))}
              </HStack>
            )}
          </VStack>
        </Flex>

        {/* Expandable details */}
        <Collapse in={expanded} animateOpacity>
          <VStack align="stretch" spacing={3} mt={3}>
            {item.story && (
              <Box p={3} bg={isDark ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.02)'}
                borderRadius="md" borderLeft="2px solid" borderLeftColor={ct.color}>
                <Text fontSize={['xs', 'xs']} lineHeight="tall" color={termMuted} fontStyle="italic">
                  "{highlightData(item.story, hlc)}"
                </Text>
              </Box>
            )}
          </VStack>
        </Collapse>
      </Box>
    </Flex>
  )
}

/* ══════════════════════════════════════════════════════════════════
   ── Main Projects Component ──
   ══════════════════════════════════════════════════════════════════ */
const Projects: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { t } = useTranslation()
  const { projects: projectData, siteOwner } = useLocalizedData()

  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [imgPreview, setImgPreview] = useState<{ src: string; alt: string } | null>(null)
  const { isOpen: isImgOpen, onOpen: openImg, onClose: closeImg } = useDisclosure()

  /* Terminal palette (centralized) */
  const tc = terminalPalette.colors(isDark)
  const termBg       = tc.bg
  const termText     = tc.text
  const termHeader   = tc.header
  const termTabBar   = tc.tabBar
  const termBorder   = tc.border
  const termPrompt   = tc.prompt
  const termInfo     = tc.info
  const termHighlight = tc.highlight
  const termSecondary = tc.secondary
  const termMuted    = tc.muted
  const termCommand  = tc.command
  const termSuccess  = tc.success
  const hlc = { num: termHighlight, kw: termCommand, str: termSuccess }

  /* Featured (pinned) accent — gold, so the section clearly stands apart from the timeline */
  const featAccent = isDark ? '#ebcb8b' : '#b7791f'
  const featBg     = isDark ? 'rgba(235,203,139,0.07)' : 'rgba(183,121,31,0.06)'
  const featBorder = isDark ? 'rgba(235,203,139,0.38)' : 'rgba(183,121,31,0.32)'
  const featGlow   = isDark ? 'rgba(235,203,139,0.14)' : 'rgba(183,121,31,0.10)'

  const themes = useMemo(() => buildThemes(isDark), [isDark])

  const projects = useMemo<TP[]>(() =>
    projectData.map((p, i) => ({ ...p, id: `p-${i}` }))
  , [projectData])

  /* ── Tabs ── */
  const tabs = useMemo(() => {
    const cnt: Record<string, number> = { all: projects.length }
    projects.forEach(p => { cnt[p.category] = (cnt[p.category] || 0) + 1 })
    const cats: ProjectItem['category'][] = ['ai-ml', 'web-app']
    return [
      { key: 'all' as TabKey, icon: FaFolderOpen, label: t('projects.all'), color: termInfo, count: cnt.all },
      ...cats.filter(k => cnt[k] > 0).map(k => ({
        key: k as TabKey, icon: themes[k].icon, label: t(`category.${k}`),
        color: themes[k].color, count: cnt[k],
      })),
    ]
  }, [projects, themes, termInfo])

  /* ── Filtering + sorting ── */
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return projects
      .filter(p => {
        if (activeTab !== 'all' && p.category !== activeTab) return false
        if (!q) return true
        return [p.title, p.summary, p.tags?.join(' '), p.highlights?.join(' ')]
          .filter(Boolean).some(s => (s as string).toLowerCase().includes(q))
      })
      .sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0
        const db = b.date ? Date.parse(b.date) : 0
        if (da !== db) return db - da
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return a.title.localeCompare(b.title)
      })
  }, [projects, searchQuery, activeTab])

  /* ── Featured (pinned, manual order via featuredRank) ── */
  const featuredItems = useMemo(() =>
    filtered
      .filter(p => p.featured)
      .sort((a, b) => {
        const ra = a.featuredRank ?? Infinity
        const rb = b.featuredRank ?? Infinity
        if (ra !== rb) return ra - rb
        const da = a.date ? Date.parse(a.date) : 0
        const db = b.date ? Date.parse(b.date) : 0
        return db - da
      }),
  [filtered])

  /* ── Year groups (chronological; featured are shown in the pinned section above) ── */
  const yearGroups = useMemo(() => {
    const g: Record<string, TP[]> = {}
    filtered.filter(p => !p.featured).forEach(p => { const y = getYear(p.date); (g[y] ??= []).push(p) })
    return Object.entries(g)
      .sort(([a], [b]) => a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : Number(b) - Number(a))
      .map(([year, items]) => ({ year, items }))
  }, [filtered])

  /* ── Stats ── */
  const filteredIndep = useMemo(() => filtered.filter(p => !p.role || p.role === 'independent').length, [filtered])

  const onImgClick = useCallback((src: string, alt: string) => {
    setImgPreview({ src, alt }); openImg()
  }, [openImg])

  const promptPath = activeTab === 'all' ? '~' : `~/${activeTab}`

  return (
    <Box w="full" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
      <VStack maxW="1400px" mx="auto" spacing={4} px={[2, 4, 8]}>
        <Box
          w="full" borderRadius="md" fontFamily="mono" overflow="hidden"
          boxShadow={`0 0 0 1px ${termBorder}, 0 4px 16px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`}
        >
          {/* ═══ Pixel RGB light bar ═══ */}
          <Flex h="3px" w="full" overflow="hidden" borderTopRadius="md">
            {(() => {
              const palette = ['#bf616a','#d08770','#ebcb8b','#a3be8c','#88c0d0','#5e81ac','#b48ead'];
              const total = 28;
              const tick = Math.floor(Date.now() / 200);
              return Array.from({ length: total }, (_, i) => {
                const colorIdx = (i + tick) % palette.length;
                const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3));
                return <Box key={i} flex={1} h="full" bg={palette[colorIdx]} opacity={brightness} />;
              });
            })()}
          </Flex>

          {/* ═══ TAB BAR ═══ */}
          <Flex
            bg={termTabBar} overflowX="auto" borderBottom={`1px solid ${termBorder}`}
            sx={{ '&::-webkit-scrollbar': { height: '0' } }}
          >
            {tabs.map(tab => {
              const active = activeTab === tab.key
              return (
                <Flex
                  key={tab.key} as="button" align="center" gap={1.5}
                  px={4} py={2} fontSize="xs" fontFamily="mono"
                  color={active ? tab.color : termMuted}
                  bg={active ? termBg : 'transparent'}
                  borderBottom={active ? `2px solid ${tab.color}` : '2px solid transparent'}
                  fontWeight={active ? 'bold' : 'normal'}
                  transition="all 0.15s"
                  _hover={{
                    color: tab.color,
                    bg: active ? termBg : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                  }}
                  onClick={() => setActiveTab(tab.key)}
                  flexShrink={0} whiteSpace="nowrap"
                >
                  <Box sx={active && tab.key !== 'all'
                    ? { animation: themes[tab.key as ProjectItem['category']].anim }
                    : undefined}>
                    <Icon as={tab.icon} boxSize="12px" />
                  </Box>
                  {tab.label}
                  <Text as="span" opacity={0.7}>({tab.count})</Text>
                </Flex>
              )
            })}
          </Flex>

          {/* ═══ TOOLBAR ═══ */}
          <Flex
            px={4} py={2} bg={termBg} borderBottom={`1px solid ${termBorder}`}
            align="center" gap={2} fontSize="xs"
          >
            <Text color={termPrompt} flexShrink={0}>{siteOwner.terminalUsername}@projects:{promptPath}$</Text>
            <Input
              placeholder="grep -i '...'"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              size="xs" variant="unstyled" color={termText} fontFamily="mono"
              flex="1" minW="120px" _placeholder={{ color: termSecondary }}
            />
          </Flex>

          {/* ═══ CONTENT — Timeline Flow ═══ */}
          <Box
            key={activeTab}
            bg={termBg} color={termText}
            maxH="75vh" overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { width: '6px', background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '3px' },
            }}
          >
            <Box px={[3, 4, 5]} py={4}>
              {/* Featured (pinned, curated order) — framed + gold-accented so it
                  visibly pops above the chronological timeline below */}
              {featuredItems.length > 0 && (
                <Box
                  mb={7}
                  position="relative"
                  pl={[3, 4]} pr={[3, 4]} pt={3} pb={3}
                  borderRadius="md"
                  border="1px solid"
                  borderColor={featBorder}
                  bg={featBg}
                  boxShadow={`0 0 20px ${featGlow}`}
                  overflow="hidden"
                >
                  {/* Left accent bar */}
                  <Box position="absolute" left="0" top="0" bottom="0" w="3px" bg={featAccent} />

                  <HStack spacing={2} mb={2.5} pl="2px">
                    <Text fontSize="2xs" fontFamily="mono" color={featAccent}
                      fontWeight="bold" letterSpacing="widest" textTransform="uppercase">
                      ★ {t('projects.featured', 'Featured')}
                    </Text>
                    <Box flex="1" h="1px" bg={featAccent} opacity={0.3} />
                    <Text fontSize="2xs" fontFamily="mono" color={featAccent} opacity={0.85}
                      fontWeight="semibold">
                      {featuredItems.length} {t('projects.projects')}
                    </Text>
                  </HStack>

                  <Box position="relative">
                    <Box position="absolute" left="7px" top="12px" bottom="12px"
                      w="1px" bg={featAccent} opacity={0.45} />
                    <VStack spacing={0} align="stretch">
                      {featuredItems.map((item, idx) => (
                        <FlowNode key={item.id} item={item} ct={themes[item.category]}
                          isDark={isDark} isLast={idx === featuredItems.length - 1}
                          termText={termText}
                          termSecondary={termSecondary} termMuted={termMuted}
                          termBorder={termBorder}
                          hlc={hlc}
                          onImageClick={onImgClick} />
                      ))}
                    </VStack>
                  </Box>
                </Box>
              )}

              {yearGroups.map((group, gi) => (
                <Box key={group.year} mb={gi < yearGroups.length - 1 ? 6 : 0}>
                  {/* Year heading */}
                  <HStack spacing={2} mb={2} pl="2px">
                    <Text fontSize="2xs" fontFamily="mono" color={termHighlight}
                      fontWeight="semibold" letterSpacing="wide">
                      {group.year}
                    </Text>
                    <Box flex="1" h="1px" bg={termBorder} opacity={0.3} />
                    <Text fontSize="2xs" fontFamily="mono" color={termMuted}>
                      {group.items.length} {t('projects.projects')}
                    </Text>
                  </HStack>

                  {/* Timeline with vertical line */}
                  <Box position="relative">
                    {/* Global vertical line */}
                    <Box position="absolute" left="7px" top="12px" bottom="12px"
                      w="1px" bg={termBorder} opacity={0.3} />

                    <VStack spacing={0} align="stretch">
                      {group.items.map((item, idx) => (
                        <FlowNode key={item.id} item={item} ct={themes[item.category]}
                          isDark={isDark} isLast={idx === group.items.length - 1}
                          termText={termText}
                          termSecondary={termSecondary} termMuted={termMuted}
                          termBorder={termBorder}
                          hlc={hlc}
                          onImageClick={onImgClick} />
                      ))}
                    </VStack>
                  </Box>
                </Box>
              ))}
            </Box>

            {filtered.length === 0 && (
              <Box px={4} py={8} textAlign="center">
                <Text color={termHighlight} fontSize="sm">{t('projects.noMatches')}</Text>
                <Text color={termSecondary} fontSize="xs" mt={1}>{t('projects.tryAdjustingSearch')}</Text>
              </Box>
            )}
          </Box>

          {/* ═══ STATUS BAR ═══ */}
          <Flex
            px={4} py={1.5} bg={termHeader} borderTop={`1px solid ${termBorder}`}
            align="center" justify="space-between" fontSize="2xs" color={termMuted}
            flexWrap="wrap" gap={2}
          >
            <HStack spacing={3}>
              <Text>{filtered.length}/{projects.length} {t('projects.shown')}</Text>
              <HStack spacing={1} color={termHighlight}>
                <Icon as={FaUser} boxSize="9px" />
                <Text fontWeight="bold">{filteredIndep} {t('projects.independent')}</Text>
              </HStack>
            </HStack>
            <HStack spacing={1}>
              <Text color={termPrompt}>{siteOwner.terminalUsername}@projects:{promptPath}$</Text>
              <Box w="6px" h="11px" bg={termPrompt} sx={{ animation: `${blink} 1s step-end infinite` }} />
            </HStack>
          </Flex>
        </Box>

        {/* ── Image Modal ── */}
        <Modal isOpen={isImgOpen} onClose={closeImg} size="4xl" isCentered>
          <ModalOverlay bg="rgba(0,0,0,0.75)" backdropFilter="blur(4px)" />
          <ModalContent bg="transparent" boxShadow="none">
            <ModalCloseButton color={isDark ? 'gray.200' : 'gray.700'} />
            <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
              {imgPreview && (
                <Image src={imgPreview.src} alt={imgPreview.alt}
                  maxH="80vh" maxW="90vw" objectFit="contain" borderRadius="md"
                  bg={isDark ? 'rgba(0,0,0,0.85)' : 'white'} p={4}
                  border={`1px solid ${termBorder}`} />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  )
}

export default Projects
