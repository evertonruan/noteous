let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []

if (noteousSettings == null || noteousSettings.noteousVersion < 1.5) {
  //Redireciona a página inicial se Termos não foram aceitos
  window.location.replace('./index.html')
} else {
  if ('serviceWorker' in navigator) {
    ;(async () => {
      try {
        const fileLoaded = await fileLoad()
        if (fileLoaded != null) {
          showNotesModal(fileLoaded)
        }
      } catch (error) {
        alert('Erro ao carregar arquivo:' + error)
      }
    })()
  }
}

//ELEMENTOS //////

let aboutSettingsSection = document.querySelector('#about-settings')

let baseRemOptionNormal = document.querySelector('#baserem-normal')
let baseRemOptionBig = document.querySelector('#baserem-big')
let baseRemOptionSmall = document.querySelector('#baserem-small')

let optionLight = document.querySelector('#luminosity-light')
let optionDark = document.querySelector('#luminosity-dark')

let toggleActionButtonShare = document.querySelector('#toggle-action-button-share')
let toggleActionButtonCopy = document.querySelector('#toggle-action-button-copy')

let viewDoneNotesButton = document.querySelector('#view-done-notes')

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

// ELEMENTOS DO DRAG-DROP DE PRIORIDADE
let priorityContainer = document.querySelector('#priority-order-container')

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

let installButton = document.createElement('button')
installButton.id = 'install-button'
installButton.type = 'button'
installButton.classList.add('write-buttons')
installButton.append('Instalar noteous')
let deferredInstallPrompt

installButton.addEventListener('click', async () => {
    try {
      installButton.disabled = true
      // Show the browser install prompt
      deferredInstallPrompt.prompt()
      const { outcome } = await deferredInstallPrompt.userChoice
      // Clear the saved event regardless of outcome
      deferredInstallPrompt = null
      if (outcome === 'accepted') {
        // Hide button; appinstalled event will also fire
        const b = document.querySelector('#install-button')
        if (b) b.remove()
      } else {
        // If dismissed, we can enable again to allow retry later
        installButton.disabled = false
      }
    } catch (e) {
      // On any error, allow retry later
      installButton.disabled = false
    }
  })

function renderInstallButton() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredInstallPrompt = e
    aboutSettingsSection.prepend(installButton)
  })
}
renderInstallButton()

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
  toggleActionButtonShare.checked = noteousSettings.actionButtons.includes('share')
  toggleActionButtonCopy.checked = noteousSettings.actionButtons.includes('copy')
  
  // Exibe o botão "Criar Cópia" apenas se houver ao menos 1 nota salva
  if (noteousMain.length == 0) {
    copyCreateButton.classList.add('hidden-element')
  }
  
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
  
  // Atualiza a ordem das prioridades na interface
  if (priorityContainer && noteousSettings.priorityOrder) {
    updatePriorityNumbers()
  }
}

activeOptionVerifier()

//////

// SISTEMA DE DRAG-DROP PARA PRIORIDADES //////
let draggedElement = null

function initPriorityDragDrop() {
  if (!priorityContainer) return
  
  const items = priorityContainer.querySelectorAll('.priority-item')
  items.forEach(item => {
    item.addEventListener('dragstart', e => {
      draggedElement = item
      item.classList.add('dragging')
    })
    
    item.addEventListener('dragover', e => e.preventDefault())
    
    item.addEventListener('dragenter', e => {
      if (item !== draggedElement) item.classList.add('drag-over')
    })
    
    item.addEventListener('dragleave', e => item.classList.remove('drag-over'))
    
    item.addEventListener('drop', e => {
      e.preventDefault()
      if (item !== draggedElement) swapPriorities(draggedElement, item)
      item.classList.remove('drag-over')
    })
    
    item.addEventListener('dragend', e => {
      items.forEach(i => i.classList.remove('dragging', 'drag-over'))
      draggedElement = null
    })
  })
  
  updatePriorityNumbers()
}

function swapPriorities(from, to) {
  const fromPriority = from.dataset.priority
  const toPriority = to.dataset.priority
  const fromIndex = noteousSettings.priorityOrder.indexOf(fromPriority)
  const toIndex = noteousSettings.priorityOrder.indexOf(toPriority)
  
  // Troca no array
  noteousSettings.priorityOrder[fromIndex] = toPriority
  noteousSettings.priorityOrder[toIndex] = fromPriority
  
  // Troca os data-priority dos elementos para atualizar os estilos visuais
  from.dataset.priority = toPriority
  to.dataset.priority = fromPriority
  
  // Salva no localStorage
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  
  // Atualiza apenas os números
  updatePriorityNumbers()
}

