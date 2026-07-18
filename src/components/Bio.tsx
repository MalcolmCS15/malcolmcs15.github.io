import { useEffect } from 'react'
import { Box, Container, Heading, Text, Flex, HStack, VStack, Image, Tag, Icon, Collapse, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import { FaChevronDown } from 'react-icons/fa'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

/** Parse **bold** markers in text */
const renderBoldText = (text: string, color: string, boldColor: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text as="span" key={i} fontWeight="semibold" color={boldColor}>{part.slice(2, -2)}</Text>
    }
    return <Text as="span" key={i} color={color}>{part}</Text>
  })
}

/** Render text with `\n` line breaks as separate lines (each still supporting
 *  **bold**). Wrapped continuation lines are hanging-indented so long entries
 *  like the coursework list stay visually grouped. */
const renderMultiline = (text: string, color: string, boldColor: string) =>
  text.split('\n').map((line, i) => (
    <Text as="span" key={i} display="block" color={color} pl="1.25em" textIndent="-1.25em">
      {renderBoldText(line, color, boldColor)}
    </Text>
  ))

/** Collapsible "Show coursework" dropdown that groups courses by category */
const CourseworkDropdown: React.FC<{
  coursework: { category: string; courses: string[] }[]
  mutedColor: string
}> = ({ coursework, mutedColor }) => {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box pt={1} w="full">
      <HStack
        as="button"
        onClick={onToggle}
        spacing={1.5}
        color="cyan.400"
        fontSize="xs"
        fontFamily="mono"
        transition="opacity 0.15s"
        _hover={{ opacity: 0.75 }}
      >
        <Icon as={FaChevronDown} boxSize="8px" transition="transform 0.15s"
          transform={isOpen ? 'rotate(180deg)' : undefined} />
        <Text>{isOpen ? 'Hide coursework' : 'Show coursework'}</Text>
      </HStack>
      <Collapse in={isOpen} animateOpacity>
        <VStack align="start" spacing={2.5} pt={2.5}>
          {coursework.map(group => (
            <Box key={group.category} w="full">
              <Text fontSize="2xs" fontFamily="mono" fontWeight="bold" color={mutedColor}
                textTransform="uppercase" letterSpacing="wide" mb={1.5}>
                {group.category}
              </Text>
              <HStack spacing={1.5} flexWrap="wrap">
                {group.courses.map(c => (
                  <Tag key={c} size="sm" fontSize="2xs">{c}</Tag>
                ))}
              </HStack>
            </Box>
          ))}
        </VStack>
      </Collapse>
    </Box>
  )
}

/**
 * Bio page — in-depth about-me and detailed education.
 *
 * Content sources (edit these, not this file):
 *   - content/education.json    → one card per school (course, year, details, tags, coursework)
 *   - content/about.md body     → rendered in full under "About Me"
 *   - logos.json                → school logos (keyed by institution name)
 *   - about.md athletics        → athletic history entries
 */
