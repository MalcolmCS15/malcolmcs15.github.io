import { Box, VStack, Text, useColorModeValue, Image, HStack, Container, Stack, Link, Flex, SimpleGrid, Heading, Portal } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { withBase } from '@/utils/asset'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const MotionBox = motion(Box)
const MotionText = motion(Text)

interface ResearchItem {
  lab: string
  emoji: string
  advisor?: string
  focus: string
  link: string
  /** When set to a company name from content/experience/*.md, the card deep-links to that entry on the Experience page */
  institution?: string
  /** For items with no link/institution: clicking shows this text as a small popup near the cursor */
  note?: string
}

interface EducationItem {
  course: string
  institution: string
  year: string
}

// Hero Section Component
interface HeroSectionProps {
  title: string
  avatar: string
  research?: ResearchItem[]
  researchLogos?: Record<string, string>
  education?: EducationItem[]
  educationLogos?: Record<string, string>
}

const HeroSection = ({ title, avatar, research = [], researchLogos = {}, education = [], educationLogos = {} }: HeroSectionProps) => {
  const { t } = useTranslation()
  const { siteOwner, siteConfig } = useLocalizedData()
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.700', 'gray.400')
  const bg = useColorModeValue('gray.50', 'gray.900')
  const accentBg = useColorModeValue('blue.50', 'blue.900')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')

  // Small note popup shown near the cursor when a linkless research item is clicked
  const [cursorNote, setCursorNote] = useState<{ text: string; x: number; y: number } | null>(null)
  const noteBg = useColorModeValue('gray.800', 'gray.100')
  const noteColor = useColorModeValue('white', 'gray.900')
  useEffect(() => {
    if (!cursorNote) return
    const dismiss = () => setCursorNote(null)
    const timer = setTimeout(dismiss, 2600)
    window.addEventListener('scroll', dismiss, { once: true })
    window.addEventListener('click', dismiss, { once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', dismiss)
      window.removeEventListener('click', dismiss)
    }
  }, [cursorNote])

  // Rotating subtitles: cycles downward through the whole site.json list,
  // whatever its length. The first item is duplicated at the end so the loop
  // restart lands on an identical frame (no rewind).
  //
  // Current style: "hold then scroll" — each item pauses (holdRatio of its
  // time slot), then quickly rolls to the next.
  //
  // TO MAKE THE SCROLL CONTINUOUS AND SLOWER instead (one steady crawl with
  // no pauses, like the original animation): replace the forEach block and
  // the two trailing push lines below with just two keyframes —
  //   const subtitleFrames = ['0%', `${(-subtitles.length * 100) / loopItems.length}%`]
  //   const subtitleTimes = [0, 1]
  // and in the <MotionBox> transition below, raise `duration` to taste
  // (e.g. subtitles.length * 4 — bigger multiplier = slower crawl).
  // Everything else (full list, seamless downward loop) keeps working.
  const subtitles = siteOwner.rotatingSubtitles
  const loopItems = subtitles.length > 0 ? [...subtitles, subtitles[0]] : []
  const subtitleFrames: string[] = []
  const subtitleTimes: number[] = []
  const holdRatio = 0.8 // fraction of each slot spent holding vs scrolling
  subtitles.forEach((_, i) => {
    const y = `${(-i * 100) / loopItems.length}%`
    subtitleFrames.push(y)
    subtitleTimes.push(i / subtitles.length)
    subtitleFrames.push(y)
    subtitleTimes.push((i + holdRatio) / subtitles.length)
  })
  subtitleFrames.push(`${(-subtitles.length * 100) / loopItems.length}%`)
  subtitleTimes.push(1)

  return (
    <Box
      w="full"
      bg={bg}
      py={[3, 4, 6]}
      mt={[2, 3, 4]}
    >
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Stack
          direction={['column', 'column', 'row']}
          spacing={[3, 4, 6]}
          align="center"
          justify="space-between"
        >
          <VStack spacing={[2, 3]} align={['center', 'center', 'flex-start']} flex="1">
            <MotionText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              as="h1"
              fontSize={["lg", "xl", "3xl"]}
              fontWeight="bold"
              color={headingColor}
              lineHeight="shorter"
              mb={[1, 2, 3]}
              display="flex"
              alignItems="center"
              gap={[1, 2]}
              flexWrap={["wrap", "wrap", "nowrap"]}
              textAlign={["center", "center", "left"]}
              w="full"
              sx={{
                justifyContent: ["center", "center", "flex-start"]
              }}
            >
              <MotionText
                as="span"
                color="yellow.400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                $
              </MotionText>
              <MotionText
                as="span"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                overflow="hidden"
                whiteSpace="nowrap"
                display="inline-block"
              >
                {t('hero.greeting')}{' '}
              </MotionText>
              <MotionText
                as="span"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
                color="cyan.400"
                fontFamily="mono"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <MotionText
                  as="span"
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {siteOwner.name.display}
                </MotionText>
              </MotionText>
            </MotionText>

            <HStack
              spacing={[1, 2]}
              mb={[2, 3, 4]}
              justify={['center', 'center', 'flex-start']}
              flexWrap="wrap"
              w="full"
            >
              <Text color="yellow.400" fontSize={["xs", "sm"]}>$</Text>
              <Text fontSize={["xs", "sm"]} color={useColorModeValue('gray.700', 'gray.400')}>{t('hero.sometimesI')}</Text>
              <Box h={["18px", "20px", "24px"]} overflow="hidden">
                <MotionBox
                  animate={{ y: subtitleFrames }}
                  transition={{
                    duration: subtitles.length * 2.5,
                    times: subtitleTimes,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {loopItems.map((text, index) => (
                    <Text
                      key={index}
                      h={["18px", "20px", "24px"]}
                      lineHeight={["18px", "20px", "24px"]}
                      color="cyan.400"
                      fontWeight="bold"
                      fontSize={["xs", "sm"]}
                      fontFamily="mono"
                      whiteSpace="nowrap"
                    >
                      {text}
                    </Text>
                  ))}
                </MotionBox>
              </Box>
            </HStack>


            <Box w="full" borderTop="1px dashed" borderColor={useColorModeValue('gray.200', 'gray.700')} />

            {/* Education & "Currently I Am" compact section */}
            {(research.length > 0 || education.length > 0) && (
              <SimpleGrid columns={[1, 1, 2]} spacing={[3, 3, 4]} w="full">
                {education.length > 0 && (
                  <VStack align="start" spacing={2}>
                    <Heading size="xs" color={textColor} textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                      Education
                    </Heading>
                    {education.map((item, index) => {
                      const logo = educationLogos[item.institution]
                      return (
                        <Link key={index} as={RouterLink} to="/bio#education" _hover={{ textDecoration: 'none' }} w="full">
                        <HStack spacing={2.5} p={2} borderRadius="md" w="full" transition="all 0.2s" _hover={{ bg: hoverBg }}>
                          {logo ? (
                            <Image src={withBase(logo)} alt={item.institution} w="28px" h="28px" borderRadius="sm" objectFit="contain" flexShrink={0} />
                          ) : (
                            <Flex w="28px" h="28px" borderRadius="sm" bg={accentBg} align="center" justify="center" flexShrink={0}>
                              <Text fontSize="sm" fontWeight="bold" color="blue.500">{item.institution.charAt(0)}</Text>
                            </Flex>
                          )}
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize={["xs", "sm"]} fontWeight="medium" lineHeight="short" color={headingColor}>{item.course}</Text>
                            <Text fontSize="2xs" color={textColor} lineHeight="short">{item.institution} · {item.year}</Text>
                          </VStack>
                        </HStack>
                        </Link>
                      )
                    })}
                  </VStack>
                )}
                {research.length > 0 && (
                  <VStack align="start" spacing={2}>
                    <Heading size="xs" color={textColor} textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                      Currently I Am
                    </Heading>
                    {research.map((item, index) => {
                      const logo = researchLogos[item.lab]
                      const row = (
                        <HStack spacing={2.5} p={2} borderRadius="md" w="full" transition="all 0.2s" _hover={(item.link || item.institution || item.note) ? { bg: hoverBg } : undefined}>
                          {logo ? (
                            <Image src={withBase(logo)} alt={item.lab} w="28px" h="28px" borderRadius="sm" objectFit="contain" flexShrink={0} />
                          ) : (
                            <Flex w="28px" h="28px" borderRadius="sm" bg={accentBg} align="center" justify="center" flexShrink={0}>
                              <Text fontSize="sm">{item.emoji}</Text>
                            </Flex>
                          )}
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize={["xs", "sm"]} fontWeight="medium" lineHeight="short" color={headingColor}>{item.lab}</Text>
                            <Text fontSize="2xs" color={textColor} lineHeight="short" noOfLines={1}>
                              {item.advisor ? `w/ ${item.advisor}` : item.focus}
                            </Text>
                          </VStack>
                        </HStack>
                      )
                      // Items with an `institution` matching a company in
                      // content/experience/*.md deep-link to that entry on the Experience page
                      // (expanded + briefly highlighted). Otherwise fall back to
                      // the external `link`, or no link at all.
                      return item.institution ? (
                        <Link key={index} as={RouterLink} to={`/experience?highlight=${encodeURIComponent(item.institution)}`} _hover={{ textDecoration: 'none' }} w="full">
                          {row}
                        </Link>
                      ) : item.link ? (
                        <Link key={index} href={item.link} isExternal _hover={{ textDecoration: 'none' }} w="full">
                          {row}
                        </Link>
                      ) : item.note ? (
                        <Box
                          key={index}
                          w="full"
                          cursor="pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            const r = e.currentTarget.getBoundingClientRect()
                            setCursorNote({ text: item.note!, x: r.left + r.width / 2, y: r.bottom })
                          }}
                        >
                          {row}
                        </Box>
                      ) : (
                        <Box key={index} w="full">{row}</Box>
                      )
                    })}
                  </VStack>
                )}
              </SimpleGrid>
            )}

          </VStack>
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={[2, 3]}>
              <Image
                src={withBase(`images/${avatar}`)}
                alt={title}
                borderRadius="xl"
                boxSize={["180px", "215px", "260px"]}
                objectFit="cover"
              />
              {((siteConfig.pets ?? []) as { name: string; emoji: string; image: string }[]).length > 0 && (
                <HStack spacing={[4, 5]} justify="center">
                  {((siteConfig.pets ?? []) as { name: string; emoji: string; image: string }[]).map((pet) => (
                    <VStack key={pet.name} spacing={2}>
                      {pet.image && (
                        <Image
                          src={withBase(pet.image)}
                          alt={pet.name}
                          borderRadius="full"
                          boxSize={["40px", "50px"]}
                          objectFit="cover"
                        />
                      )}
                      <Text fontSize="sm" fontWeight="medium">{pet.name} {pet.emoji}</Text>
                    </VStack>
                  ))}
                </HStack>
              )}
            </VStack>
          </MotionBox>
        </Stack>
      </Container>

      {/* Cursor-anchored note (e.g. "Coming soon!") for linkless research items */}
      {cursorNote && (
        <Portal>
          {/* Outer box handles fixed positioning + centering; inner MotionBox
              handles the animation so framer-motion's transform doesn't clobber
              the translateX(-50%) that centers the note under the item. */}
          <Box
            position="fixed"
            left={`${cursorNote.x}px`}
            top={`${cursorNote.y + 8}px`}
            transform="translateX(-50%)"
            zIndex="tooltip"
            pointerEvents="none"
          >
            <MotionBox
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.15 }}
              bg={noteBg}
              color={noteColor}
              fontSize="xs"
              fontWeight="medium"
              px={3}
              py={1.5}
              borderRadius="md"
              boxShadow="lg"
              whiteSpace="nowrap"
            >
              {cursorNote.text}
            </MotionBox>
          </Box>
        </Portal>
      )}
    </Box>
  )
}

export default HeroSection
