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

let copyContainer = document.querySelector('#copy-container')
let copyCreateButton = document.querySelector('#copy-create')
let copyOpenButton = document.querySelector('#copy-open')
let copyDetailsContainer = document.querySelector('#copy-details-container')
let copyDetailsSwitchVar = 0

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

  if (copyDetailsSwitchVar == 0) {
    copyDetailsContainer.innerHTML = ''
    copyCreateButton.style.background = ''
    copyOpenButton.style.background = ''
  } else if (copyDetailsSwitchVar == 1) {
    copyCreateButton.style.background = 'var(--base-buttons)'
    copyOpenButton.style.background = ''
  } else if (copyDetailsSwitchVar == 2) {
    copyOpenButton.style.background = 'var(--base-buttons)'
    copyCreateButton.style.background = ''
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

//BOTÃO CRIAR CÓPIA
copyCreateButton.addEventListener('click', () => {
  if (copyDetailsSwitchVar == 0 || copyDetailsSwitchVar == 2) {
    copyDetailsSwitchVar = 1
    copyDetailsContainer.innerHTML = ''

  // Descrição sobre a funcionalidade
  let copyDescription = document.createElement('p')
  copyDescription.textContent = 'Crie uma cópia das suas notas e compartilhe com outro dispositivo que você utiliza o noteous (celular ou computador). Em navegadores sem compartilhamento, será feito o download.'

    // Informação sobre quantidade de notas
    let notesInfo = document.createElement('p')
    notesInfo.textContent = `Você tem ${noteousMain.length} nota${noteousMain.length !== 1 ? 's' : ''}`

  // Botão para executar a criação/compartilhamento da cópia
  let copyDownloadButton = document.createElement('button')
  copyDownloadButton.classList.add('option-point')
  copyDownloadButton.textContent = 'Criar e compartilhar cópia'
  copyDownloadButton.type = 'button'

    // Event listener para o botão de download
    copyDownloadButton.addEventListener('click', () => {
      createNoteCopy()
    })

    // Adiciona todos os elementos ao container
    copyDetailsContainer.append(copyDescription, notesInfo, copyDownloadButton)

  } else if (copyDetailsSwitchVar == 1) {
    copyDetailsSwitchVar = 0
    copyDetailsContainer.innerHTML = ''
    }

  activeOptionVerifier()

})

//FUNÇÃO PARA CRIAR CÓPIA DAS NOTAS (compartilhar com fallback de download)
async function createNoteCopy() {
  const notesData = {
    notes: noteousMain,
    exportDate: new Date().toISOString(),
    totalNotes: noteousMain.length,
    appVersion: '1.6.3'
  }

  const dataStr = JSON.stringify(notesData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/octet-stream' })
  const fileName = `Cópia de Notas - ${new Date().toISOString().split('T')[0]}.noteouspack`

  // Tenta compartilhar o arquivo (Web Share API Level 2)
  try {
    const file = new File([dataBlob], fileName, { type: dataBlob.type })

    if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
      await navigator.share({
        files: [file],
        title: 'Cópia de Notas',
        text: 'Pacote de notas exportado do noteous'
      })
      return // compartilhamento feito, não prossegue para download
    }
  } catch (err) {
    // Se o usuário cancelar (AbortError/NotAllowedError), não faz nada; para outros erros, cai no fallback
    if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) {
      return
    }
  }

  // Fallback: realiza o download no navegador
  const link = document.createElement('a')
  link.href = URL.createObjectURL(dataBlob)
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(link.href)
}

//BOTÃO ABRIR CÓPIA
copyOpenButton.addEventListener('click', () => {
  if (copyDetailsSwitchVar == 0 || copyDetailsSwitchVar == 1) {
    copyDetailsSwitchVar = 2
    copyDetailsContainer.innerHTML = ''

    // Descrição sobre a funcionalidade
    let copyDescription = document.createElement('p')
    copyDescription.textContent = 'Abra uma cópia de notas criada anteriormente. Você pode visualizar as notas e também importá-las ao noteous, substituindo as notas atuais.'

    // Input file para selecionar arquivo
    let copyFileInput = document.createElement('input')
    copyFileInput.type = 'file'
    copyFileInput.accept = '.json,.noteouspack,application/json,application/octet-stream'
    copyFileInput.style.display = 'none'

    // Botão para abrir seletor de arquivos
    let copyOpenFileButton = document.createElement('button')
    copyOpenFileButton.classList.add('option-point')
    copyOpenFileButton.textContent = 'Buscar cópia'
    copyOpenFileButton.type = 'button'

    // Event listener para o botão de abrir arquivo
    copyOpenFileButton.addEventListener('click', () => {
      copyFileInput.click()
    })

    // Event listener para quando um arquivo é selecionado
    copyFileInput.addEventListener('change', (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const notesData = JSON.parse(e.target.result)
            showNotesModal(notesData)
          } catch (error) {
            alert('Erro ao ler o arquivo. Verifique se é um arquivo válido de cópia do noteous.')
          }
        }
        reader.readAsText(file)
      }
    })

    // Adiciona ao container
    copyDetailsContainer.append(copyDescription, copyOpenFileButton, copyFileInput)

  } else if (copyDetailsSwitchVar == 2) {
    copyDetailsSwitchVar = 0
    copyDetailsContainer.innerHTML = ''
  }

  activeOptionVerifier()

})

