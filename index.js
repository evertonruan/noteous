function serviceWorkerRegister() {
    if (noteousSettings?.noteousApp?.noteousVersion >= 1.5) {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
      }
    }
}


// PWA INSTALL /////////////////////////////////
// Holds the deferred prompt event provided by the browser
let deferredInstallPrompt = null

// Utility: check if app already installed (standalone or iOS PWA)
function isAppInstalled() {
  return (
    window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
  ) || (navigator.standalone === true)
}

// Create or ensure the Install button exists inside #info-panel
function placeInstallButton() {
  const panel = document.querySelector('#info-panel')
  if (!panel) return
  // Only show when we have a deferred prompt and the app is not installed
  if (!deferredInstallPrompt || isAppInstalled()) {
    const maybeBtn = panel.querySelector('#install-button') || document.querySelector('#install-button')
    if (maybeBtn) maybeBtn.remove()
    return
  }

  // If infoPanel was re-rendered, we need to re-append the button
  const existing = document.querySelector('#install-button')
  if (existing) {
    // Ensure it's visible and inside the current infoPanel
    if (existing.parentElement !== panel) {
      existing.remove()
      panel.appendChild(existing)
    }
    existing.style.display = 'inline-block'
    return
  }

  const installBtn = document.createElement('button')
  installBtn.id = 'install-button'
  // Reuse existing visual style for greeting buttons
  installBtn.classList.add('write-buttons')
  installBtn.innerHTML = '<span style="font-style: normal;">🧁</span> Instalar noteous'
  installBtn.addEventListener('click', async () => {
    try {
      installBtn.disabled = true
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
        installBtn.disabled = false
      }
    } catch (e) {
      // On any error, allow retry later
      installBtn.disabled = false
    }
  })

  panel.appendChild(installBtn)
}

// Listen for the install prompt and show the button
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  deferredInstallPrompt = e
  
  if (noteousSettings?.noteousApp?.installPrompt <= 3) {
    noteousSettings.noteousApp.installPrompt++
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    placeInstallButton()
  }
})

// When app is installed, remove the button
window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null
  const btn = document.querySelector('#install-button')
  if (btn) btn.remove()
})

// ELEMENTOS /////////////////////////////////////
let body = document.querySelector('body')

let themeButton = document.querySelector('#theme-container')
let noteousVersionLabel = document.querySelector('#noteous-version-label')

//WRITE-SECTION
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')

let infoPanel = document.querySelector('#info-panel')

let writeOptions = document.querySelector('#write-options')

let writeLabel = document.querySelector('#write-label')
let writeInput = document.querySelector('#write-input')
let writeButtonAdd = document.querySelector('#write-button-add')
let writeButtonDismiss = document.querySelector('#write-button-dismiss')
let writeButtonEdit = document.querySelector('#write-button-edit')
let writeButtonCancelEdit = document.querySelector('#write-button-cancel')

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

//noteous preview 1.7.1: Cria listas de prioridade para depois adicioná-las ao readNotesContainer caso haja notas
let readNotesListSolid = document.createElement('div')
readNotesListSolid.id = 'read-notes-list-solid'
readNotesListSolid.classList.add('read-notes-priority-container')
let readNotesListDouble = document.createElement('div')
readNotesListDouble.id = 'read-notes-list-double'
readNotesListDouble.classList.add('read-notes-priority-container')
let readNotesListDotted = document.createElement('div')
readNotesListDotted.id = 'read-notes-list-dotted'
readNotesListDotted.classList.add('read-notes-priority-container')

// noteous preview 1.8: Personalização de Listas de Prioridade 
// Objeto usado em renderNote para retornar a variável conforme a chamada ao construir a lista
const readNotesLists = {
  solid: readNotesListSolid,
  double: readNotesListDouble,
  dotted: readNotesListDotted
}

// noteous preview 1.8: Personalização de Botões de Ação

let doneActionButton
let shareActionButton
let copyActionButton

