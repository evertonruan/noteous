//CONFIGURAÇÕES - TEMA

function themeLight() {
  themeParams = {
    themeLum: 'light',
    hue: '--hue: 30;',
    str: '--str: 90%;',
    lumBack: '--lum-back: 90%;',
    lumMid: '--lum-mid: 60%;',
    lumFront: '--lum-front: 10%;'
  }

  localStorage.setItem('theme', JSON.stringify(themeParams))
  let theme = JSON.parse(localStorage.getItem('theme'))
  document.querySelector(':root').style.cssText = `${theme.hue} ${theme.str}
${theme.lumBack}
${theme.lumMid}
${theme.lumFront}`
}

function themeDark() {
  themeParams = {
    themeLum: 'dark',
    hue: '--hue: 30;',
    str: '--str: 40%;',
    lumBack: '--lum-back: 10%;',
    lumMid: '--lum-mid: 30%;',
    lumFront: '--lum-front: 90%;'
  }

  localStorage.setItem('theme', JSON.stringify(themeParams))
  let theme = JSON.parse(localStorage.getItem('theme'))
  document.querySelector(':root').style.cssText = `${theme.hue} ${theme.str}
${theme.lumBack}
${theme.lumMid}
${theme.lumFront}`
}

//inicializar tema: verifica qual foi o último tema salvo e aplica ele
let theme = JSON.parse(localStorage.getItem('theme'))
if (theme == null) {
  themeLight()
} else if (theme.themeLum == 'light') {
  themeLight()
} else if (theme.themeLum == 'dark') {
  themeDark()
}

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

//COMPATIBILIDADE COM VERSÃO 0.9.2
let enoteNotes = document.querySelector('#enote-notes')
let enoteNotesButton = document.querySelector('#enote-notes-add')

function addEnoteNotes() {
  let noteousGetEnote = JSON.parse(enoteNotes.value)
  let noteousVersion = "1.0updated"

  localStorage.setItem('noteous-main', JSON.stringify(noteousGetEnote))

  enoteNotes.value = "Suas notas foram adicionadas!"
  enoteNotesButton.setAttribute('disabled', 'disabled');
  
}