//FUNÇÃO PARA EXIBIR MODAL COM AS NOTAS DA CÓPIA
function showNotesModal(notesData) {
  // Cria o overlay do modal
  const modalOverlay = document.createElement('div')
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  `

  // Cria o modal
  const modal = document.createElement('div')
  modal.id = 'modal'
  modal.style.cssText = `
    background-color: var(--base-color);
    border-radius: 1rem;
    border: 1px solid var(--base-text);
    padding: 1.5rem;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `

  // Título do modal
  const modalTitle = document.createElement('h2')
  modalTitle.textContent = 'Visualizar Cópia de Notas'
  modalTitle.style.cssText = `
    margin-bottom: 1rem;
    color: var(--base-text);
  `

  // Informações do pacote
  const packageInfo = document.createElement('div')
  packageInfo.style.cssText = `
    margin-bottom: 1.5rem;
    padding: 1rem;
  `

  const exportDate = new Date(notesData.exportDate).toLocaleDateString('pt-BR')
  const packageInfoText = document.createElement('p')
  packageInfoText.innerHTML = `
    <strong>Data do pacote de cópia:</strong> ${exportDate}<br>
    <strong>Quantidade de notas:</strong> ${notesData.totalNotes}
  `
  packageInfoText.style.color = 'var(--base-text)'
  packageInfo.appendChild(packageInfoText)

  // Container das notas
  const notesContainer = document.createElement('div')
  notesContainer.style.cssText = `
    margin-bottom: 1.5rem;
    max-height: 400px;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 1rem;
  `

  // Renderiza as notas
  if (notesData.notes && notesData.notes.length > 0) {
    notesData.notes.forEach((note, index) => {
      const noteElement = createNotePreview(note, index)
      notesContainer.appendChild(noteElement)
    })
  } else {
    const noNotesMessage = document.createElement('p')
    noNotesMessage.textContent = 'Nenhuma nota encontrada neste arquivo.'
    noNotesMessage.style.cssText = `
      text-align: center;
      color: var(--base-text);
      padding: 2rem;
    `
    notesContainer.appendChild(noNotesMessage)
  }

  // Container dos botões
  const buttonsContainer = document.createElement('div')
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  `

  // Botão Fechar
  const closeButton = document.createElement('button')
  closeButton.textContent = 'Fechar'
  closeButton.classList.add('option-point')
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalOverlay)
  })

  // Botão Importar
  const importButton = document.createElement('button')
  importButton.textContent = 'Importar cópia'
  importButton.classList.add('option-point')
  importButton.style.cssText = `
    background-color: var(--base-write-input-outside);
    color: var(--base-write-input-inside);
  `
  importButton.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja importar estas notas? Isso substituirá todas as suas notas atuais.')) {
      importNotes(notesData.notes)
      document.body.removeChild(modalOverlay)
    }
  })

  // Monta o modal
  buttonsContainer.append(closeButton, importButton)
  modal.append(modalTitle, packageInfo, notesContainer, buttonsContainer)
  modalOverlay.appendChild(modal)
  
  // Adiciona o modal ao body
  document.body.appendChild(modalOverlay)

  // Fecha o modal ao clicar no overlay
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      document.body.removeChild(modalOverlay)
    }
  })
}

