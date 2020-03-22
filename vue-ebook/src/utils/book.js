import { getReadTime } from './localStorage'

export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days one' },
  { font: 'Tangerine' },
  { font: 'Montserrat' }
]

export function themeList (vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'),
      name: 'Default',
      style: {
        body: {
          color: '#4c5059',
          background: '#cecece'
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          color: '#5c5b56',
          background: '#c6c2b6'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          color: '#404c42',
          background: '#a9c1a9'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          color: '#cecece',
          background: '#000000'
        },
        img: {
          width: '100%'
        },
        '.epubjs-hl': {
          fill: 'red', 'fill-opacity': '0.3', 'mix-blend-mode': 'multiply'
        }
      }
    }
  ]
}

export function addCss (href) {
  const link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', href)
  document.getElementsByTagName('head')[0].appendChild(link)
}

export function removeCss (href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) {
    const link = links[i]
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link)
    }
  }
}

export function removeAllCss () {
  removeCss('http://localhost:9001/theme/theme_default.css')
  removeCss('http://localhost:9001/theme/theme_eye.css')
  removeCss('http://localhost:9001/theme/theme_gold.css')
  removeCss('http://localhost:9001/theme/theme_night.css')
}

export function getReadTimeByMinute (fileName) {
  const readTime = getReadTime(fileName)
  if (!readTime) {
    return 0
  } else {
    return Math.ceil(readTime / 60)
  }
}

export function flatten (array) { // 把树形元素变成一维数组，[].concat()
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
