function navLink() {
  window.location.replace('./hub.html')
}

const galleryData = [
  {
    id: '2nd-gen',
    banner: '/assets/images/gallery-2nd-gen-banner.webp',
    title: 'Esta é a 2ª geração do noteous',
    description: 'Começando pelo novo donut design e indo até os novos Orbs, o noteous é melhor a cada dia',
    images: [
      { src: '/assets/images/greeting-donut.webp', alt: 'donut design', caption: 'O novo donut design é delicioso e inovador. Desde quando você abre o noteous você percebe que há uma atenção especial aos detalhes' },
      { src: '/assets/images/greeting-orblend-engine.webp', alt: 'Orblend Engine', caption: 'O orblend engine é a inteligência por trás do noteous. Ele habilita uma série de recursos úteis, além de criar os Orbs, que aumentam a organização' },
      { src: '/assets/images/greeting-orbs.webp', alt: 'Orbs', caption: 'Os Orbs são uma novidade da 2ª Geração. É uma forma de organizar suas notas. Por exemplo, as notas concluídas ficam em um Orb específico delas. E no futuro será possível desbloquear novas cores de Orbs' },
    ]
  }
]

function renderBannerDescription(entry) {
  const container = document.getElementById('banner-description')
  container.innerHTML = ''

  const title = document.createElement('h3')
  title.textContent = entry.title
  container.appendChild(title)

  const desc = document.createElement('p')
  desc.textContent = entry.description
  container.appendChild(desc)

  for (const imgData of entry.images) {
    const figure = document.createElement('figure')
    figure.className = 'gallery-figure'

    const img = document.createElement('img')
    img.src = imgData.src
    img.alt = imgData.alt
    figure.appendChild(img)

    const caption = document.createElement('figcaption')
    caption.textContent = imgData.caption
    figure.appendChild(caption)

    container.appendChild(figure)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const bannersContainer = document.getElementById('gallery-banners-container')
  bannersContainer.innerHTML = ''

  for (const entry of galleryData) {
    const banner = document.createElement('div')
    banner.className = 'gallery-banner'
    banner.dataset.id = entry.id

    const img = document.createElement('img')
    img.src = entry.banner
    img.alt = `Banner da ${entry.title}`
    banner.appendChild(img)

    banner.addEventListener('click', () => {
      document.querySelectorAll('.gallery-banner').forEach(b => b.classList.remove('active'))
      banner.classList.add('active')
      renderBannerDescription(entry)
    })

    bannersContainer.appendChild(banner)
  }

  // Auto-select first banner
  if (galleryData.length > 0) {
    bannersContainer.querySelector('.gallery-banner').classList.add('active')
  }
})