// Objeto usado em renderNote para retornar a variável conforme a chamada ao construir a lista
const readNotesActionButtons = {
  done: doneActionButton,
  share: shareActionButton,
  copy: copyActionButton
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
    noteousVersionLabel.innerHTML = `<span>noteous preview</span> ${noteousVersion}`
  } else if (noteousVersion.toString().length == 4) {
    noteousVersionLabel.innerHTML = `<span>noteous preview</span> ${noteousVersion.toString().slice(0,3)}.${noteousVersion.toString().slice(3)}`
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
    greetingTitleIcon.setAttribute('src', './assets/icons/maskable-icon-preview-192.png')
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
      greetingTitle2.append(document.createTextNode('noteous preview'))
      greetingDescriptionTitle.append(
        document.createTextNode(
          'Suas notas sempre à mão'
        )
      )

      greetingDescription1.innerHTML = `<span class="greeting-description-intro">Teste os novos recursos</span>Acessando o noteous preview você pode testar agora novos recursos que chegarão no futuro ao noteous ✨`

      greetingDescription2.innerHTML = `<span class="greeting-description-intro">Cópias de notas</span>Esse novo recurso abre novas possibilidades para o noteous! Agora, você pode Criar e Baixar uma cópia das suas notas para Abrir em outro celular ou computador que você usa o noteous preview`

      greetingDescription3.innerHTML = `<span class="greeting-description-intro">Listas de Prioridade</span> <br>Sua organização subiu de nível. Cada prioridade que você salvar sua nota será exibida em uma lista separada para que você possa ver o que é mais importante mais rápido`

      greetingDescription4.innerHTML = `<span class="greeting-description-intro">Sempre em dia</span>noteous preview está em constante melhoria. Quando tiver uma 🌐 nova versão, chegará automaticamente para você ✅`

      greetingDescription2Image.setAttribute('src', './assets/images/greeting-copy.webp')
      greetingDescription3Image.setAttribute('src', './assets/images/greeting-priority-button.webp')
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
      greetingTitle2.append(document.createTextNode('noteous preview'))
      greetingDescriptionTitle.append(
        document.createTextNode(
          '✨ Atualização concluída! Veja os destaques do noteous preview 1.9. Você recebeu uma atualização com algumas melhorias adicionais.'
        )
      )

      greetingDescription1.innerHTML = `<span class="greeting-description-intro">Buscar notas</span> <br>Agora ficou muito fácil encontrar as notas que você procura!`

      greetingDescription2.innerHTML = `<span class="greeting-description-intro">Backup Inteligente de Nota</span>Saiu e esqueceu de adicionar? Sem problema: noteous usa o Orblend Engine para recuperar de forma automática sua nota`

      greetingDescription3.innerHTML = `<span class="greeting-description-intro">Opções de Organização</span> <br>Com um visual renovado, as Opções de Visualização agora se chamam Opções de Organização!`

      greetingDescription4.innerHTML = `<span class="greeting-description-intro">Atualização automática</span> <br>noteous recebe atualizações automáticas 🌐 Assim, seu aplicativo sempre está em dia.`
      
      greetingDescription1Image.setAttribute('src', './assets/images/greeting-search.webp')
      greetingDescription2Image.setAttribute('src', './assets/images/greeting-usage.webp')
      greetingDescription3Image.setAttribute('src', './assets/images/greeting-read-options.webp')
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
    }
  } else if (context == 'render-policies') {
    let greetingPanel = document.querySelector('.greeting-panel')
    greetingPanel.innerHTML = ''

    let greetingTitleContainer = document.createElement('div')
    greetingTitleContainer.classList.add('greeting-title-container')

    let greetingTitle1 = document.createElement('p')
    greetingTitle1.classList.add('greeting-title1')

    let greetingTitleIcon = document.createElement('img')
    greetingTitleIcon.setAttribute('src', './assets/icons/maskable-icon-preview-192.png')
    greetingTitleIcon.classList.add('greeting-title-icon')

    greetingTitle2 = document.createElement('p')
    greetingTitle2.classList.add('greeting-title2')
    greetingTitleContainer.append(greetingTitleIcon, greetingTitle2)

    greetingTitle1.append(document.createTextNode('Boas-vindas ao'))
    greetingTitle2.append(document.createTextNode('noteous preview'))

    let greetingPoliciesTitle = document.createElement('p')
    greetingPoliciesTitle.classList.add('greeting-description-title')
    if (noteousSettings != null && noteousSettings.noteousApp.noteousVersion < 1.61) {
      greetingPoliciesTitle.innerHTML =
      'Para continuar, você precisa aceitar os termos a seguir'
    } else {
      greetingPoliciesTitle.innerHTML = 'Para continuar, você precisa aceitar os termos a seguir'
    }

    let greetingPoliciesContainer = document.createElement('div')
    greetingPoliciesContainer.classList.add('greeting-policies-container')

    let greetingPoliciesNotice = document.createElement('p')
    greetingPoliciesNotice.classList.add('greeting-policies-text')
    greetingPoliciesNotice.innerHTML = `<em> ⚠️ Importante: Você está acessando o noteous preview, que é um canal de testes do noteous. Ao continuar, você está ciente que este aplicativo pode apresentar erros e instabilidades.</em> <br>`
    
    let greetingPoliciesNoticeLink = document.createElement('p')
    greetingPoliciesNoticeLink.classList.add('greeting-policies-text-link')
    greetingPoliciesNoticeLink.innerHTML = `<strong>Se preferir, acesse a versão estável do noteous ↗ <strong> <br> <br>`
    greetingPoliciesNoticeLink.addEventListener('click', () => {
      window.location.replace('https://noteous.app')
    })

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
          greetingPoliciesNotice,
          greetingPoliciesNoticeLink,
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
    noteousSettings.look.hue = '--hue: 30;'
    noteousSettings.look.saturation = '--saturation: 90%;'
    noteousSettings.look.lumBack = '--lum-back: 90%;'
    noteousSettings.look.lumMid = '--lum-mid: 60%;'
    noteousSettings.look.lumFront = '--lum-front: 10%;'
    noteousSettings.look.lumFrontInverse = '--lum-front-inverse: 95%;'
    noteousSettings.look.accentSaturation = '--accent-saturation: 90%;'
    noteousSettings.look.accentLum = '--accent-lum: 60%;'
    noteousSettings.look.lumAccentContainer = '--lum-accent-container: 65%;'

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
    noteousSettings.look.accentSaturation = '--accent-saturation: 95%;'
    noteousSettings.look.accentLum = '--accent-lum: 60%;'
    noteousSettings.look.lumAccentContainer = '--lum-accent-container: 32%;'

    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
    injectCSSOnRoot()
  }
}

