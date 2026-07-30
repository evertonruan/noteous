import { galleryData } from './modules/gallery-data.js'
import { getSettings, saveSettings } from './modules/storage-service.js'

function navLink() {
  location.replace('./hub.html')
}
document.querySelector('#nav-link')?.addEventListener('click', navLink)

function noteousTheme(context) {
  let settings = getSettings()

  if (!settings) {
    settings = {
      look: {
        baseRem: '--base-rem: 100%;',
        hue: '--hue: 45;',
        saturation: '--saturation: 20%;',
        lumBack: '--lum-back: 4%;',
        lumMid: '--lum-mid: 30%;',
        lumFront: '--lum-front: 90%;',
        lumFrontInverse: '--lum-front-inverse: 15%;',
        accentSaturation: '--accent-saturation: 10%;',
        accentLum: '--accent-lum: 60%;',
        lumAccentContainer: '--lum-accent-container: 32%;',
        luminosity: 'dark'
      }
    }
  }

  if (!settings.look) {
    settings.look = {}
  }

  const applyThemeToRoot = () => {
    const root = document.querySelector(':root')
    if (!root) return

    root.style.cssText = `${settings.look.baseRem || '--base-rem: 100%;'} ${settings.look.hue || '--hue: 45;'} ${settings.look.saturation || '--saturation: 20%;'} ${settings.look.lumBack || '--lum-back: 4%;'} ${settings.look.lumMid || '--lum-mid: 30%;'} ${settings.look.lumFront || '--lum-front: 90%;'} ${settings.look.lumFrontInverse || '--lum-front-inverse: 15%;'} ${settings.look.accentSaturation || '--accent-saturation: 10%;'} ${settings.look.accentLum || '--accent-lum: 60%;'} ${settings.look.lumAccentContainer || '--lum-accent-container: 32%;'}`
  }

  if (context === 'retrieve-theme') {
    if (settings.look.luminosity === 'light') {
      noteousTheme('set-theme-light')
    } else {
      noteousTheme('set-theme-dark')
    }
  } else if (context === 'change-theme') {
    if (settings.look.luminosity === 'light') {
      noteousTheme('set-theme-dark')
    } else {
      noteousTheme('set-theme-light')
    }
  } else if (context === 'set-theme-light') {
    settings.look.luminosity = 'light'
    settings.look.hue = '--hue: 45;'
    settings.look.saturation = '--saturation: 20%;'
    settings.look.lumBack = '--lum-back: 95%;'
    settings.look.lumMid = '--lum-mid: 70%;'
    settings.look.lumFront = '--lum-front: 15%;'
    settings.look.lumFrontInverse = '--lum-front-inverse: 95%;'
    settings.look.accentSaturation = '--accent-saturation: 20%;'
    settings.look.accentLum = '--accent-lum: 60%;'
    settings.look.lumAccentContainer = '--lum-accent-container: 65%;'

    saveSettings(settings)
    applyThemeToRoot()
  } else if (context === 'set-theme-dark') {
    settings.look.luminosity = 'dark'
    settings.look.hue = '--hue: 45;'
    settings.look.saturation = '--saturation: 20%;'
    settings.look.lumBack = '--lum-back: 4%;'
    settings.look.lumMid = '--lum-mid: 30%;'
    settings.look.lumFront = '--lum-front: 90%;'
    settings.look.lumFrontInverse = '--lum-front-inverse: 15%;'
    settings.look.accentSaturation = '--accent-saturation: 10%;'
    settings.look.accentLum = '--accent-lum: 60%;'
    settings.look.lumAccentContainer = '--lum-accent-container: 32%;'

    saveSettings(settings)
    applyThemeToRoot()
  }
}