//FUNÇÃO PARA CRIAR PREVIEW DE NOTA
function createNotePreview(note, index) {
  const noteContainer = document.createElement('div')
  noteContainer.classList.add('note-container')
  


  // Responsividade baseada no CSS original
  if (window.innerWidth <= 450) {
    noteContainer.style.maxWidth = 'none'
    noteContainer.style.flexBasis = '90%'
  } else if (window.innerWidth <= 600) {
    noteContainer.style.maxWidth = '40vw'
  } else {
    noteContainer.style.maxWidth = '40%'
  }

  //BORDER/PRIORITY
  if (note.priority == 'solid') {
    noteContainer.style.borderStyle = 'none'
  } else if (note.priority == 'double') {
    noteContainer.style.borderStyle = 'double'
  } else if (note.priority == 'dotted') {
    noteContainer.style.borderStyle = 'dotted'
  }

  //NOTE TEXT
  let noteTextContainer = document.createElement('div')
  noteTextContainer.classList.add('note-text-container')

  let textElement = document.createElement('p')

  let noteChar = note.text
  if (noteChar.length < 300) {
    //Se tamanho da nota for menor que 300, escrever nota inteira
    textElement.appendChild(document.createTextNode(noteChar))
  } else if (noteChar.length >= 300) {
    //Se tamanho da nota for maior que 300, escrever apenas até o 300º caractere e acrescentar "..."
    let count = 0
    for (let noteCharAt of noteChar) {
      textElement.appendChild(document.createTextNode(noteCharAt))
      count = count + 1
      //"Ir escrevendo" cada caractere até chegar o 300º
      if (count == 300) {
        textElement.append(document.createTextNode(' ...'))
        textElement.append(document.createElement('br'))
        textElement.append(document.createTextNode('[VER MAIS]'))
        break
      }
    }
  }

  //DATE
  let noteDateContainer = document.createElement('div')
  noteDateContainer.classList.add('note-date-container')

  let dateElement = document.createElement('p')
  
  dateElement.appendChild(
    document.createTextNode(
      `+ ${new Date(note.id).getDate()}/${findMonth(
        new Date(note.id).getMonth()
      )}/${new Date(note.id).getUTCFullYear()} às ${setTimeNumber(
        new Date(note.id).getHours()
      )}:${setTimeNumber(new Date(note.id).getMinutes())}`
    )
  )
  if (note.editedAt != undefined) {
    dateElement.appendChild(document.createElement('br'))
    dateElement.appendChild(
      document.createTextNode(
        `Última edição: ${new Date(note.editedAt).getDate()}/${findMonth(
          new Date(note.editedAt).getMonth()
        )}/${new Date(note.editedAt).getUTCFullYear()} às ${setTimeNumber(
          new Date(note.editedAt).getHours()
        )}:${setTimeNumber(new Date(note.editedAt).getMinutes())}`
      )
    )
  }

  //APPENDS
  noteTextContainer.appendChild(textElement)
  noteDateContainer.appendChild(dateElement)
  noteTextContainer.appendChild(noteDateContainer)

  noteContainer.appendChild(noteTextContainer)

  return noteContainer
}

//FUNÇÕES AUXILIARES PARA FORMATAÇÃO DE DATA
function findMonth(number) {
  if (number == 0) {
    return 'Janeiro'
  } else if (number == 1) {
    return 'Fevereiro'
  } else if (number == 2) {
    return 'Março'
  } else if (number == 3) {
    return 'Abril'
  } else if (number == 4) {
    return 'Maio'
  } else if (number == 5) {
    return 'Junho'
  } else if (number == 6) {
    return 'Julho'
  } else if (number == 7) {
    return 'Agosto'
  } else if (number == 8) {
    return 'Setembro'
  } else if (number == 9) {
    return 'Outubro'
  } else if (number == 10) {
    return 'Novembro'
  } else if (number == 11) {
    return 'Dezembro'
  }
}

function setTimeNumber(number) {
  if (number == 0) {
    return '00'
  } else if (number == 1) {
    return '01'
  } else if (number == 2) {
    return '02'
  } else if (number == 3) {
    return '03'
  } else if (number == 4) {
    return '04'
  } else if (number == 5) {
    return '05'
  } else if (number == 6) {
    return '06'
  } else if (number == 7) {
    return '07'
  } else if (number == 8) {
    return '08'
  } else if (number == 9) {
    return '09'
  } else if (number >= 10) {
    return number
  }
}

//FUNÇÃO PARA IMPORTAR NOTAS
function importNotes(notes) {
  // Substitui as notas atuais pelas importadas
  noteousMain = notes
  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  
  alert('Notas importadas com sucesso!')
  
  // Atualiza a exibição da quantidade de notas na interface
  if (copyDetailsContainer) {
    const notesInfo = copyDetailsContainer.querySelector('p:nth-child(2)')
    if (notesInfo) {
      const notesCount = noteousMain.length
      notesInfo.textContent = `Você tem ${notesCount} nota${notesCount !== 1 ? 's' : ''}`
    }
  }
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
  } else if (e == 98) {
      cupcakeOutline.style.animation = 'rotate 40s linear infinite'
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
    cupcakeOutline.style.animation = 'rotate 7s linear infinite'
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