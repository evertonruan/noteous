function serviceWorkerRegister() {
    if (noteousSettings != null && noteousSettings?.noteousApp?.noteousVersion >= 1.6) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
      }
    }
}

// ELEMENTOS /////////////////////////////////////
let body = document.querySelector('body')

let noteousVersionLabel = document.querySelector('#noteous-version-label')

//WRITE-SECTION
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')

let infoPanel = document.querySelector('#info-panel')

let writeOptions = document.querySelector('#write-options')

let writeLabel = document.querySelector('#write-label')
let writeInput = document.querySelector('#write-input')
let writeButtonsContainer = document.querySelector('#write-buttons-container')
let writeButtonAdd = document.querySelector('#write-button-add')
let writeButtonDismiss = document.querySelector('#write-button-dismiss')
let writeButtonEdit = document.querySelector('#write-button-edit')
let writeButtonCancelEdit = document.querySelector('#write-button-cancel')

let orbsList = document.querySelector('#orbs-list')
let orbPanel = document.querySelector('#orb-panel')
let orbInfo = document.querySelector('#orb-panel')
let orbInfoLabel = document.querySelector('#orb-panel-label')
let orbInfoCount = document.querySelector('#orb-panel-count')

//READ-SECTION
let readSection = document.querySelector('#section-read')
let readPanel = document.querySelector('#read-panel')
let readOptions = document.querySelector('#read-options')
let readOptionsContainer = document.querySelector('#read-options-container')
let readOptionsLabel = document.querySelector('#read-options-label')
let readOptionsSearchInput = document.querySelector('#read-options-search-input')
let readOptionsSearch = document.querySelector('#read-options-search')
let readOptionsSort = document.querySelector('#read-options-sort')
let readOptionsSortActionButton = document.querySelector('#read-options-sort-action')
let readOptionsOrientationButton = document.querySelector('#read-options-orientation')

let readNotesContainer = document.querySelector('#read-notes-container')

//noteous 1.9: Cria listas de prioridade para depois adicioná-las ao readNotesContainer caso haja notas
let readNotesListSolid = document.createElement('div')
readNotesListSolid.id = 'read-notes-list-solid'
readNotesListSolid.classList.add('read-notes-priority-container')
let readNotesListDouble = document.createElement('div')
readNotesListDouble.id = 'read-notes-list-double'
readNotesListDouble.classList.add('read-notes-priority-container')
let readNotesListDotted = document.createElement('div')
readNotesListDotted.id = 'read-notes-list-dotted'
readNotesListDotted.classList.add('read-notes-priority-container')

// noteous 1.9: Personalização de Listas de Prioridade 
// Objeto usado em renderNote para retornar a variável conforme a chamada ao construir a lista
const readNotesLists = {
  solid: readNotesListSolid,
  double: readNotesListDouble,
  dotted: readNotesListDotted
}

// noteous 1.7: Botões de Ação

//Variáveis para Botões de Ação
let doneActionButton
let shareActionButton
let copyActionButton
let deleteActionButton
let restoreActionButton

// Objeto usado em renderNote para retornar a variável conforme a chamada ao construir a lista
const readNotesActionButtons = {
  done: doneActionButton,
  share: shareActionButton,
  copy: copyActionButton,
  delete: deleteActionButton,
  restore: restoreActionButton
}

const readNotesActionButtonsIcons = {
  done: 'check_circle',
  share: 'shortcut',
  copy: 'content_copy'
}


// VARIÁVEIS IMPORTANTES /////////////////////////////////////

let currentVersion = noteousVersion
let noteIdEdit //usada para confirmar qual nota está sendo editada
let editMode = false
let tabIndexCounter = 10
let sortActionSelection = ''
let labelTimeoutId = null // Para controlar o timeout da label
let selectedOrb = 'donutdough'

//função em variável para 'desbloquear' writeInput se tela é pequena
//usado em openNote() e exitEditMode()
let writeInputEdit = function (event) {
  writeInput.removeAttribute('readonly')
  writeInput.focus()
}

// Função para mostrar temporariamente uma mensagem no read-options-label
function readOptionsMessage(message) {
  // Limpa qualquer timeout anterior
  if (labelTimeoutId) {
    clearTimeout(labelTimeoutId)
  }
  
  // Fade out
  readOptionsLabel.style.opacity = '0'
  
  setTimeout(() => {
    // Muda o texto
    readOptionsLabel.textContent = message
    
    // Fade in
    readOptionsLabel.style.opacity = '0.6'
    
    // Aguarda 1s e faz fade out + volta ao texto original
    labelTimeoutId = setTimeout(() => {
      readOptionsLabel.style.opacity = '0'
      
      setTimeout(() => {
        readOptionsLabel.textContent = 'Opções de organização'
        readOptionsLabel.style.opacity = '0.6'
        labelTimeoutId = null
      }, 200)
    }, 1500)
  }, 200)
}


////////

function navLink() {
  window.location.replace('./about.html')
}

////

function renderNoteousVersionLabel() {
  if (noteousVersion.toString().length == 3) {
    noteousVersionLabel.innerHTML = `<span>noteous</span> ${noteousVersion}`
  } else if (noteousVersion.toString().length == 4) {
    noteousVersionLabel.innerHTML = `<span>noteous</span> ${noteousVersion.toString().slice(0,3)}.${noteousVersion.toString().slice(3)}`
  }
}
renderNoteousVersionLabel()

//INICIALIZAÇÃO //////////////////////////////////////////////

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

serviceWorkerRegister()
loadNoteous('check-settings')

/////////////////////////////////////////////////////////////

