import defaultSettings from '@/settings'

let title = defaultSettings.title || '知润健康'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
