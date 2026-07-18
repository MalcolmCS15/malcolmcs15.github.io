import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { siteConfig } from './site.config'
import { getTemplate, getResolvedSlots, SlotProvider } from './templates'
import './styles/globals.css'
import './i18n'

// Store the color-mode preference under our own key. Chakra's default key
// may hold a stale "dark" from before the site defaulted to light mode;
// a fresh key means every visitor starts light, and the navbar toggle
// still persists their choice from then on.
const colorModeManager = createLocalStorageManager('termhub-color-mode')

function App() {
  const features = siteConfig.features as Record<string, boolean>
  const cfg = siteConfig as Record<string, unknown>
  const template = getTemplate(cfg.template as string | undefined)
  const slots = getResolvedSlots(template, cfg.components as Record<string, string> | undefined)

  const { layout: TemplateLayout, pages, theme } = template

  return (
    <ChakraProvider theme={theme} colorModeManager={colorModeManager}>
      <SlotProvider slots={slots}>
        <Router basename={import.meta.env.BASE_URL}>
          <TemplateLayout>
            <Routes>
              <Route path="/" element={<pages.home />} />
              {pages.bio && <Route path="/bio" element={<pages.bio />} />}
              {features.publications && pages.publications && (
                <Route path="/publications" element={<pages.publications />} />
              )}
              {features.projects && pages.projects && (
                <Route path="/projects" element={<pages.projects />} />
              )}
              {features.articles && pages.articles && (
                <Route path="/articles" element={<pages.articles />} />
              )}
              {features.experience && pages.experience && (
                <Route path="/experience" element={<pages.experience />} />
              )}
              {features.guide !== false && pages.guide && (
                <Route path="/guide" element={<pages.guide />} />
              )}
              {features.guide !== false && pages.guideDocs && (
                <Route path="/docs" element={<pages.guideDocs />} />
              )}
            </Routes>
          </TemplateLayout>
        </Router>
      </SlotProvider>
    </ChakraProvider>
  )
}

export default App
