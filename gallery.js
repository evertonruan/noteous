const galleryData = [
  {
    id: '2nd-gen',
    banner: '/assets/images/gallery-2nd-gen-banner.webp',
    title: 'Esta é a 2ª geração do noteous',
    description: 'Orbs. donut design. orblend engine. Há muito para explorar',
    images: [
      { src: '/assets/images/greeting-donut.webp', alt: 'donut design', caption: 'O novo donut design é delicioso e inovador. Desde quando você abre o noteous você percebe que há uma atenção especial aos detalhes'},
      { src: '/assets/images/greeting-orblend-engine.webp', alt: 'Orblend Engine', caption: 'O orblend engine é a inteligência por trás do noteous. Ele habilita recursos úteis, além de criar os Orbs, que aumentam a organização'},
      { src: '/assets/images/greeting-orbs.webp', alt: 'Orbs', caption: 'Os Orbs são uma novidade da 2ª Geração. É uma forma de organizar suas notas. Por exemplo, as notas concluídas ficam em um Orb específico delas. E no futuro será possível desbloquear novas cores de Orbs'},
      { src: '/assets/images/greeting-orbs-light.webp', alt: 'Melhor navegação nos Orbs', caption: '<strong>Esta é a atualização mais recente</strong>. Os Orbs receberam melhorias visuais, ficando mais evidentes', type: 'noteous 2.3.1' },
      { src: '/assets/images/greeting-usage-orbs.webp', alt: 'Melhor navegação nos Orbs', caption: '<strong>Ao usar o noteous no celular, os Orbs aparecem na parte de baixo, facilitando a navegação', type: 'noteous 2.3' },
      { src: '/assets/images/greeting-usage-edit.webp', alt: 'Melhor edição de notas', caption: 'O noteous 2.2 melhorou a experiência e legibilidade. Por exemplo, ficou mais fácil de perceber quando uma nota está sendo editada', type: 'noteous 2.2' },
      { src: '/assets/images/greeting-update.webp', alt: 'Design assets', caption: 'Essa foi a primeira grande atualização da 2ª Geração do noteous. Como destaques, trouxe um ícone atualizado, e a Central de Recursos (antiga página Ajustes&Info)', type: 'noteous 2.1' },
      { src: '/assets/images/greeting-gallery.webp', alt: '2ª Geração do noteous', caption: 'O noteous 2.0 inaugurou a 2ª Geração, com os inovadores Orbs e o novo donut design', type: 'noteous 2.0' }
    ]
  }
]


let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

function navLink() {
  location.replace('./hub.html')
}
document.querySelector('#nav-link')?.addEventListener('click', navLink)

// CONFIGURAÇÕES DE TEMA ////////////////////////////////////

function injectCSSOnRoot() {
  document.querySelector(
    ':root'
  ).style.cssText = `${noteousSettings.look.baseRem} ${noteousSettings.look.hue} ${noteousSettings.look.saturation}
${noteousSettings.look.lumBack}
${noteousSettings.look.lumMid}
${noteousSettings.look.lumFront}
${noteousSettings.look.lumFrontInverse}
${noteousSettings.look.accentSaturation}
${noteousSettings.look.accentLum}
${noteousSettings.look.lumAccentContainer}`
}

function noteousTheme(context) {
  //context => recuperar tema, trocar tema, aplicar tema claro, aplicar tema escuro
  if (context == 'retrieve-theme') {
    if (noteousSettings.look.luminosity == 'light') {
      noteousTheme('set-theme-light')
      console.log(context)
    } else if (noteousSettings.look.luminosity == 'dark') {
      noteousTheme('set-theme-dark')
    }
  } else if (context == 'change-theme') {
    console.log(context)
    if (noteousSettings.look.luminosity == 'light') {
      noteousTheme('set-theme-dark')
    } else if (noteousSettings.look.luminosity == 'dark') {
      noteousTheme('set-theme-light')
    }
  } else if (context == 'set-theme-light') {
    noteousSettings.look.luminosity = 'light'
    noteousSettings.look.hue = '--hue: 45;'
    noteousSettings.look.saturation = '--saturation: 20%;'
    noteousSettings.look.lumBack = '--lum-back: 95%;'
    noteousSettings.look.lumMid = '--lum-mid: 70%;'
    noteousSettings.look.lumFront = '--lum-front: 15%;'
    noteousSettings.look.lumFrontInverse = '--lum-front-inverse: 95%;'
    noteousSettings.look.accentSaturation = '--accent-saturation: 20%;'
    noteousSettings.look.accentLum = '--accent-lum: 60%;'
    noteousSettings.look.lumAccentContainer = '--lum-accent-container: 65%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  } else if (context == 'set-theme-dark') {
    noteousSettings.look.luminosity = 'dark'
    noteousSettings.look.hue = '--hue: 45;'
    noteousSettings.look.saturation = '--saturation: 20%;'
    noteousSettings.look.lumBack = '--lum-back: 4%;'
    noteousSettings.look.lumMid = '--lum-mid: 30%;'
    noteousSettings.look.lumFront = '--lum-front: 90%;'
    noteousSettings.look.lumFrontInverse = '--lum-front-inverse: 15%;'
    noteousSettings.look.accentSaturation = '--accent-saturation: 10%;'
    noteousSettings.look.accentLum = '--accent-lum: 60%;'
    noteousSettings.look.lumAccentContainer = '--lum-accent-container: 32%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  }
}
noteousTheme('retrieve-theme')

///////

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
        typeTitle.textContent = imgData.type
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
  if (bannersContainer) {
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
        if (container) {
          const left = banner.offsetLeft - (container.clientWidth / 1.5) + (banner.offsetWidth / 1.5)
          container.scrollTo({ left, behavior: 'smooth' })
        }
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
        if (container) {
          const left = firstBanner.offsetLeft - (container.clientWidth / 2) + (firstBanner.offsetWidth / 2)
          container.scrollTo({ left, behavior: 'auto' })
        }
      }
    }
  }

  if (galleryData.length > 0) {
    renderBannerDescription(galleryData[0])
  }
})