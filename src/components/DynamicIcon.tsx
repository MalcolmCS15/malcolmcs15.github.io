import { Icon } from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FaGithub, FaLinkedin, FaMedium, FaEnvelope, FaYoutube, FaHeart, FaCode, FaClock, FaArrowRight, FaGlobe, FaExternalLinkAlt, FaFileAlt, FaRocket, FaDatabase, FaChartBar, FaProjectDiagram, FaChalkboardTeacher, FaRobot, FaPlay, FaChevronRight, FaTrophy, FaPlane, FaGraduationCap, FaMedal, FaBriefcase, FaLightbulb, FaAward, FaCoins, FaStar, FaUser, FaFolder, FaCodeBranch, FaBolt, FaCoffee, FaBrain, FaTerminal, FaPython, FaJava, FaReact, FaServer, FaFileExcel, FaFilePowerpoint, FaGitAlt, FaCalculator, FaChartLine, FaFootballBall, FaFutbol, FaLanguage, FaScroll, FaHandshake, FaBookOpen, FaPalette, FaGuitar, FaComments, FaUsers, FaNetworkWired } from 'react-icons/fa'
import { SiGooglescholar, SiBilibili, SiX, SiCsdn, SiZhihu, SiNotion, SiArxiv, SiTensorflow, SiKeras, SiPytorch, SiScikitlearn, SiOpencv, SiNumpy, SiPandas, SiJavascript, SiTypescript, SiWeightsandbiases, SiAnthropic, SiVite, SiOpenaigym, SiClerk } from 'react-icons/si'

const icons: { [key: string]: IconType } = {
  FaGithub,
  FaLinkedin,
  FaMedium,
  FaEnvelope,
  FaYoutube,
  FaHeart,
  FaCode,
  FaClock,
  FaArrowRight,
  FaGlobe,
  FaExternalLinkAlt,
  FaFileAlt,
  FaRocket,
  FaDatabase,
  FaChartBar,
  FaProjectDiagram,
  FaChalkboardTeacher,
  FaRobot,
  SiGooglescholar,
  SiBilibili,
  SiX,
  SiCsdn,
  SiZhihu,
  SiNotion,
  SiArxiv,
  FaPlay,
  FaChevronRight,
  FaTrophy,
  FaPlane,
  FaGraduationCap,
  FaMedal,
  FaBriefcase,
  FaLightbulb,
  FaAward,
  FaCoins,
  FaStar,
  FaUser,
  FaFolder,
  FaCodeBranch,
  FaBolt,
  FaCoffee,
  FaBrain,
  FaTerminal,
  FaPython,
  FaJava,
  FaReact,
  FaServer,
  FaFileExcel,
  FaFilePowerpoint,
  FaGitAlt,
  FaCalculator,
  FaChartLine,
  FaFootballBall,
  FaFutbol,
  FaLanguage,
  FaScroll,
  FaHandshake,
  FaBookOpen,
  FaPalette,
  FaGuitar,
  FaComments,
  FaUsers,
  FaNetworkWired,
  SiTensorflow,
  SiKeras,
  SiPytorch,
  SiScikitlearn,
  SiOpencv,
  SiNumpy,
  SiPandas,
  SiJavascript,
  SiTypescript,
  SiWeightsandbiases,
  SiAnthropic,
  SiVite,
  SiOpenaigym,
  SiClerk,
}

interface DynamicIconProps {
  name?: string
  color?: string
  boxSize?: number | number[] | string | string[]
  [key: string]: any
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
  if (!name) return null
  const IconComponent = icons[name] || FaCode
  return <Icon as={IconComponent} {...props} />
}

export default DynamicIcon 