//welcomeToNoteous --> ao acessar 1ª vez ou nova versão
function welcomeToNoteous(context, subcontext) {
  //1.0 -- 1.4.5
  //Primeiro aplica tema claro, armazenando informações no LocalStorage
  //Configurações da tela de boas vindas: criar elementos e simultaneamente adicionar informações. Primeiro acesso e nova versão separados, o que resulta em código duplicado

  //1.5
  // Nenhum tema é aplicado: usuário deve primeiro aceitar armazenamento
  // Configuração da tela de boas vindas: primeiro renderiza interface, depois adiciona informações se for primeiro acesso ou nova versão, o que economiza código

  //context --> renderizar 'elementos de boas vindas'/renderizar tela de policies
  //subcontext --> primeiro acesso ou nova versão
  if (context == 'render-welcome') {
    body.innerHTML = ''

    //Section, Panel, TitleContainer
    let greetingSection = document.createElement('div')
    greetingSection.classList.add('greeting-section')

    let greetingPanel = document.createElement('div')
    greetingPanel.classList.add('greeting-panel')

    let greetingTitleContainer = document.createElement('div')
    greetingTitleContainer.classList.add('greeting-title-container')

    //Titles
    let greetingTitle1 = document.createElement('p')
    greetingTitle1.classList.add('greeting-title1')

    let greetingTitleIcon = document.createElement('img')
    greetingTitleIcon.setAttribute('src', './assets/icons/any-icon-noteous-192.png')
    greetingTitleIcon.classList.add('greeting-title-icon')

    greetingTitle2 = document.createElement('p')
    greetingTitle2.classList.add('greeting-title2')
    greetingTitleContainer.append(greetingTitleIcon, greetingTitle2)

    //greetingDescriptions

    let greetingDescriptionTitle = document.createElement('p')
    greetingDescriptionTitle.classList.add('greeting-description-title')

    let greetingDescriptionContainerAll = document.createElement('section')
    let greetingDescriptionContainer1 = document.createElement('div')
    let greetingDescriptionContainer2 = document.createElement('div')
    let greetingDescriptionContainer3 = document.createElement('div')
    let greetingDescriptionContainer4 = document.createElement('div')

    greetingDescriptionContainerAll.classList.add(
      'greeting-description-container-all'
    )

    greetingDescriptionContainer1.classList.add(
      'greeting-description-container'
    )
    greetingDescriptionContainer2.classList.add(
      'greeting-description-container'
    )
    greetingDescriptionContainer3.classList.add(
      'greeting-description-container'
    )
    greetingDescriptionContainer4.classList.add(
      'greeting-description-container'
    )

    let greetingDescription1Image = document.createElement('img')
    let greetingDescription2Image = document.createElement('img')
    let greetingDescription3Image = document.createElement('img')
    let greetingDescription4Image = document.createElement('img')

    greetingDescription1Image.classList.add('greeting-description-image')
    greetingDescription2Image.classList.add('greeting-description-image')
    greetingDescription3Image.classList.add('greeting-description-image')
    greetingDescription4Image.classList.add('greeting-description-image')

    let greetingDescription1 = document.createElement('p')
    let greetingDescription2 = document.createElement('p')
    let greetingDescription3 = document.createElement('p')
    let greetingDescription4 = document.createElement('p')

    greetingDescription1.classList.add('greeting-description-point')
    greetingDescription2.classList.add('greeting-description-point')
    greetingDescription3.classList.add('greeting-description-point')
    greetingDescription4.classList.add('greeting-description-point')

    //Next Button
    btnNext = document.createElement('button')
    btnNext.classList.add('greeting-buttons')
    btnNext.appendChild(document.createTextNode('Continuar →'))
    btnNext.addEventListener('click', () => {
      if (noteousSettings == null || noteousSettings?.noteousApp?.acceptedTermsVersion != termsVersion) {
        welcomeToNoteous('render-policies')
      } else {
        loadNoteous('set-settings')
        window.location.reload()
      }
    })

    //Appends
    greetingPanel.append(
      greetingTitle1,
      greetingTitleContainer,
      greetingDescriptionTitle,
      greetingDescriptionContainerAll,
      btnNext
    )
    greetingSection.append(greetingPanel)
    body.append(greetingSection)

    ////////////////////////////////////////////////

    if (subcontext == 'first-access') {
      greetingTitle1.append(document.createTextNode('Boas-vindas ao'))
      greetingTitle2.append(document.createTextNode('noteous'))
      greetingDescriptionTitle.append(
        document.createTextNode(
          'Suas notas sempre à mão'
        )
      )

      greetingDescription1.innerHTML = `<span class="greeting-description-intro">Temas</span>🎨 Personalize sua experiência com o brilhante tema claro ou com o elegante tema escuro`

      greetingDescription2.innerHTML = `<span class="greeting-description-intro">Personalize as notas</span>Clique no círculo ⭕ para trocar entre diferentes bordas`

      greetingDescription3.innerHTML = `<span class="greeting-description-intro">Design incrível</span>noteous possui um design inovador que convida você a fazer anotações. <br><br>📅 Veja a data de hoje <br>📋 Escreva sua próxima tarefa<br>💡 Registre algo para não esquecer `

      greetingDescription4.innerHTML = `<span class="greeting-description-intro">Sempre em dia</span>noteous está em constante melhoria. Quando tiver uma 🌐 nova versão, chegará automaticamente para você ✅`

      greetingDescription1Image.setAttribute('src', './assets/images/greeting-theme.webp')
      greetingDescription2Image.setAttribute('src', './assets/images/greeting-priority-button.webp')
      greetingDescription3Image.setAttribute('src', './assets/images/greeting-usage.webp')
      greetingDescription4Image.setAttribute('src', './assets/images/greeting-update.webp')

      greetingDescriptionContainer1.append(
        greetingDescription1Image,
        greetingDescription1
      )
      greetingDescriptionContainer2.append(
        greetingDescription2Image,
        greetingDescription2
      )
      greetingDescriptionContainer3.append(
        greetingDescription3Image,
        greetingDescription3
      )
      greetingDescriptionContainer4.append(
        greetingDescription4Image,
        greetingDescription4
      )

      greetingDescriptionContainerAll.append(
        greetingDescriptionContainer1,
        greetingDescriptionContainer2,
        greetingDescriptionContainer3,
        greetingDescriptionContainer4
      )
    } else if (subcontext == 'new-version') {
      greetingTitle1.append(document.createTextNode('Boas-vindas ao'))
      greetingTitle2.append(document.createTextNode('noteous'))
      greetingDescriptionTitle.innerHTML = `✨Você recebeu a atualização de Fevereiro de 2026 do noteous`

      greetingDescription1.innerHTML = `<span class="greeting-description-intro">Atualização automática</span> <br>noteous recebe atualizações automáticas 🌐 Assim, seu aplicativo sempre está em dia.`

      greetingDescription2.innerHTML = `<span class="greeting-description-intro">Os próximos passos do noteous</span> <br> noteous 2ª Geração, disponível em breve, ainda no início do ano`
      
      greetingDescription1Image.setAttribute('src', './assets/images/greeting-update.webp')
      greetingDescription2Image.setAttribute('src', './assets/images/greeting-2ndgen.webp')

      greetingDescriptionContainer1.append(
        greetingDescription1Image,
        greetingDescription1
      )
      greetingDescriptionContainer2.append(
        greetingDescription2Image,
        greetingDescription2
      )

      greetingDescriptionContainerAll.append(
        greetingDescriptionContainer1,
        greetingDescriptionContainer2
      )
    }
  } else if (context == 'render-policies') {
    let greetingPanel = document.querySelector('.greeting-panel')
    greetingPanel.innerHTML = ''

    let greetingTitleContainer = document.createElement('div')
    greetingTitleContainer.classList.add('greeting-title-container')

    let greetingTitle1 = document.createElement('p')
    greetingTitle1.classList.add('greeting-title1')

    let greetingTitleIcon = document.createElement('img')
    greetingTitleIcon.setAttribute('src', './assets/icons/any-icon-noteous-192.png')
    greetingTitleIcon.classList.add('greeting-title-icon')

    greetingTitle2 = document.createElement('p')
    greetingTitle2.classList.add('greeting-title2')
    greetingTitleContainer.append(greetingTitleIcon, greetingTitle2)

    greetingTitle1.append(document.createTextNode('Boas-vindas ao'))
    greetingTitle2.append(document.createTextNode('noteous'))

    let greetingPoliciesTitle = document.createElement('p')
    greetingPoliciesTitle.classList.add('greeting-description-title')
    if (noteousSettings != null && noteousSettings?.noteousApp?.noteousVersion < 1.61) {
      greetingPoliciesTitle.innerHTML =
      'Para continuar, você precisa aceitar os termos a seguir'
    } else {
      greetingPoliciesTitle.innerHTML = 'Para continuar, você precisa aceitar os termos a seguir'
    }

    let greetingPoliciesContainer = document.createElement('div')
    greetingPoliciesContainer.classList.add('greeting-policies-container')

    let greetingPoliciesTermsUse = document.createElement('p')
    greetingPoliciesTermsUse.classList.add('greeting-policies-text')
    let greetingPoliciesPrivacyPolicy = document.createElement('p')
    greetingPoliciesPrivacyPolicy.classList.add('greeting-policies-text')

    greetingPanel.append(
      greetingTitle1,
      greetingTitleContainer,
      greetingPoliciesTitle,
      greetingPoliciesContainer
    )

    fetch('./policies.json')
      .then(policies => policies.json())
      .then(policies => {
        let noteousPolicies = policies

        let greetingPoliciesTitle2 = document.createElement('p')
        greetingPoliciesTitle2.classList.add('greeting-description-title')
        greetingPoliciesTitle2.append('Termos de Uso')

        for (char of noteousPolicies.termsUse) {
          greetingPoliciesTermsUse.append(char)
          if (char == '\n') {
            greetingPoliciesTermsUse.append(
              document.createElement('br'),
              document.createElement('br')
            )
          }
        }

        let greetingPoliciesTitle3 = document.createElement('p')
        greetingPoliciesTitle3.classList.add('greeting-description-title')
        greetingPoliciesTitle3.append('Política de Privacidade')

        for (char of noteousPolicies.privacyPolicy) {
          greetingPoliciesPrivacyPolicy.append(char)
          if (char == '\n') {
            greetingPoliciesPrivacyPolicy.append(
              document.createElement('br'),
              document.createElement('br')
            )
          }
        }

        let greetingPoliciesTitle4 = document.createElement('p')
        greetingPoliciesTitle4.classList.add('greeting-policies-warning')
        greetingPoliciesTitle4.innerHTML =
        '⚠️ Conforme explicado na Política de Privacidade, suas anotações são salvas localmente no dispositivo. Ou seja: se você limpar os dados, suas notas serão  apagadas. <strong>Para evitar perda de dados, use o recurso Cópias de Notas em Ajustes&Info</strong>'

        let greetingPoliciesTitle5 = document.createElement('p')
        greetingPoliciesTitle5.classList.add('greeting-policies-description')
        greetingPoliciesTitle5.innerHTML = 'Ao clicar no botão Aceito, você concorda com as condições dos Termos de Uso e Política de Privacidade. Se não aceitar estas condições, não poderá usar o aplicativo.'

        greetingPoliciesContainer.append(
                    greetingPoliciesTitle2,
          greetingPoliciesTermsUse,
          greetingPoliciesTitle3,
          greetingPoliciesPrivacyPolicy,
          greetingPoliciesTitle4,
          greetingPoliciesTitle5
        )
      })

    //Next Button
    btnAccept = document.createElement('button')
    btnAccept.classList.add('greeting-buttons')
    document.querySelector('.greeting-panel').append(btnAccept)
    btnAccept.appendChild(document.createTextNode('Aceito ✔'))
    btnAccept.addEventListener('click', () => {
      loadNoteous('set-settings')
      window.location.reload()
    })
  }
}

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

