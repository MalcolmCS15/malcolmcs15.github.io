import { useRef, useState } from 'react'
import { Box, Text, useColorModeValue } from '@chakra-ui/react'

/**
 * Wraps any element; clicking it copies `email` to the clipboard and shows a
 * small "'<email>' copied to clipboard" popup that fades away on its own.
 * `placement` controls whether the popup appears above or below the element
 * (use "bottom" for things near the top of the viewport, e.g. the navbar).
 */
const CopyEmail: React.FC<{
  email: string
  placement?: 'top' | 'bottom'
  children: React.ReactNode
}> = ({ email, placement = 'top', children }) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const popBg = useColorModeValue('gray.800', 'gray.100')
  const popColor = useColorModeValue('white', 'gray.900')

  const handleCopy = () => {
    navigator.clipboard?.writeText(email)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Box position="relative" display="inline-block" cursor="pointer" onClick={handleCopy}>
      <Text
        position="absolute"
        {...(placement === 'top'
          ? { bottom: 'calc(100% + 6px)' }
          : { top: 'calc(100% + 6px)' })}
        left="50%"
        bg={popBg}
        color={popColor}
        px={2}
        py={1}
        borderRadius="sm"
        fontSize="2xs"
        fontFamily="mono"
        whiteSpace="nowrap"
        zIndex={20}
        boxShadow="md"
        pointerEvents="none"
        opacity={copied ? 1 : 0}
        transform={`translateX(-50%) translateY(${copied ? '0' : placement === 'top' ? '4px' : '-4px'})`}
        transition="opacity 0.25s, transform 0.25s"
      >
        '{email}' copied to clipboard
      </Text>
      {children}
    </Box>
  )
}

export default CopyEmail