function reorderPriorityItems() {
  if (!noteousSettings.priorityOrder) return
  
  const items = Array.from(priorityContainer.children)
  
  // Limpa o container
  priorityContainer.innerHTML = ''
  
  // Reordena baseado no priorityOrder
  noteousSettings.priorityOrder.forEach((priority, index) => {
    const item = items.find(i => i.dataset.priority === priority)
    if (item) {
      item.textContent = index + 1
      priorityContainer.appendChild(item)
    }
  })
}

function updatePriorityNumbers() {
  const items = priorityContainer.querySelectorAll('.priority-item')
  items.forEach((item, index) => item.textContent = index + 1)
}

// Inicializa o sistema
if (priorityContainer) {
  loadPriorityOrder()
  initPriorityDragDrop()
}

function loadPriorityOrder() {
  // Recupera a ordem salva e reordena a interface
  if (noteousSettings && noteousSettings.priorityOrder) {
    reorderPriorityItems()
  }
}

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

// BOTÕES DE AÇÃO //////

toggleActionButtonShare.addEventListener('change', () => {
    if (!noteousSettings.actionButtons.includes('share')) {
      noteousSettings.actionButtons.push('share')
    } else {
      noteousSettings.actionButtons = noteousSettings.actionButtons.filter(actionButton => actionButton != 'share')
    }
  
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  activeOptionVerifier()
})

toggleActionButtonCopy.addEventListener('change', () => {
    if (!noteousSettings.actionButtons.includes('copy')) {
      noteousSettings.actionButtons.push('copy')
    } else {
      noteousSettings.actionButtons = noteousSettings.actionButtons.filter(actionButton => actionButton != 'copy')
    }
  
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  activeOptionVerifier()
})

//////


noteousTheme('retrieve-theme')