//////////

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

//loadNoteous --> ao carregar noteous, realiza verificações
function loadNoteous(context) {
  if (context == 'check-settings') {
    //JÁ ACESSOU NOTEOUS --> recupera dados
    if (noteousSettings != null) {
      //VERIFICA SE HÁ NOVA VERSÃO
      if (noteousSettings?.noteousApp?.noteousVersion != currentVersion) {
        //SE HÁ NOVA VERSÃO
        welcomeToNoteous('render-welcome', 'new-version')
      } else {
        //SE NÃO HÁ NOVA VERSÃO

        //noteous 1.9.1: Corrige problema em que a atualização não adiciona novas chaves (relacionada as novas Opções de Organização) ao LocalStorage. Solução: verificar se uma das novas chaves existe. se não existir, voltar a tela de atualização.
        if (noteousSettings.priorityOrientation == null && noteousSettings.noteousVersion >= 1.9) {
          welcomeToNoteous('render-welcome', 'new-version')
        }
        
        orblendEngine('load')
        sortNotes('set-sort', selectedOrb)
        priorityListsOrientation('retrieveOrientation')
        orblendEngine('on-change-input')

        noteousTheme('retrieve-theme')
        noteousSettings.priority = 'solid'
        localStorage.setItem(
          'noteous-settings',
          JSON.stringify(noteousSettings)
        )
        notePriority('retrievePriority', noteousSettings.priority)
      }
    } else if (noteousSettings == null) {
      //NÃO HÁ CONFIGURAÇÕES --> PRIMEIRO ACESSO AO NOTEOUS
      //1.5 --> não armazenar noteousSettings: aguardar usuário aceitar

      let domain = window.location.hostname
      if (domain == "noteous.vercel.app") {
        window.location.replace('https://noteous.app')
      } else if (domain == 'noteouspreview.vercel.app'){
        window.location.replace('https://preview.noteous.app')
      }

      welcomeToNoteous('render-welcome', 'first-access')
    }
  }

  if (context == 'set-settings') {
    //Registro de primeiro acesso
    let accessDate
    let promptTimes
    let doneSurvey
    let bonusCode
    if (noteousSettings == null) {
      accessDate = Date.now()
      promptTimes = 0
      doneSurvey = false
    } else {
      if (noteousSettings?.noteousApp?.firstAccess == null) {
        accessDate = Date.now()
        accessDate = accessDate - 907200000
        promptTimes = 0
        doneSurvey = false
      } else if (noteousSettings?.noteousApp?.firstAccess !== null) {
        accessDate = noteousSettings.noteousApp.firstAccess
        promptTimes = noteousSettings.noteousApp.surveyPrompt
        doneSurvey = noteousSettings.noteousApp.surveyStatus
        bonusCode = noteousSettings.noteousApp.surveyBonus
      }
    }
    
    //1.Limpar configurações (elimina propriedades de versões antigas, como :theme)
    noteousSettings = {}
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

    //2.Aplicar novas configurações
    noteousSettings = {
      noteousApp: { noteousVersion: currentVersion, installPrompt: 0, acceptedTermsVersion: termsVersion, firstAccess: accessDate, surveyStatus: doneSurvey, surveyPrompt: promptTimes, surveyBonus: bonusCode },
      orbsIndex: ['done', 'donutdough'],
      selectedOrb: 'donutdough',
      sort: { time: 'recent', action: 'editedAt' },
      priority: 'solid',
      priorityOrder: ['solid', 'double', 'dotted'],
      priorityOrientation: 'row',
      actionButtons: ['done', 'share', 'delete', 'restore'],
      input: '',
      noteId: 0,
      fileId: 0,
      look: { baseRem: '--base-rem: 100%;' }
    }
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

    //2.1. Aplicar configurações de tema
    noteousTheme('set-theme-light')
  }
}

