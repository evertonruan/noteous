let body = document.querySelector('body')
let root = document.querySelector(':root')

let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
let cssRootGroup //Usada para agrupar todos os valores CSS adicionados a :root. Motivo: se forem colocados separadamente, um irá sobrescrever o outro.

//ELEMENTOS //////
let baseRemOptionNormal = document.querySelector('#baserem-normal')
let baseRemOptionBig = document.querySelector('#baserem-big')
let baseRemOptionSmall = document.querySelector('#baserem-small')

let optionLight = document.querySelector('#luminosity-light')
let optionDark = document.querySelector('#luminosity-dark')

let shortcutLuminosity = document.querySelector('#shortcut-luminosity')
let shortcutBaseRem = document.querySelector('#shortcut-baserem')

///////

function injectCSSOnRoot() {
  root.style = `${noteousSettings.look.hue} ${noteousSettings.look.saturation}
${noteousSettings.look.lumBack}
${noteousSettings.look.lumMid}
${noteousSettings.look.lumFront} ${noteousSettings.look.baseRem}`
}

///////

function noteousLook(context) {
  //context => recuperar tema, trocar tema, aplicar tema claro, aplicar tema escuro
  if (context == 'retrieve-look') {
    if (noteousSettings.look.luminosity == 'light') {
      noteousLook('set-luminosity-light')
    } else if (noteousSettings.look.luminosity == 'dark') {
      noteousLook('set-luminosity-dark')
    }
  } else if (context == 'change-luminosity') {
    if (noteousSettings.look.luminosity == 'light') {
      noteousLook('set-luminosity-dark')
    } else if (noteousSettings.look.luminosity == 'dark') {
      noteousLook('set-luminosity-light')
    }
  } else if (context == 'set-luminosity-light') {
    noteousSettings.look.luminosity = 'light'
    noteousSettings.look.hue = '--hue: 30;'
    noteousSettings.look.saturation = '--saturation: 90%;'
    noteousSettings.look.lumBack = '--lum-back: 90%;'
    noteousSettings.look.lumMid = '--lum-mid: 60%;'
    noteousSettings.look.lumFront = '--lum-front: 10%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  } else if (context == 'set-luminosity-dark') {
    noteousSettings.look.luminosity = 'dark'
    noteousSettings.look.hue = '--hue: 30;'
    noteousSettings.look.saturation = '--saturation: 40%;'
    noteousSettings.look.lumBack = '--lum-back: 10%;'
    noteousSettings.look.lumMid = '--lum-mid: 30%;'
    noteousSettings.look.lumFront = '--lum-front: 90%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  }
}

///////

//VERIFICADOR DE OPÇÃO ATIVA ///////
function activeOptionVerifier() {
  if (noteousSettings.look.baseRem == '--base-rem: 100%') {
    baseRemOptionNormal.style.background = 'var(--base-buttons)'
    baseRemOptionBig.style.background = ''
    baseRemOptionSmall.style.background = ''
  } else if (noteousSettings.look.baseRem == '--base-rem: 106.25%') {
    baseRemOptionBig.style.background = 'var(--base-buttons)'
    baseRemOptionNormal.style.background = ''
    baseRemOptionSmall.style.background = ''
  } else if (noteousSettings.look.baseRem == '--base-rem: 93.75%') {
    baseRemOptionSmall.style.background = 'var(--base-buttons)'
    baseRemOptionNormal.style.background = ''
    baseRemOptionBig.style.background = ''
  }

  if (noteousSettings.look.luminosity == 'light') {
    optionLight.style.background = 'var(--base-buttons)'
    optionDark.style.background = ''
  } else if (noteousSettings.look.luminosity == 'dark') {
    optionDark.style.background = 'var(--base-buttons)'
    optionLight.style.background = ''
  }

  if (noteousSettings.look.shortcut == 'luminosity') {
    shortcutLuminosity.style.background = 'var(--base-buttons)'
    shortcutBaseRem.style.background = ''
  } else if (noteousSettings.look.shortcut == 'baseRem') {
    shortcutBaseRem.style.background = 'var(--base-buttons)'
    shortcutLuminosity.style.background = ''
  }
}
activeOptionVerifier()

///////

//CONFIGURAÇÃO --> TAMANHO DE TEXTO ///////

baseRemOptionNormal.addEventListener('click', () => {
  noteousSettings.look.baseRem = '--base-rem: 100%'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  injectCSSOnRoot()
  activeOptionVerifier()
})

baseRemOptionBig.addEventListener('click', () => {
  noteousSettings.look.baseRem = '--base-rem: 106.25%'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  injectCSSOnRoot()
  activeOptionVerifier()
})

baseRemOptionSmall.addEventListener('click', () => {
  noteousSettings.look.baseRem = '--base-rem: 93.75%'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  injectCSSOnRoot()
  activeOptionVerifier()
})

// CONFIGURAÇÃO --> TEMA //////

optionLight.addEventListener('click', () => {
  noteousLook('set-luminosity-light')
  activeOptionVerifier()
})
optionDark.addEventListener('click', () => {
  noteousLook('set-luminosity-dark')
  activeOptionVerifier()
})

noteousLook('retrieve-look')

// CONFIGURAÇÃO --> ATALHO //////

shortcutLuminosity.addEventListener('click', () => {
  noteousSettings.look.shortcut = 'luminosity'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  activeOptionVerifier()
})

shortcutBaseRem.addEventListener('click', () => {
  noteousSettings.look.shortcut = 'baseRem'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  activeOptionVerifier()
})

//////

//MODO AVANÇADO //////

let advancedContainer = document.querySelector('#advanced-container')
let advancedSwitch = document.querySelector('#advanced-switch')
let updateAdvanced = document.querySelectorAll('.update-advanced')

let isAdvanced = false
for (point of updateAdvanced) {
  point.setAttribute('hidden', 'true')
}

advancedSwitch.addEventListener('click', () => {
  if (isAdvanced == false) {
    advancedSwitch.style.cssText = 'background-color: var(--base-buttons);'
    isAdvanced = true
    for (point of updateAdvanced) {
      point.removeAttribute('hidden')
    }
  } else {
    advancedSwitch.style.cssText = 'background-color: inherit;'
    isAdvanced = false
    for (point of updateAdvanced) {
      point.setAttribute('hidden', 'true')
    }
  }
})