//BOTÃO VER NOTAS CONCLUÍDAS
viewDoneNotesButton.addEventListener('click', () => {
  showDoneNotesModal()
})

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
  // Segurança adicional: não permite abrir se não houver notas
  if (!noteousMain || noteousMain.length === 0) return
  if (copyDetailsSwitchVar == 0 || copyDetailsSwitchVar == 2) {
    copyDetailsSwitchVar = 1
    copyDetailsContainer.innerHTML = ''

    // Descrição sobre a funcionalidade
    let copyDescription = document.createElement('p')
    copyDescription.textContent = 'Baixe uma cópia das suas notas. Você pode armazenar essa cópia para ter segurança adicional ou para enviar a outro dispositivo que você utiliza o noteous, como celular ou computador.'

    // Informação sobre quantidade de notas
    let notesInfo = document.createElement('p')
    notesInfo.textContent = `Você tem ${noteousMain.length} nota${noteousMain.length !== 1 ? 's' : ''}`

    // Container para os botões
    let buttonsContainer = document.createElement('div')
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    `

    if (hasWebShareSupport()) {
      // Se suporta compartilhamento, mostra dois botões
      
      // Botão de compartilhar
      let copyShareButton = document.createElement('button')
      copyShareButton.classList.add('option-point')
      copyShareButton.textContent = 'Enviar cópia'
      copyShareButton.type = 'button'
      copyShareButton.addEventListener('click', () => {
        createNoteCopyShare()
      })

      // Botão de download
      let copyDownloadButton = document.createElement('button')
      copyDownloadButton.classList.add('option-point')
      copyDownloadButton.textContent = 'Baixar cópia'
      copyDownloadButton.type = 'button'
      copyDownloadButton.addEventListener('click', () => {
        createNoteCopyDownload()
      })

      buttonsContainer.append(copyShareButton, copyDownloadButton)
    } else {
      // Se não suporta compartilhamento, mostra apenas download
      let copyDownloadButton = document.createElement('button')
      copyDownloadButton.classList.add('option-point')
      copyDownloadButton.textContent = 'Criar e Baixar cópia'
      copyDownloadButton.type = 'button'
      copyDownloadButton.addEventListener('click', () => {
        createNoteCopyDownload()
      })

      buttonsContainer.append(copyDownloadButton)
    }

    // Adiciona todos os elementos ao container
    copyDetailsContainer.append(copyDescription, notesInfo, buttonsContainer)

  } else if (copyDetailsSwitchVar == 1) {
    copyDetailsSwitchVar = 0
    copyDetailsContainer.innerHTML = ''
    }

  activeOptionVerifier()

})

//FUNÇÃO PARA VERIFICAR SUPORTE AO WEB SHARE API
function hasWebShareSupport() {
  // Verifica se navigator.share existe
  if (!navigator.share) {
    return false
  }
  
  // Verifica se navigator.canShare existe e se suporta arquivos
  if (!navigator.canShare) {
    return false
  }
  
  // Testa se pode compartilhar arquivos criando um arquivo temporário
  try {
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' })
    return navigator.canShare({ files: [testFile] })
  } catch (err) {
    return false
  }
}

//FUNÇÃO PARA FORMATAR DATA NO FORMATO DDMMAA-HHMMSS
function formatDate(context, timestamp) {
  if (context == 'create-copy') {
    const date = new Date(timestamp)
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
  
    return `${day}${month}${year}-${hours}${minutes}${seconds}`
  }
  else if (context == 'open-copy') {
    const date = new Date(timestamp)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = String(date.getFullYear()).slice(-2)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    console.log(`${date}${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`)
    return `${day}/${month}/${year} às ${hours}:${minutes}:${seconds}`
  }
}

//FUNÇÃO PARA CRIAR CÓPIA DAS NOTAS (COMPARTILHAR)
async function createNoteCopyShare() {
  
  const notesData = {
    notes: noteousMain,
    exportDate: Date.now(),
    totalNotes: noteousMain.length,
    noteousVersion: noteousVersion
  }

  const dataStr = JSON.stringify(notesData, null, 2)
  const fileName = `noteous - ${formatDate('create-copy', Date.now())} - Cópia de Notas.txt`

  try {
    const file = new File([dataStr], fileName, { type: 'text/plain' })
    await navigator.share({
      files: [file],
      title: 'Cópia de Notas do noteous'
    })
  } catch (err) {
    // Se o compartilhamento falhar, faz o fallback para download
    console.log('Erro no compartilhamento:', err)
    createNoteCopyDownload()
  }
}

//FUNÇÃO PARA CRIAR CÓPIA DAS NOTAS (DOWNLOAD)
function createNoteCopyDownload() {
  
  const notesData = {
    notes: noteousMain,
    exportDate: Date.now(),
    totalNotes: noteousMain.length,
    noteousVersion: noteousVersion
  }

  const dataStr = JSON.stringify(notesData, null, 2)
  const fileName = `noteous - ${formatDate('create-copy', Date.now())} - Cópia de Notas.txt`

  // Download do arquivo .txt
  const dataBlob = new Blob([dataStr], { type: 'text/plain' })
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

  // Input file para selecionar arquivo (somente .txt - novo método)
    let copyFileInput = document.createElement('input')
    copyFileInput.type = 'file'
  copyFileInput.accept = '.txt,text/plain'
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
        // Verifica se é um arquivo .txt válido
        const isTxt = file.type === 'text/plain' || (file.name || '').toLowerCase().endsWith('.txt')
        if (!isTxt) {
          alert('Selecione um arquivo .txt gerado pelo noteous.')
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const notesData = JSON.parse(e.target.result)
            // Valida estrutura básica esperada
            if (!notesData || !Array.isArray(notesData.notes)) {
              throw new Error('Estrutura inválida')
            }
            showNotesModal(notesData)
          } catch (error) {
            alert('Erro ao ler o arquivo. Verifique se é um arquivo .txt válido de cópia do noteous.')
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

//FUNÇÃO PARA EXIBIR MODAL COM NOTAS CONCLUÍDAS
function showDoneNotesModal() {
  // Filtra apenas as notas concluídas
  const doneNotes = noteousMain.filter(note => note.done === true)
  
  if (doneNotes.length === 0) {
    alert('Não há notas concluídas.')
    return
  }

  // Usa a mesma estrutura do modal de cópias de notas
  const notesData = {
    notes: doneNotes,
    totalNotes: doneNotes.length
  }

  showNotesModal(notesData, 'done-notes')
}

//FUNÇÃO PARA EXIBIR MODAL COM AS NOTAS DA CÓPIA
function showNotesModal(notesData, context = 'copy') {
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
  modalTitle.textContent = context === 'done-notes' ? 'Notas Concluídas' : 'Visualizar Cópia de Notas'
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

  const packageInfoText = document.createElement('p')
  if (context === 'done-notes') {
    packageInfoText.innerHTML = `
      <strong>Quantidade de notas concluídas:</strong> ${notesData.totalNotes}
    `
  } else {
    packageInfoText.innerHTML = `
      <strong>Data do pacote de cópia:</strong> ${formatDate('open-copy', notesData.exportDate)}<br>
      <strong>Quantidade de notas:</strong> ${notesData.totalNotes}
    `
  }
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
      const noteElement = createNotePreview(note, index, context)
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

  // Monta o modal baseado no contexto
  if (context === 'done-notes') {
    // Para notas concluídas, não há segundo botão
    modal.append(modalTitle, packageInfo, buttonsContainer, notesContainer)
    buttonsContainer.append(closeButton)
  } else {
    // Para cópias de notas, mantém o botão importar
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

    modal.append(modalTitle, packageInfo, buttonsContainer, notesContainer)
    buttonsContainer.append(closeButton, importButton)
  }
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
function createNotePreview(note, index, context = 'copy') {
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

  // Adicionar botões de ação para notas concluídas
  if (context === 'done-notes') {
    const actionButtonsContainer = document.createElement('div')
    actionButtonsContainer.classList.add('action-buttons-container')
    actionButtonsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      padding: 0.3rem;
      align-items: center;
      border-radius: 1.2rem 0 0 1.2rem;
      background-color: var(--base-note-action-container);
    `

    // Botão Restaurar
    const restoreButton = document.createElement('button')
    restoreButton.classList.add('action-buttons', 'material-icons')
    restoreButton.textContent = 'undo'
    restoreButton.style.cssText = `
      font-size: 2rem;
      background-color: transparent;
      color: var(--base-note-action-button);
      transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      padding: 0.5rem 0.3rem;
      -webkit-user-select: none;
      user-select: none;
      border: none;
      outline: none;
    `
    restoreButton.setAttribute('aria-label', 'Restaurar nota')
    restoreButton.addEventListener('click', () => {
      if (confirm('Tem certeza que deseja restaurar esta nota?')) {
        restoreNote(note.id)
      }
    })
    restoreButton.addEventListener('mouseenter', () => {
      restoreButton.style.transform = 'scale(1.2)'
    })
    restoreButton.addEventListener('mouseleave', () => {
      restoreButton.style.transform = 'scale(1)'
    })
    restoreButton.addEventListener('mousedown', () => {
      restoreButton.style.transform = 'scale(0.9)'
    })
    restoreButton.addEventListener('mouseup', () => {
      restoreButton.style.transform = 'scale(1.2)'
    })

    // Botão Excluir Permanentemente
    const deleteButton = document.createElement('button')
    deleteButton.classList.add('action-buttons', 'material-icons')
    deleteButton.textContent = 'delete_forever'
    deleteButton.style.cssText = `
      font-size: 2rem;
      background-color: transparent;
      color: var(--base-note-action-button);
      transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
      padding: 0.5rem 0.3rem;
      -webkit-user-select: none;
      user-select: none;
      border: none;
      outline: none;
    `
    deleteButton.setAttribute('aria-label', 'Excluir nota permanentemente')
    deleteButton.addEventListener('click', () => {
        deleteNotePermanently(note.id)
    })
    deleteButton.addEventListener('mouseenter', () => {
      deleteButton.style.transform = 'scale(1.2)'
    })
    deleteButton.addEventListener('mouseleave', () => {
      deleteButton.style.transform = 'scale(1)'
    })
    deleteButton.addEventListener('mousedown', () => {
      deleteButton.style.transform = 'scale(0.9)'
    })
    deleteButton.addEventListener('mouseup', () => {
      deleteButton.style.transform = 'scale(1.2)'
    })

    actionButtonsContainer.append(restoreButton, deleteButton)
    
    // Inserir o container de ações à esquerda da nota
    noteContainer.style.display = 'flex'
    noteContainer.insertBefore(actionButtonsContainer, noteTextContainer)
  }

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
  window.location.reload()
}