const Bio: React.FC = () => {
  const { t } = useTranslation()
  const { about, experience, institutionLogos } = useLocalizedData()

  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const mutedColor = useColorModeValue('gray.500', 'gray.500')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const emojiBg = useColorModeValue('gray.100', 'gray.700')

  const education = experience.education.courses

  // Scroll to an anchored section (e.g. /bio#education) after navigation
  const location = useLocation()
  useEffect(() => {
    if (!location.hash) return
    const timer = setTimeout(() => {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => clearTimeout(timer)
  }, [location.hash])

  const sectionHeader = (title: string) => (
    <Flex align="center" gap={3} mb={4}>
      <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
      <Heading size="md" fontWeight="semibold">{title}</Heading>
      <Box flex="1" h="1px" bg={borderColor} />
    </Flex>
  )

  return (
    <Box py={[6, 8, 10]}>
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <VStack align="stretch" spacing={[8, 10]}>

          {/* Education, in depth */}
          <Box id="education" scrollMarginTop="80px">
            {sectionHeader(t('bio.education', 'Education'))}
            <VStack align="stretch" spacing={4}>
              {education.map(edu => {
                const logo = institutionLogos[edu.institution]
                return (
                  <Flex
                    key={edu.institution}
                    gap={4}
                    p={[4, 5]}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="md"
                    align="flex-start"
                  >
                    {logo ? (
                      <Image src={logo} alt={edu.institution} boxSize={["40px", "52px"]} objectFit="contain" flexShrink={0} />
                    ) : (
                      <Flex boxSize={["40px", "52px"]} borderRadius="md" bg={borderColor} align="center" justify="center" flexShrink={0}>
                        <Text fontWeight="bold" color={mutedColor}>{edu.institution.charAt(0)}</Text>
                      </Flex>
                    )}
                    <VStack align="start" spacing={1.5} flex={1}>
                      <Flex w="full" justify="space-between" align="baseline" flexWrap="wrap" gap={2}>
                        <Heading size="sm" color={headingColor}>{edu.institution}</Heading>
                        <Text fontSize="xs" fontFamily="mono" color={mutedColor} flexShrink={0}>{edu.year}</Text>
                      </Flex>
                      <Text fontSize="sm" color={textColor} fontWeight="medium">{edu.course}</Text>
                      {edu.details && edu.details.length > 0 && (
                        <Text fontSize="sm" lineHeight="tall">{renderMultiline(edu.details.join('\n'), textColor, headingColor)}</Text>
                      )}
                      {edu.tags && edu.tags.length > 0 && (
                        <HStack spacing={2} flexWrap="wrap" pt={1}>
                          {edu.tags.map(tag => (
                            <Tag key={tag} size="sm" fontFamily="mono" fontSize="2xs">{tag}</Tag>
                          ))}
                        </HStack>
                      )}
                      {edu.coursework && edu.coursework.length > 0 && (
                        <CourseworkDropdown coursework={edu.coursework} mutedColor={mutedColor} />
                      )}
                    </VStack>
                  </Flex>
                )
              })}
            </VStack>
          </Box>

          {/* Full about.md body */}
          <Box>
            {sectionHeader(t('bio.about', 'About Me'))}
            <Box
              dangerouslySetInnerHTML={{ __html: about.bodyHtml ?? '' }}
              sx={{
                'h2': { fontSize: 'md', fontWeight: 'semibold', color: headingColor, mt: 6, mb: 2, fontFamily: 'mono' },
                'h2:first-of-type': { mt: 0 },
                'h3': { fontSize: 'sm', fontWeight: 'semibold', color: headingColor, mt: 4, mb: 2 },
                'p': { fontSize: 'sm', lineHeight: 'tall', color: textColor, mb: 3 },
                'ul, ol': { pl: 5, mb: 3 },
                'li': { fontSize: 'sm', lineHeight: 'tall', color: textColor, mb: 1 },
                'strong': { color: headingColor },
                'a': { color: 'var(--accent-color)' },
              }}
            />
          </Box>

          {/* Athletic history */}
          {(about.athletics ?? []).length > 0 && (
            <Box>
              {sectionHeader(t('bio.athletics', 'Athletic History'))}
              <VStack align="stretch" spacing={3}>
                {(about.athletics ?? []).map(item => (
                  <Flex
                    key={item.sport}
                    gap={4}
                    p={[3, 4]}
                    bg={cardBg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="md"
                    align="center"
                  >
                    {item.logo ? (
                      <Image src={item.logo} alt={item.sport} boxSize={["36px", "44px"]} borderRadius="md" objectFit="contain" flexShrink={0} />
                    ) : (
                      <Flex boxSize={["36px", "44px"]} borderRadius="md" bg={emojiBg} align="center" justify="center" flexShrink={0}>
                        <Text fontSize={["lg", "xl"]}>{item.emoji ?? '🏅'}</Text>
                      </Flex>
                    )}
                    <VStack align="start" spacing={0.5} flex={1}>
                      <Flex w="full" justify="space-between" align="baseline" flexWrap="wrap" gap={2}>
                        <HStack spacing={2} align="baseline">
                          <Heading size="sm" color={headingColor}>{item.sport}</Heading>
                          {item.org && <Text fontSize="sm" color={textColor}>· {item.org}</Text>}
                        </HStack>
                        {item.period && (
                          <Text fontSize="xs" fontFamily="mono" color={mutedColor} flexShrink={0}>{item.period}</Text>
                        )}
                      </Flex>
                      {item.description && (
                        <Text fontSize="sm" lineHeight="tall">{renderBoldText(item.description, textColor, headingColor)}</Text>
                      )}
                    </VStack>
                  </Flex>
                ))}
              </VStack>
            </Box>
          )}

        </VStack>
      </Container>
    </Box>
  )
}

export default Bio