function renderBannerDescription(entry) {
  const container = document.getElementById('banner-description')
  container.style.opacity = '0'
  container.style.transform = 'translateY(8px)'

  window.setTimeout(() => {
    container.innerHTML = ''

    const title = document.createElement('h3')
    title.textContent = entry.title
    container.appendChild(title)

    if (entry.latest) {
      const chip = document.createElement('span')
      chip.className = 'update-chip'
      chip.textContent = 'Atualização mais recente'
      container.appendChild(chip)
    }

    const description = document.createElement('p')
    description.textContent = entry.description
    description.className = 'description-text'
    container.appendChild(description)

    const linksContainer = document.createElement('div')
    linksContainer.className = 'gallery-links-buttons-container'

    if (entry.github) {
      const githubLink = document.createElement('a')
      githubLink.href = entry.github
      githubLink.target = '_blank'
      githubLink.rel = 'noopener noreferrer'
      githubLink.className = 'description-link-github'
      githubLink.textContent = 'Ver Release no GitHub ↗'
      linksContainer.appendChild(githubLink)
    }

    if (entry.basticodes) {
      const basticodesLink = document.createElement('a')
      basticodesLink.href = entry.basticodes
      basticodesLink.target = '_blank'
      basticodesLink.rel = 'noopener noreferrer'
      basticodesLink.className = 'description-link-basticodes'
      basticodesLink.textContent = 'bastiCodes disponível ▶'
      linksContainer.appendChild(basticodesLink)
    }

    if (entry.github || entry.basticodes) {
      container.appendChild(linksContainer)
    }

    const figuresGrid = document.createElement('div')
    figuresGrid.className = 'gallery-figures-grid'

    for (const imgData of entry.images) {
      const section = document.createElement('section')
      section.className = 'hub-section'
      section.style.padding = '0'
      section.style.display = 'flex'
      section.style.flexDirection = 'column'
      section.style.margin = '0'

      if (imgData.src) {
        const img = document.createElement('img')
        img.src = imgData.src
        img.alt = imgData.alt || ''
        img.style.width = '100%'
        img.style.height = 'auto'
        img.style.display = 'block'
        section.appendChild(img)
      }

      if (imgData.type) {
        const typeTitle = document.createElement('p')
        typeTitle.className = 'hub-section-title'
        typeTitle.textContent = imgData.type.toUpperCase()
        section.appendChild(typeTitle)
      }

      const captionContainer = document.createElement('div')
      captionContainer.style.padding = '20px'
      if (!imgData.src) {
        captionContainer.style.paddingTop = '50px'
      }
      captionContainer.style.display = 'flex'
      captionContainer.style.flexDirection = 'column'
      captionContainer.style.alignItems = 'center'

      const caption = document.createElement('figcaption')
      caption.innerHTML = imgData.caption
      caption.style.textAlign = 'center'
      caption.style.fontSize = '1.1rem'
      captionContainer.appendChild(caption)

      section.appendChild(captionContainer)
      figuresGrid.appendChild(section)
    }

    container.appendChild(figuresGrid)

    container.style.opacity = '1'
    container.style.transform = 'translateY(0)'
  }, 180)
}

document.addEventListener('DOMContentLoaded', () => {
  noteousTheme('retrieve-theme')

  const gallery = document.getElementById('gallery')
  if (gallery) {
    gallery.classList.add('orbs-glow')
  }

  const bannersContainer = document.getElementById('gallery-banners-container')
  bannersContainer.innerHTML = ''

  for (const [index, entry] of galleryData.entries()) {
    const banner = document.createElement('div')
    banner.className = 'gallery-banner'
    banner.dataset.id = entry.id
    banner.dataset.index = index

    const img = document.createElement('img')
    img.src = entry.banner
    img.alt = `Banner da ${entry.title}`
    banner.appendChild(img)

    banner.addEventListener('click', () => {
      document.querySelectorAll('.gallery-banner').forEach(b => b.classList.remove('active'))
      banner.classList.add('active')
      const container = document.getElementById('gallery-banners-container')
      const left = banner.offsetLeft - (container.clientWidth / 1.5) + (banner.offsetWidth / 1.5)
      container.scrollTo({ left, behavior: 'smooth' })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      renderBannerDescription(entry)
    })

    bannersContainer.appendChild(banner)
  }

  if (galleryData.length > 0) {
    const firstBanner = bannersContainer.querySelector('.gallery-banner')
    if (firstBanner) {
      firstBanner.classList.add('active')
      const container = document.getElementById('gallery-banners-container')
      const left = firstBanner.offsetLeft - (container.clientWidth / 2) + (firstBanner.offsetWidth / 2)
      container.scrollTo({ left, behavior: 'auto' })
      renderBannerDescription(galleryData[0])
    }
  }
})