//FUNÇÃO PARA RESTAURAR NOTA
function restoreNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      note.done = false
      break
    }
  }
  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  
  // Fecha o modal e recarrega a página
  const modal = document.querySelector('#modal')
  if (modal && modal.parentElement) {
    document.body.removeChild(modal.parentElement)
  }
  
  alert('Nota restaurada')
}

//FUNÇÃO PARA EXCLUIR NOTA PERMANENTEMENTE
function deleteNotePermanently(noteId) {
  noteousMain = noteousMain.filter(note => note.id !== noteId)
  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  
  // Fecha o modal e recarrega a página
  const modal = document.querySelector('#modal')
  if (modal && modal.parentElement) {
    document.body.removeChild(modal.parentElement)
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

////////////////////////////////////////

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
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-2.webp')
  } else if (e == 90) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-3.webp')
    cupcake.classList.add('clickable')
    cupcakeOutline.style.animation = 'rotate 30s linear infinite'
  } else if (e == 80) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-4.webp')
  } else if (e == 70) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-5.webp')
    cupcakeOutline.style.animation = 'rotate 15s linear infinite'
  } else if (e == 65) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-6.webp')
  } else if (e == 60) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-7.webp')
  } else if (e == 50) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-8.webp')
  } else if (e == 40) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-9.webp')
    cupcakeOutline.style.animation = 'rotate 10s linear infinite'
  } else if (e == 35) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-10.webp')
  } else if (e == 30) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-11.webp')
  } else if (e == 25) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-12.webp')
    cupcakeOutline.style.animation = 'rotate 7s linear infinite'
  } else if (e == 20) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-13.webp')
  } else if (e == 15) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-14.webp')
  } else if (e == 10) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-15.webp')
  } else if (e == 5) {
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-16.webp')
    cupcakeOutline.style.animation = 'rotate 5s linear infinite'
  } else if (e == 0) {
    cupcake.classList.remove('clickable')
    cupcake.setAttribute('src', './assets/images/cupcake/cupcake-17.webp')
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