////

let deferredInstallPrompt = null
let installNoteousButton = document.createElement('button')

function showInstallButton() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredInstallPrompt = e
    
    if (noteousSettings?.noteousApp?.installPrompt <= 6) {
      noteousSettings.noteousApp.installPrompt++
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      
      if ((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
    ) || (navigator.standalone === true) || !deferredInstallPrompt) {
      if (installNoteousButton) installNoteousButton.remove()
    } else {
      installNoteousButton.classList.add('write-buttons')
      installNoteousButton.style.cssText = 'margin-bottom: 2rem;'
      installNoteousButton.innerHTML = '<span style="font-style: normal;">🧁</span> Instalar noteous'
      infoPanel.appendChild(installNoteousButton)
      installNoteousButton.addEventListener('click', async () => {
      try {
        installNoteousButton.disabled = true
        deferredInstallPrompt.prompt()
        const { outcome } = await deferredInstallPrompt.userChoice
        deferredInstallPrompt = null
        if (outcome === 'accepted') {
          installNoteousButton.remove()
        } else {
          installNoteousButton.disabled = false
        }
      } catch (e) {
        installNoteousButton.disabled = false
      }
    })
    }
    }
  })
}

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null
  if (installNoteousButton) installNoteousButton.remove()
})

////

function notePriority(context, priority) {

  //context ==> (1) recuperarPrioridade, (2)recuperarPrioridadeAoDesfocarInput (ao tirar foco define opacidade = 0 de Opções da Nota. Mas, é necessário também definir junto a borda, pois ao contrário um sobrescreve o outro), (3) trocarPrioridade
  if (context == 'retrievePriority') {
    if (priority == 'solid') {
      writeOptions.disabled = false
      writeOptions.classList.remove('blur')
      writeOptions.style.cssText = 'border-style: solid;'
      writeInput.style.cssText = 'border-style: solid;'
      writeButtonsContainer.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
    } else if (priority == 'double') {
      writeOptions.disabled = false
      writeOptions.classList.remove('blur')
      writeOptions.style.cssText = 'border-style: double;'
      writeInput.style.cssText = 'border-style: double;'
      writeButtonsContainer.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
    } else if (priority == 'dotted') {
      writeOptions.disabled = false
      writeOptions.classList.remove('blur')
      writeOptions.style.cssText = 'border-style: dotted;'
      writeInput.style.cssText = 'border-style: dotted;'
      writeButtonsContainer.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
    }
  } else if (context == 'retrievePriorityBlurInput') {
    if (priority == 'solid') {
      writeOptions.classList.add('blur')
      writeOptions.style.cssText = 'border-style: solid;'
      setTimeout(() => {
        writeOptions.disabled = true
      }, 100)
    } else if (priority == 'double') {
      writeOptions.classList.add('blur')
      writeOptions.style.cssText = 'border-style: double;'
      setTimeout(() => {
        writeOptions.disabled = true
      }, 100)
    } else if (priority == 'dotted') {
      writeOptions.classList.add('blur')
      writeOptions.style.cssText = 'border-style: dotted;'
      setTimeout(() => {
        writeOptions.disabled = true
      }, 100)
    }
  } else if (context == 'changePriority') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: double;'
      writeInput.style.cssText = 'border-style: double;'
      writeButtonsContainer.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: dotted;'
      writeInput.style.cssText = 'border-style: dotted;'
      writeButtonsContainer.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: solid;'
      writeInput.style.cssText = 'border-style: solid;'
      writeButtonsContainer.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
}

writeInput.addEventListener('focus', () => {
  if (editMode == false) {
    writeButtonAdd.classList.add('focus-input')
    writeButtonsContainer.classList.add('focus-input')
    notePriority('retrievePriority', noteousSettings.priority)
  }
})

writeInput.addEventListener('blur', () => {
  if (editMode == false) {
    writeButtonAdd.classList.remove('focus-input')
    writeButtonsContainer.classList.remove('focus-input')

    
    //Ao clicar no botão para trocar Prioridade, write-input perde o foco --> botão de Prioridade desaparece.
    //Esse teste verifica primeiro se write-input perde o foco. Se está sem foco --> desaparecer botão Prioridade
    //1.5 --> Ao adicionar tabindex e focalizar botão de prioridade ele desaparece (pois o foco sai de write-input). Agora o teste inclui se write-options também está focalizado. Se está, ele não desaparece.
    setTimeout(() => {
      if (
        document.activeElement.id != 'write-input' &&
        document.activeElement.id != 'write-options'
      )
        notePriority('retrievePriorityBlurInput', noteousSettings.priority)
    }, 500)
  }
})

writeOptions.addEventListener('click', () => {
  writeInput.focus()
  notePriority('changePriority', noteousSettings.priority)
})

//////////

//noteous 1.8: Buscar
// noteous 1.9: Buscar integrado a Opções de Organização
function toggleReadOptionsSearch() {
  if (readOptionsSearchInput.classList.contains('hidden-element')) {
    // Fade out label
    if (readOptionsContainer.offsetWidth <= 570) {
      readOptionsLabel.style.opacity = '0'
    }
    readOptionsSearch.classList.add('active-button')

    setTimeout(() => {
      readOptionsSearchInput.classList.remove('hidden-element')
      if (readOptionsContainer.offsetWidth <= 570) {
        readOptionsLabel.classList.add('hidden-element')
      }
      // Inicia o search input com opacity 0 e depois fade in
      readOptionsSearchInput.style.opacity = '0'
      setTimeout(() => {
        readOptionsSearchInput.style.opacity = '1'
      }, 10)
    }, 200)
  } else {
    // Fade out search input
      readOptionsSearchInput.style.opacity = '0'
    readOptionsSearch.classList.remove('active-button')
    
    setTimeout(() => {
      readOptionsSearchInput.classList.add('hidden-element')
      if (readOptionsContainer.offsetWidth <= 570) {
        readOptionsLabel.classList.remove('hidden-element')
      }
      // Inicia o label com opacity 0 e depois fade in
      if (readOptionsContainer.offsetWidth <= 570) {
      readOptionsLabel.style.opacity = '0'
      setTimeout(() => {
        readOptionsLabel.style.opacity = '0.6'
      }, 10)
    }
    }, 200)
  }
}

readOptionsSearch.addEventListener('click', () => {
  toggleReadOptionsSearch()
})

readOptionsSearchInput.addEventListener('input', () => {
  renderNote('render-all', '', readOptionsSearchInput.value)
})

//////////

