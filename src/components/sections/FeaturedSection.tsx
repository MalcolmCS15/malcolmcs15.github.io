import { Box, Container, Heading, Text, Flex, HStack, useColorModeValue, useColorMode } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { buildCategoryThemes } from '@/config/theme'

/**
 * Featured section — a clickable "cover card" for one project.
 *
 * Which project: set `"featuredProjectTitle"` in site.json to the exact
 * project title. Falls back to the newest project with `featured: true`.
 * Clicking the card goes to the Projects page.
 */
const FeaturedSection: React.FC = () => {
  const { t } = useTranslation()
  const { projects, siteConfig } = useLocalizedData()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const tagBg = useColorModeValue('gray.100', 'gray.700')

  const cfg = siteConfig as Record<string, unknown>
  const wantedTitle = cfg.featuredProjectTitle as string | undefined
  const project =
    (wantedTitle && projects.find(p => p.title === wantedTitle)) ||
    [...projects]
      .filter(p => p.featured)
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))[0]

  if (!project) return null

  const ct = buildCategoryThemes(isDark)[project.category]

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.featured', 'Featured')}</Heading>
          <Box flex="1" h="1px" bg={borderColor} />
        </Flex>

        <Box
          as={RouterLink}
          to="/projects"
          display="block"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
          borderLeft="4px solid"
          borderLeftColor={ct.border}
          borderRadius="md"
          p={[4, 5, 6]}
          transition="all 0.2s"
          _hover={{
            transform: 'translateY(-3px)',
            boxShadow: `0 8px 24px ${ct.glow}`,
            borderColor: ct.border,
          }}
        >
          <HStack spacing={2} mb={2} flexWrap="wrap">
            <Text fontSize="2xs" fontFamily="mono" fontWeight="bold" color={ct.color} bg={ct.bg} px={2} py={0.5} borderRadius="sm" letterSpacing="wide">
              {ct.label}
            </Text>
            {project.badge && (
              <Text fontSize="2xs" fontFamily="mono" color={textColor}>{project.badge}</Text>
            )}
          </HStack>

          <Heading size="md" color={headingColor} mb={2}>{project.title}</Heading>

          <Text fontSize="sm" lineHeight="tall" color={textColor} noOfLines={3} mb={3}>
            {project.summary}
          </Text>

          <Flex align="center" justify="space-between" flexWrap="wrap" gap={2}>
            <HStack spacing={2} flexWrap="wrap">
              {project.tags.slice(0, 6).map(tag => (
                <Text key={tag} fontSize="2xs" fontFamily="mono" px={2} py={0.5} bg={tagBg} color={textColor} borderRadius="sm">
                  {tag}
                </Text>
              ))}
            </HStack>
            <Text fontSize="xs" fontFamily="mono" color={ct.color} flexShrink={0}>
              {t('about.viewProject', 'view project')} →
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}

export default FeaturedSection
