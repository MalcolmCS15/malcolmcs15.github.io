import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  // Components reference `cyan.*` as the site's highlight color (hero name,
  // rotating subtitle, section detail bars). This remaps that role to the
  // brand orange (#fc5a03); the light-blue role lives in --accent-color.
  colors: {
    cyan: {
      50: '#fff1e8',
      100: '#ffd9c2',
      200: '#ffb98f',
      300: '#fe8f4d',
      400: '#fc5a03',
      500: '#db4e02',
      600: '#b64102',
      700: '#8f3302',
      800: '#692501',
      900: '#451801',
    },
  },
  fonts: {
    body: '"SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    heading: '"SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    mono: '"SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
  },
  styles: {
    global: {
      body: {
        bg: 'var(--bg-color)',
        color: 'var(--text-color)',
        fontSize: '14px',
        lineHeight: 1.6,
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'normal',
        borderRadius: '4px',
      },
      variants: {
        solid: {
          bg: 'var(--accent-color)',
          color: 'white',
          _hover: {
            bg: 'var(--accent-color)',
            opacity: 0.9,
          },
        },
        outline: {
          border: '1px solid',
          borderColor: 'var(--border-color)',
          color: 'var(--text-color)',
          _hover: {
            bg: 'var(--hover-color)',
          },
        },
      },
    },
    Link: {
      baseStyle: {
        color: 'var(--accent-color)',
        _hover: {
          textDecoration: 'none',
          opacity: 0.9,
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: '600',
        color: 'var(--text-color)',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'var(--card-bg)',
          border: '1px solid',
          borderColor: 'var(--border-color)',
          borderRadius: '4px',
          transition: 'transform 0.2s, box-shadow 0.2s',
          _hover: {
            transform: 'translateY(-3px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          },
        },
      },
    },
  },
})

export default theme 