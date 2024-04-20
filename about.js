let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []

//ELEMENTOS //////
let baseRemOptionNormal = document.querySelector('#baserem-normal')
let baseRemOptionBig = document.querySelector('#baserem-big')
let baseRemOptionSmall = document.querySelector('#baserem-small')

let optionLight = document.querySelector('#luminosity-light')
let optionDark = document.querySelector('#luminosity-dark')

let buttonPolicies = document.querySelector('#about-button-policies')
let policiesContainerData = document.querySelector('#policies-container-data')

///////

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

///////

// CONFIGURAÇÕES DE TEMA ////////////////////////////////////
function noteousTheme(context) {
  //context => recuperar tema, trocar tema, aplicar tema claro, aplicar tema escuro
  if (context == 'retrieve-theme') {
    if (noteousSettings.look.themeLum == 'light') {
      noteousTheme('set-theme-light')
      console.log(context)
    } else if (noteousSettings.look.themeLum == 'dark') {
      noteousTheme('set-theme-dark')
    }
  } else if (context == 'change-theme') {
    console.log(context)
    if (noteousSettings.look.themeLum == 'light') {
      noteousTheme('set-theme-dark')
    } else if (noteousSettings.look.themeLum == 'dark') {
      noteousTheme('set-theme-light')
    }
  } else if (context == 'set-theme-light') {
    noteousSettings.look.themeLum = 'light'
    noteousSettings.look.hue = '--hue: 30;'
    noteousSettings.look.saturation = '--saturation: 90%;'
    noteousSettings.look.lumBack = '--lum-back: 90%;'
    noteousSettings.look.lumMid = '--lum-mid: 60%;'
    noteousSettings.look.lumFront = '--lum-front: 10%;'
    noteousSettings.look.lumFrontInverse = '--lum-front-inverse: 95%;'
    noteousSettings.look.accentSaturation = '--accent-saturation: 90%;'
    noteousSettings.look.accentLum = '--accent-lum: 60%;'
    noteousSettings.look.lumAccentContainer = '--lum-accent-container: 50%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  } else if (context == 'set-theme-dark') {
    noteousSettings.look.themeLum = 'dark'
    noteousSettings.look.hue = '--hue: 30;'
    noteousSettings.look.saturation = '--saturation: 40%;'
    noteousSettings.look.lumBack = '--lum-back: 8%;'
    noteousSettings.look.lumMid = '--lum-mid: 30%;'
    noteousSettings.look.lumFront = '--lum-front: 90%;'
    noteousSettings.look.lumFrontInverse = '--lum-front-inverse: 15%;'
    noteousSettings.look.accentSaturation = '--accent-saturation: 90%;'
    noteousSettings.look.accentLum = '--accent-lum: 60%;'
    noteousSettings.look.lumAccentContainer = '--lum-accent-container: 50%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  }
}
noteousTheme('retrieve-theme')
///////

//VERIFICADOR DE OPÇÃO ATIVA ///////
function activeOptionVerifier() {
  if (noteousSettings.look.baseRem == '--base-rem: 100%;') {
    baseRemOptionNormal.style.background = 'var(--base-buttons)'
    baseRemOptionBig.style.background = ''
    baseRemOptionSmall.style.background = ''
  } else if (noteousSettings.look.baseRem == '--base-rem: 106.25%;') {
    baseRemOptionBig.style.background = 'var(--base-buttons)'
    baseRemOptionNormal.style.background = ''
    baseRemOptionSmall.style.background = ''
  } else if (noteousSettings.look.baseRem == '--base-rem: 93.75%;') {
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
}

activeOptionVerifier()

//////

baseRemOptionNormal.addEventListener('click', () => {
  noteousSettings.look.baseRem = '--base-rem: 100%;'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  injectCSSOnRoot()
  activeOptionVerifier()
})

baseRemOptionBig.addEventListener('click', () => {
  noteousSettings.look.baseRem = '--base-rem: 106.25%;'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  injectCSSOnRoot()
  activeOptionVerifier()
})

baseRemOptionSmall.addEventListener('click', () => {
  noteousSettings.look.baseRem = '--base-rem: 93.75%;'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  injectCSSOnRoot()
  activeOptionVerifier()
})

// CONFIGURAÇÃO --> TEMA //////

optionLight.addEventListener('click', () => {
  noteousTheme('set-theme-light')
  activeOptionVerifier()
})
optionDark.addEventListener('click', () => {
  noteousTheme('set-theme-dark')
  activeOptionVerifier()
})

noteousTheme('retrieve-theme')

//BOTÃO DE POLICIES
buttonPolicies.addEventListener('click', () => {
  fetch('./policies.json')
    .then(policies => policies.json())
    .then(policies => {
      let noteousPolicies = policies

      let policiesTitleTerms = document.createElement('p')
      policiesTitleTerms.classList.add('greeting-description-title')
      policiesTitleTerms.append('Termos de Uso')

      let policiesDescriptionTerms = document.createElement('p')

      for (char of noteousPolicies.termsUse) {
        policiesDescriptionTerms.append(char)
        if (char == '\n') {
          policiesDescriptionTerms.append(
            document.createElement('br'),
            document.createElement('br')
          )
        }
      }

      let policiesTitlePrivacy = document.createElement('p')
      policiesTitlePrivacy.classList.add('greeting-description-title')
      policiesTitlePrivacy.append('Política de Privacidade')

      let policiesDescriptionPrivacy = document.createElement('p')

      for (char of noteousPolicies.privacyPolicy) {
        policiesDescriptionPrivacy.append(char)
        if (char == '\n') {
          policiesDescriptionPrivacy.append(
            document.createElement('br'),
            document.createElement('br')
          )
        }
      }
    })
})

//MODO AVANÇADO

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