function priorityListsOrientation(context) {
  if (context == 'retrieveOrientation') {
    if (noteousSettings.priorityOrientation == 'row') {
      readOptionsOrientationButton.innerHTML = ''
      readOptionsOrientationButton.append(document.createTextNode('view_agenda'))
  readOptionsOrientationButton.style.transform = 'rotate(90deg)'
      readNotesContainer.style.cssText = 'flex-direction: row;'
      for (let priorityList of readNotesContainer.querySelectorAll('.read-notes-priority-container')) {
        priorityList.style.cssText = 'flex-direction: column;  min-width: fit-content;'
      }
    } else if (noteousSettings.priorityOrientation == 'column') {
      readOptionsOrientationButton.innerHTML = ''
      readOptionsOrientationButton.append(document.createTextNode('view_agenda'))
  readOptionsOrientationButton.style.transform = 'rotate(0deg)'
      readNotesContainer.style.cssText = 'flex-direction: column;'
      for (let priorityList of readNotesContainer.querySelectorAll('.read-notes-priority-container')) {
        priorityList.style.cssText = 'flex-direction: row;'
      }
    }
  } else if (context == 'change-orientation') {
    // Alterna entre 'row' e 'column'
    if (noteousSettings.priorityOrientation == 'row') {
      noteousSettings.priorityOrientation = 'column';
    } else {
      noteousSettings.priorityOrientation = 'row';
    }
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings));
    // Atualiza a interface após a troca
    priorityListsOrientation('retrieveOrientation');
    
    // Mostra a orientação atual no label
    const orientationText = noteousSettings.priorityOrientation == 'row' 
      ? 'Orientação: Horizontal' 
      : 'Orientação: Vertical'
    readOptionsMessage(orientationText)
  }
}

readOptionsOrientationButton.addEventListener('click', () => {
  priorityListsOrientation('change-orientation')
})

function readOptionsSortButtonText(context) {
  if (context == 'sort-action') {
    if (noteousSettings.sort.action == 'editedAt') {
      readOptionsSortActionButton.innerHTML = ''
      readOptionsSortActionButton.append(document.createTextNode('edit_note'))
    } else if (noteousSettings.sort.action == 'id') {
      readOptionsSortActionButton.innerHTML = ''
      readOptionsSortActionButton.append(document.createTextNode('post_add'))
    }
  } else if (context == 'sort-time') {
    if (noteousSettings.sort.time == 'recent') {
      readOptionsSort.innerHTML = ''
      readOptionsSort.append(document.createTextNode('arrow_downward'))
    } else if (noteousSettings.sort.time == 'old') {
      readOptionsSort.innerHTML = ''
      readOptionsSort.append(document.createTextNode('arrow_upward'))
    }
  }
}

function sortNotes(context, subcontext) {

  // previous noteous version: notes were ordened by flex-reverse. It was not real ordering.
  // noteous 1.9: updated sortNotes(). Now, it performs a real inversion, sorting the array of notes.
  // noteous 2.0: refactored sortNotes() to simplify code and improve efficiency. Sorting logic is now handled by the 'set-sort' context.

  if (context == 'set-sort') {
    const getSortValue = (note) => {
      if (noteousSettings.sort.action === 'editedAt') {
        return note.editedAt ?? note.id
      }
      return note.id
    }

    if (noteousSettings.sort.time == 'recent') {
      noteousMain.sort((a, b) => getSortValue(b) - getSortValue(a))
    } else if (noteousSettings.sort.time == 'old') {
      noteousMain.sort((a, b) => getSortValue(a) - getSortValue(b))
    }
    
    readOptionsSortButtonText('sort-time')
    readOptionsSortButtonText('sort-action')
    renderNote('render-all', '', `${subcontext}`)

  } else if (context == 'change-sort-action') {
      if (noteousSettings.sort.action == 'editedAt') {
        noteousSettings.sort.action = 'id' // Change to sort by creation date
        localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
        readOptionsMessage('Ordenar por: Criação')
        
      } else if (noteousSettings.sort.action == 'id') {
        noteousSettings.sort.action = 'editedAt' // Change to sort by edited date
        localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
        readOptionsMessage('Ordenar por: Edição')
      }
      sortNotes('set-sort', `${selectedOrb}`)

  } else if (context == 'change-sort-time') {
    if (noteousSettings.sort.time == 'recent') {
      noteousSettings.sort.time = 'old' // Change to old notes first
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('arrow_upward')
      )
      readOptionsMessage('Ordem: Mais antigas primeiro')
    } else if (noteousSettings.sort.time == 'old') {
      noteousSettings.sort.time = 'recent' // Change to recent notes first
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      readOptionsSort.innerHTML = ''
      readOptionsSort.append(document.createTextNode('arrow_downward'))
      readOptionsMessage('Ordem: Mais recentes primeiro')
    }
    sortNotes('set-sort', `${selectedOrb}`)
  }
}
readOptionsSort.addEventListener('click', () => {
  sortNotes('change-sort-time')
})
readOptionsSortActionButton.addEventListener('click', () => {
  sortNotes('change-sort-action')
})

//////////

