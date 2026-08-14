import { galleryData } from './modules/gallery-data.js'
import { getSettings, saveSettings } from './modules/storage-service.js'

function navLink() {
  location.replace('./hub.html')
}
document.querySelector('#nav-link')?.addEventListener('click', navLink)

function applyThemeToRoot() {
  document.querySelector(
    ':root'
  ).style.cssText = 
  `--base-rem: 100%;
  --hue: 45;
  --saturation: 20%;
  --lum-back: 4%;
  --lum-mid: 30%;
  --lum-front: 90%;
  --lum-front-inverse: 15%;
  --accent-saturation: 10%;
  --accent-lum: 60%;
  --lum-accent-container: 32%;`
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
  applyThemeToRoot()
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