let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []

if (noteousSettings == null || noteousSettings.noteousVersion < 1.5) {
  //Redireciona a página inicial se Termos não foram aceitos
  window.location.replace('./index.html')
}

//ELEMENTOS //////

let baseRemOptionNormal = document.querySelector('#baserem-normal')
let baseRemOptionBig = document.querySelector('#baserem-big')
let baseRemOptionSmall = document.querySelector('#baserem-small')

let optionLight = document.querySelector('#luminosity-light')
let optionDark = document.querySelector('#luminosity-dark')

let buttonPolicies = document.querySelector('#about-button-policies')
let policiesContainerData = document.querySelector('#policies-container-data')
let policiesSwitchVar = 0

let cupcake = document.querySelector('#cupcake')
let cupcakeOutline = document.querySelector('#cupcake-outline')
let label = document.querySelector('#gen-child-2')

///////

function navLink() {
  window.location.replace('./index.html')
}

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
    noteousSettings.look.luminosity = 'dark'
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
  if (policiesSwitchVar == 0) {
    policiesSwitchVar = 1

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
        policiesContainerData.append(
          policiesTitleTerms,
          policiesDescriptionTerms,
          policiesTitlePrivacy,
          policiesDescriptionPrivacy
        )
      })
  } else if (policiesSwitchVar == 1) {
    policiesSwitchVar = 0
    policiesContainerData.innerHTML = ''
  }
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

let e = 100
let p = 0

let erefresh

function prefresh(){
  erefresh = setInterval(() => {
    p++
    label.textContent = p
  }, 50);
}

cupcakeOutline.style.animation = 'rotate 100s linear infinite'

cupcake.addEventListener('click', () => {
  e -= 1

  if (e == 99) {
    cupcakeOutline.style.animation = 'rotate 50s linear infinite'
  } else if (e == 97) {
    prefresh()
    cupcake.setAttribute('src', './img/cupcake/cupcake-2.png')
  } else if (e == 90) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-3.png')
    cupcake.classList.add('clickable')
    cupcakeOutline.style.animation = 'rotate 30s linear infinite'
  } else if (e == 80) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-4.png')
  } else if (e == 70) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-5.png')
    cupcakeOutline.style.animation = 'rotate 15s linear infinite'
  } else if (e == 65) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-6.png')
  } else if (e == 60) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-7.png')
  } else if (e == 50) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-8.png')
  } else if (e == 40) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-9.png')
    cupcakeOutline.style.animation = 'rotate 10s linear infinite'
  } else if (e == 35) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-10.png')
  } else if (e == 30) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-11.png')
  } else if (e == 25) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-12.png')
  } else if (e == 20) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-13.png')
  } else if (e == 15) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-14.png')
  } else if (e == 10) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-15.png')
  } else if (e == 5) {
    cupcake.setAttribute('src', './img/cupcake/cupcake-16.png')
    cupcakeOutline.style.animation = 'rotate 5s linear infinite'
  } else if (e == 0) {
    cupcake.classList.remove('clickable')
    cupcake.setAttribute('src', './img/cupcake/cupcake-17.png')
    cupcakeOutline.style.animation = 'rotate 3s linear infinite'
    clearInterval(erefresh)
    let s = function (event) {
      let s
      if (p <= 200) {
        s = '⚡⚡⚡⚡⚡'
      } else if (p > 201 && p <= 300) {
        s = '⚡⚡⚡⚡'
      } else if (p > 301 && p <= 400) {
        s = '⚡⚡⚡'
      } else if (p > 401 && p <= 500) {
        s = '⚡⚡'
      } else if (p >= 501) {
        s = '⚡'
      }
      return s
    }
    label.textContent = `${p} ${s()}`
  }
})