function renderNote(context, noteId, orb, searchTerm) {

  //ESSE CONTEXTO É USADO AO CARREGAR A PÁGINA, RENDERIZANDO TODAS AS NOTAS

  if (context == 'render-all') {
    readNotesContainer.innerHTML = ''
    readNotesListSolid.innerHTML = ''
    readNotesListDouble.innerHTML = ''
    readNotesListDotted.innerHTML = ''

    // noteous 1.9: Listas de Prioridade. renderNote() primeiro verifica a ordem das listas e as adiciona. Depois, adiciona a nota em sua respectiva lista

    const priorities = noteousSettings.priorityOrder || ['solid', 'double', 'dotted']
    for (let priority of priorities) {
      if (!readNotesContainer.querySelector(`#read-notes-list-${priority}`)) { //Se não há lista com essa prioridade, cria
        readNotesLists[priority].classList.add('hidden-element')
        readNotesContainer.append(readNotesLists[priority])
      }

      for (let note of noteousMain) {
        //noteous 1.9: Verifica se a nota atual pertence à lista de prioridade que está sendo criada. A ordem das notas dentro da lista é definida por sortNotes(). Ou seja: noteousMain já vem ordenado pelo sortNotes()
        //Ao renderizar todas as notas, se houver termo de busca, filtra as notas que contêm o termo (sem diferenciar maiúsculas e minúsculas)
        //noteous preview 2.0: ao renderizar todas as notas, verifica qual orb está selecionada
        if (note.priority == priority && orblendEngine('check-selected-orb', '', note, orb) && (searchTerm == undefined || note.text.toLowerCase().includes(searchTerm.toLowerCase()))) {
          let noteContainer = document.createElement('div')
          noteContainer.id = note.id + '-note-container'
          noteContainer.classList.add('note-container')
          if (!noteContainer.classList.contains('row-orientation') && noteousSettings.priorityOrientation == 'row') {
            noteContainer.classList.add('row-orientation')
          } else if (!noteContainer.classList.contains('column-orientation') && noteousSettings.priorityOrientation == 'column') {
            noteContainer.classList.add('column-orientation')
          }
          if (readNotesLists[priority].classList.contains('hidden-element')) { //se Lista de Prioridade tem uma nota, então remove a classe hidden-element
            readNotesLists[priority].classList.remove('hidden-element')  
          } 
          readNotesLists[priority].append(noteContainer)
          
        //BORDER/PRIORITY
        if (note.priority == 'solid') {
          noteContainer.style.cssText = 'border-style: solid;'
        } else if (note.priority == 'double') {
          noteContainer.style.cssText = 'border-style: double;'
        } else if (note.priority == 'dotted') {
          noteContainer.style.cssText = 'border-style: dotted;'
        }

        //ACTION BUTTONS

        let actionButtonsContainer = document.createElement('div')
        actionButtonsContainer.id = note.id + '-action-buttons-container'
        actionButtonsContainer.classList.add('action-buttons-container')

        const actionButtonsToRender =
          selectedOrb === 'done'
            ? ['delete', 'restore']
            : noteousSettings.actionButtons.filter(
                (b) => b !== 'delete' && b !== 'restore'
              )

        for (let actionButton of actionButtonsToRender) {

            readNotesActionButtons[actionButton] = document.createElement('button')
            readNotesActionButtons[actionButton].classList.add('action-buttons', 'material-icons')
            readNotesActionButtons[actionButton].setAttribute('onclick', `${actionButton}Note(${note.id})`)
            readNotesActionButtons[actionButton].appendChild(document.createTextNode(readNotesActionButtonsIcons[actionButton]))

            //ACESSIBILIDADE
            readNotesActionButtons[actionButton].tabIndex = tabIndexCounter += 1
            if (actionButton == 'done') {
              readNotesActionButtons[actionButton].setAttribute('aria-label', 'Concluir nota')
              readNotesActionButtons[actionButton].setAttribute(
                'onkeyup',
                `if (event.key === 'Enter') { doneNote(${note.id}); }`
              )
            } else if (actionButton == 'share') {
              readNotesActionButtons[actionButton].setAttribute('aria-label', 'Compartilhar nota')
              readNotesActionButtons[actionButton].setAttribute(
                'onkeyup',
                `if (event.key === 'Enter') { shareNote(${note.id}); }`
              )
            }
            else if (actionButton == 'copy') {
              readNotesActionButtons[actionButton].classList.add('action-button-copy')
              readNotesActionButtons[actionButton].setAttribute('aria-label', 'Copiar nota')
              readNotesActionButtons[actionButton].setAttribute(
                'onkeyup',
                `if (event.key === 'Enter') { copyNote(${note.id}); }`
              )
            }
            else if (actionButton == 'delete') {
              readNotesActionButtons[actionButton].setAttribute('aria-label', 'Apagar nota')
              readNotesActionButtons[actionButton].setAttribute(
                'onkeyup',
                `if (event.key === 'Enter') { deleteNote(${note.id}); }`
              )
            }
            else if (actionButton == 'restore') {
              readNotesActionButtons[actionButton].setAttribute('aria-label', 'Restaurar nota')
              readNotesActionButtons[actionButton].setAttribute(
                'onkeyup',
                `if (event.key === 'Enter') { restoreNote(${note.id}); }`
              )
            }

            actionButtonsContainer.appendChild(readNotesActionButtons[actionButton])
        }

        //NOTE TEXT
        let noteTextContainer = document.createElement('textarea')
        noteTextContainer.id = note.id + '-text-container'
        noteTextContainer.classList.add('note-text-container')
        noteTextContainer.setAttribute('readonly', true)
        noteTextContainer.setAttribute('onclick', `handleNote(${note.id})`)
        noteTextContainer.value = `\n \n ${note.text}`

        //DATE
        let noteDateContainer = document.createElement('div')
        noteDateContainer.id = note.id + '-note-date-container'
        noteDateContainer.classList.add('note-date-container')

        let dateElement = document.createElement('p')
        dateElement.id = note.id + '-date-element'
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

        //ACESSIBILIDADE
        noteTextContainer.tabIndex = tabIndexCounter += 1
        noteTextContainer.setAttribute('aria-label', 'Anotação:' + note.text)
        noteTextContainer.setAttribute(
          'onkeyup',
          `if (event.key === 'Enter') { handleNote(${note.id}); }`
        )

        

        //APPENDS
        noteDateContainer.appendChild(dateElement)
        noteTextContainer.appendChild(noteDateContainer)

        noteContainer.appendChild(actionButtonsContainer)
        noteContainer.appendChild(noteTextContainer)
        }
      }
  }

    setTimeout(() => {
      //css inicia em 0. Após renderizar, altera para 1
      readPanel.style.cssText = 'opacity: 1; transform: translateY(-10px);'
    }, 300)
  }
  
  // ESSE CONTEXTO É USADO AO ADICIONAR NOTA, PARA RENDERIZÁ-LA
  
  else if (context == 'add') {
    for (let priority of noteousSettings.priorityOrder) {
      for (let note of noteousMain) {
    if (note.id == noteId) {
      if (note.priority == priority) {
        let noteContainer = document.createElement('div')
        noteContainer.id = note.id + '-note-container'
        noteContainer.classList.add('note-container')
        if (!noteContainer.classList.contains('row-orientation') && noteousSettings.priorityOrientation == 'row') {
          noteContainer.classList.add('row-orientation')
        } else if (!noteContainer.classList.contains('column-orientation') && noteousSettings.priorityOrientation == 'column') {
          noteContainer.classList.add('column-orientation')
        }
        if (readNotesLists[priority].classList.contains('hidden-element')) { //se Lista de Prioridade tem uma nota, então remove a classe hidden-element
          readNotesLists[priority].classList.remove('hidden-element')  
        } 
        readNotesLists[priority].prepend(noteContainer)
        
      //BORDER/PRIORITY
      if (note.priority == 'solid') {
        noteContainer.style.cssText = 'border-style: solid;'
      } else if (note.priority == 'double') {
        noteContainer.style.cssText = 'border-style: double;'
      } else if (note.priority == 'dotted') {
        noteContainer.style.cssText = 'border-style: dotted;'
      }

      //ACTION BUTTONS

      let actionButtonsContainer = document.createElement('div')
      actionButtonsContainer.id = note.id + '-action-buttons-container'
      actionButtonsContainer.classList.add('action-buttons-container')

      const actionButtonsToRender =
        selectedOrb === 'done'
          ? ['delete', 'restore']
          : noteousSettings.actionButtons.filter(
              (b) => b !== 'delete' && b !== 'restore'
            )

      for (let actionButton of actionButtonsToRender) {
        readNotesActionButtons[actionButton] = document.createElement('button')
        readNotesActionButtons[actionButton].classList.add('action-buttons', 'material-icons')
        readNotesActionButtons[actionButton].setAttribute('onclick', `${actionButton}Note(${note.id})`)
        readNotesActionButtons[actionButton].appendChild(document.createTextNode(readNotesActionButtonsIcons[actionButton]))

        //ACESSIBILIDADE
        readNotesActionButtons[actionButton].tabIndex = tabIndexCounter += 1
        if (actionButton == 'done') {
          readNotesActionButtons[actionButton].setAttribute('aria-label', 'Concluir nota')
          readNotesActionButtons[actionButton].setAttribute(
            'onkeyup',
            `if (event.key === 'Enter') { doneNote(${note.id}); }`
          )
        } else if (actionButton == 'share') {
          readNotesActionButtons[actionButton].setAttribute('aria-label', 'Compartilhar nota')
          readNotesActionButtons[actionButton].setAttribute(
            'onkeyup',
            `if (event.key === 'Enter') { shareNote(${note.id}); }`
          )
        }
        else if (actionButton == 'copy') {
          readNotesActionButtons[actionButton].classList.add('action-button-copy')
          readNotesActionButtons[actionButton].setAttribute('aria-label', 'Copiar nota')
          readNotesActionButtons[actionButton].setAttribute(
            'onkeyup',
            `if (event.key === 'Enter') { copyNote(${note.id}); }`
          )
        }
        else if (actionButton == 'delete') {
          readNotesActionButtons[actionButton].setAttribute('aria-label', 'Apagar nota')
          readNotesActionButtons[actionButton].setAttribute(
            'onkeyup',
            `if (event.key === 'Enter') { deleteNote(${note.id}); }`
          )
        }
        else if (actionButton == 'restore') {
          readNotesActionButtons[actionButton].setAttribute('aria-label', 'Restaurar nota')
          readNotesActionButtons[actionButton].setAttribute(
            'onkeyup',
            `if (event.key === 'Enter') { restoreNote(${note.id}); }`
          )
        }

        actionButtonsContainer.appendChild(readNotesActionButtons[actionButton])
      }
      

      //NOTE TEXT
      let noteTextContainer = document.createElement('textarea')
      noteTextContainer.id = note.id + '-text-container'
      noteTextContainer.classList.add('note-text-container')
      noteTextContainer.setAttribute('readonly', true)
      noteTextContainer.setAttribute('onclick', `handleNote(${note.id})`)
      noteTextContainer.value = `\n \n ${note.text}`

      //DATE
      let noteDateContainer = document.createElement('div')
      noteDateContainer.id = note.id + '-note-date-container'
      noteDateContainer.classList.add('note-date-container')

      let dateElement = document.createElement('p')
      dateElement.id = note.id + '-date-element'
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

      //ACESSIBILIDADE

      noteTextContainer.tabIndex = tabIndexCounter += 1
      noteTextContainer.setAttribute('aria-label', 'Anotação:' + note.text)
      noteTextContainer.setAttribute(
        'onkeyup',
        `if (event.key === 'Enter') { handleNote(${note.id}); }`
      )

      

      //APPENDS
      noteDateContainer.appendChild(dateElement)
      noteTextContainer.appendChild(noteDateContainer)

      noteContainer.appendChild(actionButtonsContainer)
      noteContainer.appendChild(noteTextContainer)
      }
    }
  }
  }
  }
}

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

