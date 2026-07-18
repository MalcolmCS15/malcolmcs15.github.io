import {
  Box, Flex, IconButton, useColorMode, HStack, Link as ChakraLink,
  useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  VStack, Divider
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaMedium, FaEnvelope } from 'react-icons/fa'
import { SiGooglescholar } from 'react-icons/si'
import { useTranslation } from 'react-i18next'
import { navItems, siteOwner } from '@/site.config'
import CopyEmail from './CopyEmail'

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useTranslation()

  const socialLinks = [
    { icon: FaEnvelope, href: `mailto:${siteOwner.contact.email}`, label: 'Email' },
    { icon: FaGithub, href: siteOwner.social.github, label: 'GitHub' },
    { icon: FaLinkedin, href: siteOwner.social.linkedin, label: 'LinkedIn' },
    { icon: FaMedium, href: siteOwner.social.medium, label: 'Medium' },
    { icon: SiGooglescholar, href: siteOwner.social.googleScholar, label: 'Google Scholar' },
  ].filter(link => link.href)

  return (
    <Box
      as="nav"
      py={4}
      borderBottom="1px solid"
      borderColor="var(--border-color)"
      position="sticky"
      top={0}
      bg="var(--bg-color)"
      zIndex={1000}
      w="full"
    >
      <Flex
        justify="space-between"
        align="center"
        w="full"
        px={4}
        position="relative"
      >
        {/* Mobile: hamburger */}
        <Box display={{ base: 'block', md: 'none' }}>
          <IconButton
            aria-label={t('aria.openNav')}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            color="var(--text-color)"
          />
        </Box>

        {/* Desktop nav (left aligned) */}
        <HStack
          spacing={8}
          display={{ base: 'none', md: 'flex' }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: 'var(--text-color)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-color)' : 'none',
                  paddingBottom: '2px',
                  fontSize: '1rem',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {t(item.labelKey)}
              </Link>
            )
          })}
        </HStack>
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }} ml="auto">
          {socialLinks.map((link) => (
            link.label === 'Email' ? (
              /* Mail icon copies the academic email instead of opening a mail client */
              <CopyEmail key={link.label} email={siteOwner.contact.academicEmail} placement="bottom">
                <Box
                  color="var(--secondary-text)"
                  p={1.5}
                  borderRadius="md"
                  _hover={{
                    color: 'var(--accent-color)',
                    transform: 'translateY(-2px)',
                    bg: 'var(--hover-color)',
                  }}
                  transition="all 0.2s"
                >
                  <Box as={link.icon} fontSize="1.2rem" />
                </Box>
              </CopyEmail>
            ) : (
            <ChakraLink
              key={link.label}
              href={link.href}
              isExternal
              color="var(--secondary-text)"
              p={1.5}
              borderRadius="md"
              _hover={{
                color: 'var(--accent-color)',
                transform: 'translateY(-2px)',
                ...(link.label === 'LinkedIn'
                  ? { bg: 'var(--hover-color)' }
                  : {})
              }}
              transition="all 0.2s"
            >
              <Box
                as={link.icon}
                fontSize="1.2rem"
              />
            </ChakraLink>
            )
          ))}
          <IconButton
            aria-label={t('aria.toggleColorMode')}
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="var(--text-color)"
            _hover={{
              bg: 'var(--hover-color)',
              transform: 'translateY(-2px)'
            }}
            transition="all 0.2s"
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="var(--bg-color)">
          <DrawerHeader color="var(--text-color)">{t('nav.navigation')}</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={3}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <ChakraLink
                    key={item.path}
                    as={Link}
                    to={item.path}
                    onClick={onClose}
                    color={isActive ? 'var(--accent-color)' : 'var(--text-color)'}
                    _hover={{ color: 'var(--accent-color)' }}
                    fontWeight={isActive ? 600 : 400}
                  >
                    {t(item.labelKey)}
                  </ChakraLink>
                )
              })}

              <Divider borderColor="var(--border-color)" my={2} />

              <VStack align="stretch" spacing={2}>
                {socialLinks.map((link) => (
                  <ChakraLink
                    key={link.label}
                    href={link.href}
                    isExternal
                    color="var(--secondary-text)"
                    _hover={{ color: 'var(--accent-color)' }}
                  >
                    <Box as={link.icon} mr={2} display="inline-block" /> {link.label}
                  </ChakraLink>
                ))}
              </VStack>

              <Divider borderColor="var(--border-color)" my={2} />

              <HStack spacing={2}>
                <IconButton
                  aria-label={t('aria.toggleColorMode')}
                  icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                  onClick={toggleColorMode}
                  variant="outline"
                  color="var(--text-color)"
                />
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Navbar
