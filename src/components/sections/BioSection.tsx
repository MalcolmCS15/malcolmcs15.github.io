import { Box, Container, Text, Heading, Flex, VStack, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const BioSection: React.FC = () => {
  const { t } = useTranslation()
  const { about } = useLocalizedData()
  const textColor = useColorModeValue('gray.600', 'gray.400')

  if (!about.journey) return null

  // Blank lines in the about.md `journey` field become paragraph breaks
  const paragraphs = about.journey.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)

  // Minimal markdown: **text** inside a paragraph renders bold
  const renderInline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <Text as="span" key={i} fontWeight="bold">{part.slice(2, -2)}</Text>
      ) : (
        part
      )
    )

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.bio', 'About')}</Heading>
          <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} />
        </Flex>
        <VStack align="stretch" spacing={3}>
          {paragraphs.map((p, i) => (
            <Text key={i} fontSize="sm" lineHeight="tall" color={textColor}>
              {renderInline(p)}
            </Text>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default BioSection