function findWeek(number) {
  if (number == 0) {
    return 'Domingo'
  } else if (number == 1) {
    return 'Segunda-feira'
  } else if (number == 2) {
    return 'Terça-feira'
  } else if (number == 3) {
    return 'Quarta-feira'
  } else if (number == 4) {
    return 'Quinta-feira'
  } else if (number == 5) {
    return 'Sexta-feira'
  } else if (number == 6) {
    return 'Sábado'
  }
}

//função para retornar número com 00 --> Exmpl: 09:05 (pois Date.getMinutes, .getHours retorna hora/minuto apenas com '0' --> Exmpl: 9:5, mas é preciso ser com '00'
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

//////////

function addNote() {
  if (writeInput.value || '') {
    let objNote = {
      id: Date.now(),
      text: writeInput.value,
      priority: noteousSettings.priority
    }

    noteousMain.unshift(objNote)

    localStorage.setItem('noteous-main', JSON.stringify(noteousMain))

    renderNote('add', objNote.id)
    writeInput.value = ''
    if (window.screen.width > 450) {
      writeInput.focus()
    }
    orblendEngine('on-change-input')
  }
}

writeButtonAdd.addEventListener('click', addNote)

writeInput.addEventListener('input', () => {
  orblendEngine('on-change-input')
})

// noteous 1.9.2: nova experiência ao sair sem salvar uma nota
writeButtonDismiss.addEventListener('click', () => {
  writeInput.value = ''
  noteousSettings.input = ''
  orblendEngine('on-change-input')
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  writeButtonDismiss.classList.add('hidden-element')
  writeInput.focus()
})

//////////

//CONCLUIR NOTA
let timeoutID
function doneNote(noteId) {
  timeoutID = setTimeout(() => {
    let noteContainer = document.getElementById(noteId + '-note-container')
    noteContainer.style.cssText = 'opacity: 0;  transform: scale(80%);'
    orblendEngine('orb-animation', '', '', 'done')
    setTimeout(() => {
      noteContainer.remove()
      for (let note of noteousMain) {
        if (note.id === noteId) {
          note.done = true
        }
      }

      localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
      orblendEngine('change')
    }, 100)
  }, 5000)

  let noteTextContainer = document.getElementById(noteId + '-text-container')
  let textElement = document.getElementById(noteId + '-text')
  let actionButtonsContainer = document.getElementById(
    noteId + '-action-buttons-container'
  )
  let noteDateContainer = document.getElementById(
    noteId + '-note-date-container'
  )

  noteTextContainer.removeAttribute('onclick')
  noteTextContainer.removeAttribute('onkeyup')
  noteTextContainer.addEventListener('click', () => {
    clearTimeout(timeoutID)
    renderNote('render-all')
  })
  noteTextContainer.focus()
  noteTextContainer.setAttribute(
    'onkeydown',
    `clearTimeout(timeoutID)
    renderNote('render-all')`
  )
  textElement.innerHTML = '✔ Concluído <br> <strong>DESFAZER<strong>'

  textElement.setAttribute(
    'aria-label',
    `Nota concluída. Enter ou clique para desfazer`
  )

  noteTextContainer.ariaLive = 'assertive'

  actionButtonsContainer.style.cssText = 'opacity: 0;'
  noteDateContainer.style.cssText = 'opacity: 0;'
}


function deleteNote(noteId) {
  noteousMain = noteousMain.filter(note => note.id !== noteId)
  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  location.reload()
}

function restoreNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      note.done = false
      break
    }
  }
  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  location.reload()
}

//////////
//SHARE NOTE
function shareNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      if (navigator.share) {
        navigator
          .share({
            title: 'Anotação do noteous',
            text: note.text
          })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error))
      } else {
        // fallback
        alert('Seu navegador não suporta o recurso de compartilhamento.')
      }
    }
  }
}

//COPY NOTE
function copyNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      navigator.clipboard.writeText(note.text)
        .then(() => {
          // Exibe feedback visual por 2s e depois restaura o texto
          const textElement = document.getElementById(noteId + '-text')
          const noteTextContainer = document.getElementById(noteId + '-text-container')
          if (!textElement || !noteTextContainer) return

          const originalNoteText = textElement.innerHTML

          textElement.innerHTML = '<strong>✓ Texto da nota copiado</strong>'
          textElement.setAttribute('aria-label', 'Texto da nota copiado')
          noteTextContainer.ariaLive = 'assertive'

          setTimeout(() => {
            textElement.innerHTML = originalNoteText
            // Não altera atributos originais do container; apenas remove o feedback ARIA
            noteTextContainer.ariaLive = undefined
          }, 1500)
        })
        .catch((error) => console.log('Erro ao copiar nota', error))
    }
  }
}