themeButton.addEventListener('click', () => {
  noteousTheme('change-theme')
})

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

        
        //Aplica última ordenação
        sortNotes('retrieveSort') // preview 1.8 --> Correção: como sortNotes() agora ordena de verdade (pelo JS, não mais pelo CSS), é necessário chamar antes de renderNote()
        
        renderNote('render-all')

        //Aplica última orientação de listas de prioridade
        priorityListsOrientation('retrieveOrientation')

        orblendEngine('load')
        orblendEngine('on-change-input')

        
        //Aplica último tema
        noteousTheme('retrieve-theme')
        //Aplica borda como solid
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
    //1.Limpar configurações (elimina propriedades de versões antigas, como :theme)
    noteousSettings = {}
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

    //2.Aplicar novas configurações
    //preview 1.8: sort agora é objeto com time e action
    noteousSettings = {
      noteousApp: { noteousVersion: currentVersion, installPrompt: 0, acceptedTermsVersion: termsVersion },
      sort: { time: 'recent', action: 'id' },
      priority: 'solid',
      priorityOrder: ['solid', 'double', 'dotted'], // preview 1.8: ordem das listas de prioridade
      priorityOrientation: 'row',
      actionButtons: ['done', 'share', 'copy'],
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

function notePriority(context, priority) {
  //context ==> (1) recuperarPrioridade, (2)recuperarPrioridadeAoDesfocarInput (ao tirar foco define opacidade = 0 de Opções da Nota. Mas, é necessário também definir junto a borda, pois ao contrário um sobrescreve o outro), (3) trocarPrioridade
  if (context == 'retrievePriority') {
    if (priority == 'solid') {
      writeOptions.removeAttribute('hidden')
      writeOptions.style.cssText = 'border-style: solid;'
      writeInput.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
    } else if (priority == 'double') {
      writeOptions.removeAttribute('hidden')
      writeOptions.style.cssText = 'border-style: double;'
      writeInput.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
    } else if (priority == 'dotted') {
      writeOptions.removeAttribute('hidden')
      writeOptions.style.cssText = 'border-style: dotted;'
      writeInput.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
    }
  } else if (context == 'retrievePriorityBlurInput') {
    if (priority == 'solid') {
      writeOptions.style.cssText =
        'border-style: solid; opacity: 0; transform: scale(60%); pointer-events: none;'
      setTimeout(() => {
        writeOptions.setAttribute('hidden', 'true')
      }, 100)
    } else if (priority == 'double') {
      writeOptions.style.cssText =
        'border-style: double;  opacity: 0; transform: scale(60%); pointer-events: none;'
      setTimeout(() => {
        writeOptions.setAttribute('hidden', 'true')
      }, 100)
    } else if (priority == 'dotted') {
      writeOptions.style.cssText =
        'border-style: dotted;  opacity: 0; transform: scale(60%); pointer-events: none;'
      setTimeout(() => {
        writeOptions.setAttribute('hidden', 'true')
      }, 100)
    }
  } else if (context == 'changePriority') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: double;'
      writeInput.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: dotted;'
      writeInput.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: solid;'
      writeInput.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
}

writeInput.addEventListener('focus', () => {
  if (editMode == false) {
    notePriority('retrievePriority', noteousSettings.priority)
  }
})

writeInput.addEventListener('blur', () => {
  if (editMode == false) {
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


//noteous preview 1.9: Elemento Buscar
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

function readOptionsSortActionButtonText() {
  if (noteousSettings.sort.action == 'editedAt') {
    readOptionsSortActionButton.innerHTML = ''
    readOptionsSortActionButton.append(document.createTextNode('edit_note'))
  } else if (noteousSettings.sort.action == 'id') {
    readOptionsSortActionButton.innerHTML = ''
    readOptionsSortActionButton.append(document.createTextNode('post_add'))
  }
}

function sortNotes(context, subcontext) {

  // noteous em versões anteriores: Antes, apenas dava a 'sensação' de que as notas foram ordenadas, apenas usando flex-reverse.
  // noteous preview 1.7.1: função sortNotes() revisada. Agora, faz uma inversão de verdade, ordenando o array de notas.
  // noteous preview 1.8: função sortNotes() revisada. Agora, há dois critérios de ordenação: (1) tempo (recente ou antigo primeiro) e (2) ação (ordem pela criação ou pela edição). Assim, o usuário pode escolher se quer ver as notas mais recentes primeiro ou as mais antigas primeiro, e também se quer que a ordenação seja feita pela data de criação ou pela data de edição.

  if (context == 'retrieveSort') {

    if (noteousSettings.sort.time == 'recent') {
      noteousMain.sort((a, b) => b[noteousSettings.sort.action] - a[noteousSettings.sort.action])
      
      readOptionsSort.innerHTML = ''
      readOptionsSort.append(document.createTextNode('arrow_downward'))
      readOptionsSortActionButtonText()


    } else if (noteousSettings.sort.time == 'old') {
      noteousMain.sort((a, b) => a[noteousSettings.sort.action] - b[noteousSettings.sort.action])
      
      readOptionsSort.innerHTML = ''
      readOptionsSort.append(document.createTextNode('arrow_upward'))
      readOptionsSortActionButtonText()
    }

    renderNote('render-all')

  } else if (context == 'change-sort-action') {
      if (noteousSettings.sort.action == 'editedAt') {
          noteousSettings.sort.action = 'id' // Troca ordem de notas pela Criação
          localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
          readOptionsMessage('Ordenar por: Criação')
        
      } else if (noteousSettings.sort.action == 'id') {
          noteousSettings.sort.action = 'editedAt' // Troca ordem de notas pela Edição
          localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
          readOptionsMessage('Ordenar por: Edição')
      }
      sortNotes('retrieveSort')

  } else if (context == 'change-sort-time') {

    //Se o tempo era recente, troca para antigo
    if (noteousSettings.sort.time == 'recent') {
      noteousSettings.sort.time = 'old'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

      readOptionsSortActionButtonText()

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('arrow_upward')
      )
      
      readOptionsMessage('Ordem: Mais antigas primeiro')
      
      // Ordem: Antigo para recente
      noteousMain.sort((a, b) => a[noteousSettings.sort.action] - b[noteousSettings.sort.action])

      renderNote('render-all')

      //Se o tempo era antigo, troca para recente
    } else if (noteousSettings.sort.time == 'old') {
      noteousSettings.sort.time = 'recent'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

      readOptionsSortActionButtonText()

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(document.createTextNode('arrow_downward'))
      
      readOptionsMessage('Ordem: Mais recentes primeiro')
      
      // Ordem: Recente para antigo
      noteousMain.sort((a, b) => b[noteousSettings.sort.action] - a[noteousSettings.sort.action])

      renderNote('render-all')
    }
  }
}
readOptionsSort.addEventListener('click', () => {
  sortNotes('change-sort-time')
})
readOptionsSortActionButton.addEventListener('click', () => {
  sortNotes('change-sort-action')
})

//////////

function renderNote(context, noteId, searchTerm) {

  //ESSE CONTEXTO É USADO AO CARREGAR A PÁGINA, RENDERIZANDO TODAS AS NOTAS

  if (context == 'render-all') {
    readNotesContainer.innerHTML = ''
    if (readNotesListSolid) {
      readNotesListSolid.innerHTML = ''
    }
    if (readNotesListDouble) {
      readNotesListDouble.innerHTML = ''
    }
    if (readNotesListDotted) {
      readNotesListDotted.innerHTML = ''
    }

    // noteous preview 1.7.1: Listas de Prioridade. Criação primeiro das notas e depois ver qual lista vai. Problema: cada nova nota reordena a Lista de Prioridade. Por exemplo, uma nova nota com prioridade dotted joga a Lista de Prioridade dotted para o primeiro lugar.

    //noteous preview 1.8: personalização de ordem de Listas de Prioridade. Revisão do código para criar as listas na ordem definida pelo usuário. Agora, renderNote() primeiro verifica a ordem das listas e depois, adiciona a nota em sua respectiva lista.

    for (let priority of noteousSettings.priorityOrder) {
      if (!readNotesContainer.querySelector(`#read-notes-list-${priority}`)) { //Se não há lista com essa prioridade, cria
        readNotesContainer.append(readNotesLists[priority])
      }

      for (let note of noteousMain) {
        // Verifica se a nota atual pertence à lista de prioridade que está sendo criada. A ordem das notas dentro da lista é definida por sortNotes(). Ou seja: noteousMain já vem ordenado pelo sortNotes()
        //noteous preview 1.9: ao renderizar todas as notas, se houver termo de busca, filtra as notas que contêm o termo (sem diferenciar maiúsculas e minúsculas)
        if (note.priority == priority && note.done != true && (searchTerm == undefined || note.text.toLowerCase().includes(searchTerm.toLowerCase()))) {
          let noteContainer = document.createElement('div')
          noteContainer.id = note.id + '-note-container'
          noteContainer.classList.add('note-container')
          readNotesLists[priority].append(noteContainer)
          
        //BORDER/PRIORITY
        if (note.priority == 'solid') {
          noteContainer.style.cssText = 'border-style: none;'
        } else if (note.priority == 'double') {
          noteContainer.style.cssText = 'border-style: double;'
        } else if (note.priority == 'dotted') {
          noteContainer.style.cssText = 'border-style: dotted;'
        }

        //ACTION BUTTONS

        let actionButtonsContainer = document.createElement('div')
        actionButtonsContainer.id = note.id + '-action-buttons-container'
        actionButtonsContainer.classList.add('action-buttons-container')

        for (let actionButton of noteousSettings.actionButtons) {

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

            actionButtonsContainer.appendChild(readNotesActionButtons[actionButton])
        }
        

        //NOTE TEXT
        let noteTextContainer = document.createElement('div')
        noteTextContainer.id = note.id + '-text-container'
        noteTextContainer.classList.add('note-text-container')
        noteTextContainer.setAttribute('onclick', `openNote(${note.id})`)

        // --> adição de 'texto' ao id porque não pode haver ids iguais
        let textElement = document.createElement('p')
        textElement.id = note.id + '-text'
        noteContainer.appendChild(textElement)

        // noteous em versões anteriores: se nota tivesse menos de 300 caracteres, o conteúdo seria adicionado por inteiro. Se tivesse mais de 300 carateceres, iria testar cada caractere até chegar no 300º e exibir 'VER MAIS'. Isso levava em conta somente o texto dela, para previnir que ficasse muito longo, mas não levava em conta o espaço que o elemento ocupava.
        // noteous preview 1.7.1: caracteres da nota são contados sempre. Agora, há 3 listas de prioridade e o espaço que uma nota ocupa é muito mais importante. Assim, ao renderizar uma nota, cada caractere dela é contado para que, se alcançar 200 caracteres ou alcançar 200px de altura, o que chegar primeiro, seja exibido 'VER MAIS'. Isso previne que notas muito longas ocupem espaço demais.

        let noteChar = note.text
        let count = 0
        for (let noteCharAt of noteChar) {
          textElement.appendChild(document.createTextNode(noteCharAt))
          count = count + 1
          
          //"Ir escrevendo" cada caractere até chegar o 30º ou até a altura da nota ser 200px
          if (count == 200 || noteContainer.offsetHeight >= 200){
            
            textElement.append(document.createTextNode(' ...'))
            textElement.append(document.createElement('br'))
            textElement.append(document.createTextNode('[VER MAIS]'))

            break
          }
        }
        

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
          `if (event.key === 'Enter') { openNote(${note.id}); }`
        )

        

        //APPENDS
        noteTextContainer.appendChild(textElement)
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
    for (let note of noteousMain) {
      if (note.id == noteId) {
        let noteContainer = document.createElement('div')
        noteContainer.id = note.id + '-note-container'
        noteContainer.classList.add('note-container')
        
        //noteous preview 1.7.1
        //Visualização por Listas de Prioridade
        //Após criar as notas, irá sorteá-las de acordo com a prioridade

        //Caso alguma tenha alguma nota com prioridade solid,
        //Adiciona lista ao container de listas (readNotesContainer) caso seja a primeira nota
        //Depois, adiciona a nota à lista

        if (note.priority == 'solid') {
          if (!readNotesContainer.querySelector('#read-notes-list-solid')) {
            readNotesContainer.append(readNotesListSolid)
          }
          readNotesListSolid.append(noteContainer)  

        } else if (note.priority == 'double') {
          if (!readNotesContainer.querySelector('#read-notes-list-double')) {
            readNotesContainer.append(readNotesListDouble)
          }
          readNotesListDouble.append(noteContainer)

        } else if (note.priority == 'dotted') {
          if (!readNotesContainer.querySelector('#read-notes-list-dotted')) {
            readNotesContainer.append(readNotesListDotted)
          }
          readNotesListDotted.append(noteContainer)
        }

        //BORDER/PRIORITY
        if (note.priority == 'solid') {
          noteContainer.style.cssText = 'border-style: none;'
        } else if (note.priority == 'double') {
          noteContainer.style.cssText = 'border-style: double;'
        } else if (note.priority == 'dotted') {
          noteContainer.style.cssText = 'border-style: dotted;'
        }

        //ACTION BUTTONS
        let actionButtonsContainer = document.createElement('div')
        actionButtonsContainer.id = note.id + '-action-buttons-container'
        actionButtonsContainer.classList.add('action-buttons-container')

        //done
        let doneActionButton = document.createElement('a')
        doneActionButton.classList.add('action-buttons', 'material-icons')
        doneActionButton.setAttribute('onclick', `doneNote(${note.id})`)
        doneActionButton.appendChild(document.createTextNode('check_circle'))

        //NOTE TEXT
        let noteTextContainer = document.createElement('div')
        noteTextContainer.id = note.id + '-text-container'
        noteTextContainer.classList.add('note-text-container')
        noteTextContainer.setAttribute('onclick', `openNote(${note.id})`)
        
        // --> adição de 'texto' ao id porque não pode haver ids iguais
        let textElement = document.createElement('p')
        textElement.id = note.id + '-text'
        noteContainer.appendChild(textElement)

        // noteous em versões anteriores: se nota tivesse menos de 300 caracteres, o conteúdo seria adicionado por inteiro. Se tivesse mais de 300 carateceres, iria testar cada caractere até chegar no 300º e exibir 'VER MAIS'. Isso levava em conta somente o texto dela, para previnir que ficasse muito longo, mas não levava em conta o espaço que o elemento ocupava.
        // noteous preview 1.7.1: caracteres da nota são contados sempre. Agora, há 3 listas de prioridade e o espaço que uma nota ocupa é muito mais importante. Assim, ao renderizar uma nota, cada caractere dela é contado para que, se alcançar 200 caracteres ou alcançar 200px de altura, o que chegar primeiro, seja exibido 'VER MAIS'. Isso previne que notas muito longas ocupem espaço demais.

        let noteChar = note.text
        let count = 0
        for (let noteCharAt of noteChar) {
          textElement.appendChild(document.createTextNode(noteCharAt))
          count = count + 1
          
          console.log(noteContainer.offsetHeight)
          //"Ir escrevendo" cada caractere até chegar o 30º
          if (count == 200 || noteContainer.offsetHeight >= 200){
            
            textElement.append(document.createTextNode(' ...'))
            textElement.append(document.createElement('br'))
            textElement.append(document.createTextNode('[VER MAIS]'))

            break
          }
        }

        //DATE
        let noteDateContainer = document.createElement('div')
        noteDateContainer.id = note.id + '-note-date-container'
        noteDateContainer.classList.add('note-date-container')

        let dateElement = document.createElement('p')
        dateElement.id = note.id + '-date-element'
        dateElement.appendChild(
          document.createTextNode(
            `Criado em: ${new Date(note.id).getDate()}/${findMonth(
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
        noteTextContainer.setAttribute('aria-label', 'Anotação')
        noteTextContainer.setAttribute(
          'onkeyup',
          `if (event.key === 'Enter') { openNote(${note.id}); }`
        )

        doneActionButton.tabIndex = tabIndexCounter += 1
        doneActionButton.setAttribute('aria-label', 'Concluir nota')
        doneActionButton.setAttribute(
          'onkeyup',
          `if (event.key === 'Enter') { doneNote(${note.id}); }`
        )

        //APPENDS
        actionButtonsContainer.appendChild(doneActionButton)
        noteTextContainer.appendChild(textElement)
        noteDateContainer.appendChild(dateElement)
        noteTextContainer.appendChild(noteDateContainer)

        noteContainer.appendChild(actionButtonsContainer)
        noteContainer.appendChild(noteTextContainer)

        readNotesContainer.prepend(noteContainer)
      }
    }
  }
  orblendEngine('change')
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

// noteous preview 1.9: nova experiência ao sair sem salvar uma nota
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

//////////
//SHARE NOTE
function shareNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      if (navigator.share) {
        navigator
          .share({
            title: 'Anotação do Noteous',
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
          }, 2000)
        })
        .catch((error) => console.log('Erro ao copiar nota', error))
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

          renderNote('render-all')

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
