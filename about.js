let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

function setTheme(context) {
  if (context == 'light') {
    noteousSettings.theme = themeParams = {
      themeLum: 'light',
      hue: '--hue: 30;',
      str: '--str: 90%;',
      lumBack: '--lum-back: 90%;',
      lumMid: '--lum-mid: 60%;',
      lumFront: '--lum-front: 10%;'
    }

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    document.querySelector(
      ':root'
    ).style.cssText = `${noteousSettings.theme.hue} ${noteousSettings.theme.str}
${noteousSettings.theme.lumBack}
${noteousSettings.theme.lumMid}
${noteousSettings.theme.lumFront}`
  } else if (context == 'dark') {
    noteousSettings.theme = themeParams = {
      themeLum: 'dark',
      hue: '--hue: 30;',
      str: '--str: 40%;',
      lumBack: '--lum-back: 10%;',
      lumMid: '--lum-mid: 30%;',
      lumFront: '--lum-front: 90%;'
    }

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    document.querySelector(
      ':root'
    ).style.cssText = `${noteousSettings.theme.hue} ${noteousSettings.theme.str}
${noteousSettings.theme.lumBack}
${noteousSettings.theme.lumMid}
${noteousSettings.theme.lumFront}`
  }
}

//inicializar tema: verifica qual foi o último tema salvo e aplica ele
if (noteousSettings.theme == null) {
  setTheme('light')
} else if (noteousSettings.theme.themeLum == 'light') {
  setTheme('light')
} else if (noteousSettings.theme.themeLum == 'dark') {
  setTheme('dark')
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

  localStorage.setItem('noteous-main', JSON.stringify(noteousGetEnote))

  enoteNotes.value = 'Suas notas foram adicionadas ao noteous!'
  enoteNotesButton.setAttribute('disabled', 'disabled')
}