//////////

//HANDLE NOTE

function handleNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      const actionButtonsContainer = document.getElementById(noteId + '-action-buttons-container')
      actionButtonsContainer.innerHTML = ''
      const acceptEditButton = document.createElement('button')
      acceptEditButton.classList.add('action-buttons', 'material-icons')
      acceptEditButton.appendChild(document.createTextNode('check'))
      
      actionButtonsContainer.appendChild(acceptEditButton)

      const discardEditButton = document.createElement('button')
      discardEditButton.classList.add('action-buttons', 'material-icons')
      discardEditButton.appendChild(document.createTextNode('close'))
      discardEditButton.setAttribute('onclick', 'location.reload()')
      actionButtonsContainer.appendChild(discardEditButton)


      const noteTextContainer = document.getElementById(noteId + '-text-container')
      let editedNoteText = note.text
      noteTextContainer.removeAttribute('readonly')
      noteTextContainer.addEventListener('input', () => {
        editedNoteText = noteTextContainer.value.startsWith('\n \n') ? noteTextContainer.value.slice(2) : noteTextContainer.value
        console.log(editedNoteText)
      })


      acceptEditButton.addEventListener('click', () => {
        if (noteTextContainer.value != '' && noteTextContainer.value != null) {
          note.text = editedNoteText
          note.editedAt = Date.now()
          note.priority = noteousSettings.priority
          localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
        }
        location.reload()
      })
    }
  }
}

//////////

//OPEN NOTE
function openNote(noteId) {
  editMode = true
  for (let note of noteousMain) {
    if (note.id === noteId) {
      notePriority('retrievePriority', note.priority)
      notePriority('retrievePriorityBlurInput', note.priority)
      noteousSettings.priority = note.priority
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
  if (window.screen.width <= 600) {
    //Se for dispositivo móvel, ao abrir uma nota o teclado não irá aparecer imediatamente (readonly), mas ao tocar no campo de input o teclado aparecerá (readonly remove)
    writeInput.setAttribute('readonly', true)
    writeInput.focus()
    writeButtonCancelEdit.removeAttribute('hidden')
    editNote(noteId)
    orblendEngine('', 'open-note')

    //Acessibilidade e Experiência do usuário: Quando o tamanho de tela é inferior a 600px, ao clicar em uma nota, a função openNote() torna readonly a caixa de texto (writeInput) para que o teclado não apareça e confunda a experiência. Ao dar um toque, a caixa é liberada para edição. PROBLEMA: Quando o recurso TalkBack (do Android) é utilizado, não é possível reconhecer o toque na caixa de texto (writeInput). Talvez isso ocorra porque a acessibilidade do Android desative o "clique" em uma caixa de texto readonly.
    //SOLUÇÃO: capturar posição do writeInput e da posição do mouse e verificar se o clique está dentro dessa área. Se estiver, desbloquear o input para edição.

    window.addEventListener('click', function(event) {
      if (editMode == true) {
        let clickX = event.clientX;
        let clickY = event.clientY;

        let writeInputPosition = writeInput.getBoundingClientRect()
  
        if (clickX > writeInputPosition.left && clickX < writeInputPosition.right
          && clickY > writeInputPosition.top && clickY < writeInputPosition.bottom
        ) {
          writeInputEdit()
          orblendEngine('', 'edit-note')
        }
      }
    })
   
  } else if (window.screen.width >= 601) {
    writeInput.focus()
    writeButtonCancelEdit.removeAttribute('hidden')
    editNote(noteId)
  }
}

//////////

function toggleEditButtons(noteText) {
  //Controla a exibição dos botões de edição (confirmar e cancelar) conforme o texto do input
  if (editMode == true) {
    if (writeInput.value == noteText) {
      writeButtonEdit.setAttribute('hidden', 'true')
      writeButtonCancelEdit.removeAttribute('hidden')
      notePriority('retrievePriorityBlurInput', noteousSettings.priority)
    } else if (writeInput.value != noteText) {
      writeButtonEdit.removeAttribute('hidden')
      writeButtonCancelEdit.removeAttribute('hidden')
      notePriority('retrievePriority', noteousSettings.priority)
    }
  }
}

function editNote(noteId) {
  for (let note of noteousMain) {
    noteIdEdit = noteId
    if (note.id === noteId) {
      editMode = true
      writeOptions.classList.add('edit-mode')
      writeInput.classList.add('edit-mode')
      readSection.classList.add('edit-mode')
      writePanel.classList.add('edit-mode')

      infoPanel.innerHTML = ''

      writeButtonAdd.setAttribute('hidden', 'true')

      writeInput.value = note.text
      
      writeInput.addEventListener('input', () => {
        toggleEditButtons(note.text)
      })

      orblendEngine('', 'edit-note')
      
      //orblendEngine: Backup Inteligente de Nota: Edição: Configuração dos botões de edição 
      if (noteousSettings.noteId != 0) {
        orblendEngine('', 'continue-editing')
        toggleEditButtons(noteousSettings.input)
      }

      //Se durante Modo de edição clicar em "Confirmar edição"
      writeButtonEdit.addEventListener('click', () => {
        if (writeInput.value != '' && writeInput.value != null) {
          for (let note of noteousMain) {
            if (note.id === noteIdEdit) {
              note.text = writeInput.value
              note.editedAt = Date.now()
              note.priority = noteousSettings.priority
              localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
            }
          }

          sortNotes('set-sort', `${selectedOrb}`)

          exitEditMode()
        }
      })

      //Se durante Modo de edição clicar em "Cancelar"
      writeButtonCancelEdit.addEventListener('click', exitEditMode)
    }
  }
}

function exitEditMode() {
  //Remove informações do Backup Inteligente de Nota
  writeInput.value = ''
  noteIdEdit = 0
  orblendEngine('on-change-input')

  editMode = false

  writeOptions.classList.remove('edit-mode')
  writePanel.classList.remove('edit-mode')
  readSection.classList.remove('edit-mode')

  writeInput.classList.remove('edit-mode')
  writeInput.value = ''
  writeInput.removeAttribute('readonly')
  writeInput.removeEventListener('click', writeInputEdit, false)

  //se tela é mobile, write-input não recebe foco após sair do modo de edição. Motivo: ao estar no celular e sair do modo de edição, o teclado aparece por cima e oculta as notas, isso dificulta a usabilidade.
  //Se tela é acima de mobile, write-input recebe foco após sair do modo de edição
  if (window.screen.width <= 600) {
    writeOptions.style.cssText =
      'border-style: solid; opacity: 0; transition: none;'
    writeInput.style.cssText = 'border-style: solid;'
  } else {
    writeInput.focus()
    writeOptions.style.cssText = 'border-style: solid;'
    writeInput.style.cssText = 'border-style: solid;'
  }

  noteousSettings.priority = 'solid'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

  orblendEngine('change')

  writeButtonAdd.removeAttribute('hidden')
  writeButtonAdd.disabled = true
  writeButtonEdit.setAttribute('hidden', 'true')
  writeButtonCancelEdit.setAttribute('hidden', 'true')
}
