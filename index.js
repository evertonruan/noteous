//SERVICE WORKER ///////
window.addEventListener('load', () => {
  registerSW()
})

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js')
    } catch (e) {
      console.log('Service Worker Registration failed')
    }
  }
}

// ELEMENTOS ///////
let body = document.querySelector('body')
let root = document.querySelector(':root')

let shortcutButton = document.querySelector('#shortcut-button')
let shortcutText = document.querySelector('#shortcut-text')

//WRITE-SECTION
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')

let infoPanel = document.querySelector('#info-panel')

let writeOptions = document.querySelector('#write-options')

let labelWrite = document.querySelector('#write-label')
let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteButtonEdit = document.querySelector('#write-button-edit')
let noteButtonCancelEdit = document.querySelector('#write-button-cancel')

//READ-SECTION
let readSection = document.querySelector('#section-read')
let readPanel = document.querySelector('#read-panel')
let readOptions = document.querySelector('#read-options')
let readOptionsSort = document.querySelector('#read-options-sort')
let noteList = document.querySelector('#read-notes-list')

// VARIÁVEIS IMPORTANTES /////////////////////////////////////

let currentVersion = 1.5
let noteIdEdit //usada para confirmar qual nota está sendo editada
let editMode = false
let cssRootGroup //Usada para agrupar todos os valores CSS adicionados a :root. Motivo: se forem colocados separadamente, um irá sobrescrever o outro.

//função em variável para 'desbloquear' noteInput se tela é pequena
//usado em openNote() e exitEditMode()
let noteInputEdit = function (event) {
  noteInput.removeAttribute('readonly')
  labelWrite.innerHTML = '📝 Edite aqui sua nota'
}

///////////////////////////////////////////////////////////////

//INICIALIZAÇÃO //////////////////////////////////////////////

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousOrbs = JSON.parse(localStorage.getItem('noteous-orbs'))
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

getSettings()
renderNote('render-all', '')
orblendEngine('load')
orblendEngine('on-change-input')

/////////////////////////////////////////////////////////////

//welcomeToNoteous --> ao acessar 1ª vez ou nova versão
function welcomeToNoteous(context) {
  noteousLook('set-luminosity-light')

  //context --> primeiro acesso ou nova versão
  if (context == 'first-access') {
    //Configuração da tela de Boas vindas (noteous 1.0)

    //Panel e Section
    //greetingPanel --> sectionMain + sectionTitle
    let greetingPanel = document.createElement('div')
    greetingPanel.classList.add('greeting-panel')

    let greetingSectionMain = document.createElement('div')
    greetingSectionMain.classList.add('greeting-section-main')

    let greetingSectionTitle = document.createElement('div')
    greetingSectionTitle.classList.add('greeting-section-title')

    //Titles e Descriptions
    let greetingTitle1 = document.createElement('p')
    greetingTitle1.classList.add('greeting-title1')
    greetingTitle1.append(document.createTextNode('Bem-vindo ao'))

    let greetingTitleIcon = document.createElement('img')
    greetingTitleIcon.setAttribute('src', './img/logo-icon.png')
    greetingTitleIcon.classList.add('greeting-title-icon')

    greetingTitle2 = document.createElement('p')
    greetingTitle2.classList.add('greeting-title2')
    greetingTitle2.append(document.createTextNode('noteous'))
    greetingSectionTitle.append(greetingTitleIcon, greetingTitle2)

    //greetingDescriptions

    let greetingDescriptionTitle = document.createElement('p')
    greetingDescriptionTitle.classList.add('greeting-description-title')
    greetingDescriptionTitle.append(
      document.createTextNode(
        'Faça anotações, realize tarefas, seja mais produtivo'
      )
    )

    let greetingDescriptionUl = document.createElement('ul')
    let greetingDescriptionLi1 = document.createElement('li')
    let greetingDescriptionLi2 = document.createElement('li')
    let greetingDescriptionLi3 = document.createElement('li')
    let greetingDescriptionLi4 = document.createElement('li')

    greetingDescriptionLi1.classList.add('greeting-description-point')
    greetingDescriptionLi2.classList.add('greeting-description-point')
    greetingDescriptionLi3.classList.add('greeting-description-point')
    greetingDescriptionLi4.classList.add('greeting-description-point')

    greetingDescriptionLi1.append(
      document.createTextNode(
        'Temas: personalize sua experiência com o brilhante tema claro ou com o elegante tema escuro'
      )
    )
    greetingDescriptionLi2.append(
      document.createTextNode(
        'Organize suas tarefas por prioridade: quando adicionar uma nota é só tocar ou clicar no círculo ° para trocar entre diferentes bordas, que representam prioridades.'
      )
    )
    greetingDescriptionLi3.append(
      document.createTextNode(
        'noteous possui um design inovador que convida você a fazer anotações. Veja a data de hoje, escreva sua próxima tarefa ou registre algo para não esquecer.'
      )
    )
    greetingDescriptionLi4.append(
      document.createTextNode(
        'IMPORTANTE: Se você já utilizava o Enote (o aplicativo anterior), poderá transferir manualmente suas notas para o noteous. Clique em Saiba Mais para obter instruções'
      )
    )

    greetingDescriptionUl.append(
      greetingDescriptionLi1,
      greetingDescriptionLi2,
      greetingDescriptionLi3,
      greetingDescriptionLi4
    )

    //Next Button
    btnNext = document.createElement('button')
    btnNext.classList.add('write-buttons')
    btnNext.appendChild(document.createTextNode('Acessar noteous'))
    btnNext.addEventListener('click', () => {
      document.location.reload()
    })

    //Appends
    greetingSectionMain.append(
      greetingTitle1,
      greetingSectionTitle,
      greetingDescriptionTitle,
      greetingDescriptionUl,
      btnNext
    )
    greetingPanel.append(greetingSectionMain)
    body.append(greetingPanel)
  } else if (context == 'new-version') {
    //Panel e Section
    let greetingPanel = document.createElement('div')
    greetingPanel.classList.add('greeting-panel')

    let greetingSectionMain = document.createElement('div')
    greetingSectionMain.classList.add('greeting-section-main')

    let greetingSectionTitle = document.createElement('div')
    greetingSectionTitle.classList.add('greeting-section-title')

    //Titles e Descriptions
    let greetingTitle1 = document.createElement('p')
    greetingTitle1.classList.add('greeting-title1')
    greetingTitle1.append(document.createTextNode('Bem-vindo de volta!'))

    let greetingTitle1b = document.createElement('p')
    greetingTitle1b.classList.add('greeting-title1')
    greetingTitle1b.append(document.createTextNode('Temos uma atualização'))

    let greetingTitleIcon = document.createElement('img')
    greetingTitleIcon.setAttribute('src', './img/logo-icon.png')
    greetingTitleIcon.classList.add('greeting-title-icon')

    greetingTitle2 = document.createElement('p')
    greetingTitle2.classList.add('greeting-title2')
    greetingTitle2.append(document.createTextNode('noteous 1.4.1'))
    greetingSectionTitle.append(greetingTitleIcon, greetingTitle2)

    ////////////////////

    let greetingDescriptionTitle = document.createElement('p')
    greetingDescriptionTitle.classList.add('greeting-description-title')
    greetingDescriptionTitle.append(
      document.createTextNode('Confira as novidades desta versão')
    )

    let greetingDescriptionUl = document.createElement('ul')
    let greetingDescriptionLi1 = document.createElement('li')
    let greetingDescriptionLi2 = document.createElement('li')
    let greetingDescriptionLi3 = document.createElement('li')
    let greetingDescriptionLi4 = document.createElement('li')

    greetingDescriptionLi1.classList.add('greeting-description-point')
    greetingDescriptionLi2.classList.add('greeting-description-point')
    greetingDescriptionLi3.classList.add('greeting-description-point')
    greetingDescriptionLi4.classList.add('greeting-description-point')

    greetingDescriptionLi1.append(
      document.createTextNode(
        `Orblend Engine → É uma nova 'tecnologia' do noteous que analisa sua interação para melhorar sua experiência.`
      )
    )
    greetingDescriptionLi2.append(
      document.createTextNode(
        'Novo recurso → Desfazer Concluir Nota. Quando você conclui (apaga) uma nota, terá um breve momento para desfazer isso.'
      )
    )
    greetingDescriptionLi3.append(
      document.createTextNode(
        'Novo recurso → Backup Inteligente de Nota. Se você estava escrevendo uma nota e saiu sem salvar, poderá recuperá-la e continuar de onde parou'
      )
    )
    greetingDescriptionLi4.append(
      document.createTextNode(
        'Na atualização principal (1.4), foram feitas melhorias incríveis. Nesta atualização (1.4.1) há correções de alguns erros. Para ver todos os detalhes, acesse Saiba Mais > Histórico de Atualizações.'
      )
    )

    greetingDescriptionUl.append(
      greetingDescriptionLi1,
      greetingDescriptionLi2,
      greetingDescriptionLi3,
      greetingDescriptionLi4
    )

    //Next Button
    btnNext = document.createElement('button')
    btnNext.classList.add('write-buttons')
    btnNext.appendChild(document.createTextNode('Acessar noteous'))
    btnNext.addEventListener('click', () => {
      document.location.reload()
    })

    //Appends
    greetingSectionMain.append(
      greetingTitle1,
      greetingTitle1b,
      greetingSectionTitle,
      greetingDescriptionTitle,
      greetingDescriptionUl,
      btnNext
    )
    greetingPanel.append(greetingSectionMain)
    body.innerHTML = ''
    body.append(greetingPanel)
  }
}

// CONFIGURAÇÕES DE TEMA ////////////////////////////////////

function injectCSSOnRoot() {
  root.style = `${noteousSettings.look.hue} ${noteousSettings.look.saturation}
${noteousSettings.look.lumBack}
${noteousSettings.look.lumMid}
${noteousSettings.look.lumFront} ${noteousSettings.look.baseRem}`
}

function shortcutButtonConfig(context, subcontext) {
  if (context == 'set-text') {
    shortcutText.innerHTML = subcontext
  } else if (context == 'change-text') {
    if (noteousSettings.look.shortcut == 'luminosity') {
      noteousLook('change-luminosity')
    } else if (noteousSettings.look.shortcut == 'baseRem') {
      noteousLook('change-base-rem')
    }
  }
}

function noteousLook(context) {
  //context => recuperar tema, trocar tema, aplicar tema claro, aplicar tema escuro
  if (context == 'change-base-rem') {
    if (noteousSettings.look.baseRem == '--base-rem: 106.25%') {
      shortcutButtonConfig('set-text', 'view_headline')
      noteousSettings.look.baseRem = '--base-rem: 100%'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      injectCSSOnRoot()
    } else if (noteousSettings.look.baseRem == '--base-rem: 100%') {
      shortcutButtonConfig('set-text', 'format_align_justify')
      noteousSettings.look.baseRem = '--base-rem: 93.75%'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      injectCSSOnRoot()
    } else if (noteousSettings.look.baseRem == '--base-rem: 93.75%') {
      shortcutButtonConfig('set-text', 'drag_handle')
      noteousSettings.look.baseRem = '--base-rem: 106.25%'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      injectCSSOnRoot()
    }
  } else if (context == 'retrieve-look') {
    //SHORTCUT BUTTON --> test luminosity
    if (
      noteousSettings.look.shortcut == 'luminosity' &&
      noteousSettings.look.luminosity == 'light'
    ) {
      shortcutButtonConfig('set-text', 'light_mode')
    } else if (
      noteousSettings.look.shortcut == 'luminosity' &&
      noteousSettings.look.luminosity == 'dark'
    ) {
      shortcutButtonConfig('set-text', 'dark_mode')
    }
    //SHORTCUT BUTTON --> test baseRem
    if (
      noteousSettings.look.shortcut == 'baseRem' &&
      noteousSettings.look.baseRem == '--base-rem: 106.25%'
    ) {
      shortcutButtonConfig('set-text', 'drag_handle')
      //injectCSSOnRoot()
    } else if (
      noteousSettings.look.shortcut == 'baseRem' &&
      noteousSettings.look.baseRem == '--base-rem: 100%'
    ) {
      shortcutButtonConfig('set-text', 'view_headline')
      //injectCSSOnRoot()
    } else if (
      noteousSettings.look.shortcut == 'baseRem' &&
      noteousSettings.look.baseRem == '--base-rem: 93.75%'
    ) {
      shortcutButtonConfig('set-text', 'format_align_justify')
      //injectCSSOnRoot()
    }

    //NOTEOUS LUMINOSITY
    if (noteousSettings.look.luminosity == 'light') {
      noteousLook('set-luminosity-light')
    } else if (noteousSettings.look.luminosity == 'dark') {
      noteousLook('set-luminosity-dark')
    }
  } else if (context == 'change-luminosity') {
    if (noteousSettings.look.luminosity == 'light') {
      shortcutButtonConfig('set-text', 'dark_mode')
      noteousLook('set-luminosity-dark')
    } else if (noteousSettings.look.luminosity == 'dark') {
      shortcutButtonConfig('set-text', 'light_mode')
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

//////////

//GETSETTINGS --> ao atualizar página, recupera dados salvos
function getSettings() {
  //JÁ ACESSOU NOTEOUS --> recupera dados
  if (noteousSettings != null) {
    //VERIFICA SE HÁ NOVA VERSÃO
    if (noteousSettings.noteousVersion != currentVersion) {
      //SE HÁ NOVA VERSÃO
      noteousSettings = {
        noteousVersion: currentVersion,
        sort: 'recent',
        priority: 'solid',
        input: '',
        noteId: 0,
        look: { baseRem: '--base-rem: 100%', shortcut: 'luminosity' }
      }
      console.log(noteousOrbs)
      if (noteousOrbs == null) {
        noteousOrbs = {
          all: {},
          done: {}
        }
        localStorage.setItem('noteous-orbs', JSON.stringify(noteousOrbs))
      }
      welcomeToNoteous('new-version')
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else {
      //SE NÃO HÁ NOVA VERSÃO
      //Aplica última ordenação
      sortNotes('retrieve-sort')
      //Aplica último tema
      noteousLook('retrieve-look')
      //Aplica borda como solid
      noteousSettings.priority = 'solid'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      notePriority('retrieve-priority', noteousSettings.priority)
    }
  } else if (noteousSettings == null) {
    //NÃO HÁ CONFIGURAÇÕES --> PRIMEIRO ACESSO AO NOTEOUS
    noteousSettings = {
      noteousVersion: currentVersion,
      sort: 'recent',
      priority: 'solid',
      input: '',
      noteId: 0,
      look: { baseRem: '--base-rem: 100%', shortcut: 'luminosity' }
    }
    noteousOrbs = {
      all: {},
      done: {}
    }
    welcomeToNoteous('first-access')
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    localStorage.setItem('noteous-orbs', JSON.stringify(noteousOrbs))
  }
}

function notePriority(context, priority) {
  //context ==> (1) recuperar-prioridade, (2)recuperar-prioridade-ao-desfocar-input (ao tirar foco define opacidade = 0 de Opções da Nota. Mas, é necessário também definir junto a borda, pois ao contrário um sobrescreve o outro), (3) trocar-prioridade
  if (context == 'retrieve-priority') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: solid;'
      noteInput.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: double;'
      noteInput.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: dotted;'
      noteInput.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
    }
  } else if (context == 'retrieve-priority-blur-input') {
    if (priority == 'solid') {
      writeOptions.style.cssText =
        'border-style: solid; opacity: 0; transform: scale(60%); pointer-events: none;'
    } else if (priority == 'double') {
      writeOptions.style.cssText =
        'border-style: double;  opacity: 0; transform: scale(60%); pointer-events: none;'
    } else if (priority == 'dotted') {
      writeOptions.style.cssText =
        'border-style: dotted;  opacity: 0; transform: scale(60%); pointer-events: none;'
    }
  } else if (context == 'change-priority') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: double;'
      noteInput.style.cssText = 'border-style: double;'
      noteousSettings.priority = 'double'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: dotted;'
      noteInput.style.cssText = 'border-style: dotted;'
      noteousSettings.priority = 'dotted'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: solid;'
      noteInput.style.cssText = 'border-style: solid;'
      noteousSettings.priority = 'solid'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
}

noteInput.addEventListener('focus', () => {
  if (editMode == false) {
    notePriority('retrieve-priority', noteousSettings.priority)
  }
})

noteInput.addEventListener('blur', () => {
  if (editMode == false) {
    //Ao clicar no botão para trocar Prioridade, noteInput perde o foco --> botão de Prioridade desaparece.
    //Esse teste verifica primeiro se o noteInput perde o foco. Se está sem foco --> desaparecer botão Prioridade
    setTimeout(() => {
      if (document.activeElement.id != 'write-input')
        notePriority('retrieve-priority-blur-input', noteousSettings.priority)
    }, 500)
  }
})

writeOptions.addEventListener('click', () => {
  noteInput.focus()
  notePriority('change-priority', noteousSettings.priority)
})

//////////

function sortNotes(context) {
  if (context == 'retrieve-sort') {
    if (noteousSettings.sort == 'recent') {
      noteList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Recente primeiro')
      )
    } else if (noteousSettings.sort == 'old') {
      noteList.style.cssText =
        'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Antigo primeiro')
      )
    }
  } else {
    if (noteousSettings.sort == 'recent') {
      noteList.style.cssText =
        'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Antigo primeiro')
      )
      noteousSettings.sort = 'old'
      renderNote()
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (noteousSettings.sort == 'old') {
      noteList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Recente primeiro')
      )
      noteousSettings.sort = 'recent'
      renderNote()
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
}
readOptionsSort.addEventListener('click', sortNotes)

//////////

function renderNote(context, noteId, orb) {
  if (context == 'render-all') {
    noteList.innerHTML = ''

    for (let note of noteousMain) {
      //if (note.orb == orb) {
      let noteContainer = document.createElement('div')
      noteContainer.id = note.id + '-note-container'
      noteContainer.classList.add('note-container')

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

      //DELETE
      let deleteActionButton = document.createElement('a')
      deleteActionButton.classList.add('action-buttons', 'material-icons')
      deleteActionButton.setAttribute('onclick', `deleteNote(${note.id})`)
      deleteActionButton.appendChild(document.createTextNode('check_circle'))

      //NOTE TEXT
      let noteTextContainer = document.createElement('div')
      noteTextContainer.id = note.id + '-text-container'
      noteTextContainer.classList.add('note-text-container')
      noteTextContainer.setAttribute('onclick', `openNote(${note.id})`)

      // --> adição de 'texto' ao id porque não pode haver ids iguais
      let textElement = document.createElement('p')
      textElement.id = note.id + '-text'

      let noteChar = note.text
      if (noteChar.length < 300) {
        //Se tamanho da nota for menor que 30, escrever nota inteira
        textElement.appendChild(document.createTextNode(noteChar))
      } else if (noteChar.length >= 300) {
        //Se tamanho da nota for maior que 30, escrever apenas até o 30º caractere e acrescentar botão para ver nota inteira
        let count = 0
        for (let noteCharAt of noteChar) {
          textElement.appendChild(document.createTextNode(noteCharAt))
          count = count + 1
          //"Ir escrevendo" cada caractere até chegar o 30º
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

      //APPENDS
      actionButtonsContainer.appendChild(deleteActionButton)
      noteTextContainer.appendChild(textElement)
      noteDateContainer.appendChild(dateElement)
      noteTextContainer.appendChild(noteDateContainer)

      noteContainer.appendChild(actionButtonsContainer)
      noteContainer.appendChild(noteTextContainer)

      noteList.appendChild(noteContainer)
      //}
    }

    setTimeout(() => {
      //css inicia em 0. Após renderizar, altera para 1
      readPanel.style.cssText = 'opacity: 1; transform: translateY(-10px);'
    }, 300)
  } else if (context == 'add') {
    for (let note of noteousMain) {
      if (note.id == noteId) {
        let noteContainer = document.createElement('div')
        noteContainer.id = note.id + '-note-container'
        noteContainer.classList.add('note-container')

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

        //DELETE
        let deleteActionButton = document.createElement('a')
        deleteActionButton.classList.add('action-buttons', 'material-icons')
        deleteActionButton.setAttribute('onclick', `deleteNote(${note.id})`)
        deleteActionButton.appendChild(document.createTextNode('check_circle'))

        //NOTE TEXT
        let noteTextContainer = document.createElement('div')
        noteTextContainer.id = note.id + '-text-container'
        noteTextContainer.classList.add('note-text-container')
        noteTextContainer.setAttribute('onclick', `openNote(${note.id})`)
        // --> adição de 'texto' ao id porque não pode haver ids iguais

        let textElement = document.createElement('p')
        textElement.id = note.id + '-text'

        let noteChar = note.text
        if (noteChar.length < 300) {
          //Se tamanho da nota for menor que 30, escrever nota inteira
          textElement.appendChild(document.createTextNode(noteChar))
        } else if (noteChar.length >= 300) {
          //Se tamanho da nota for maior que 30, escrever apenas até o 30º caractere e acrescentar botão para ver nota inteira
          let count = 0
          for (let noteCharAt of noteChar) {
            textElement.appendChild(document.createTextNode(noteCharAt))
            count = count + 1
            //"Ir escrevendo" cada caractere até chegar o 30º
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

        //APPENDS
        actionButtonsContainer.appendChild(deleteActionButton)
        noteTextContainer.appendChild(textElement)
        noteDateContainer.appendChild(dateElement)
        noteTextContainer.appendChild(noteDateContainer)

        noteContainer.appendChild(actionButtonsContainer)
        noteContainer.appendChild(noteTextContainer)

        noteList.prepend(noteContainer)
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
  if (noteInput.value || '') {
    let objNote = {
      id: Date.now(),
      text: noteInput.value,
      priority: noteousSettings.priority
    }

    noteousMain.unshift(objNote)

    localStorage.setItem('noteous-main', JSON.stringify(noteousMain))

    renderNote('add', objNote.id)
    noteInput.value = ''
    noteInput.focus()
    orblendEngine('on-change-input')
  }
}

noteButtonAdd.addEventListener('click', addNote)

noteInput.addEventListener('input', () => {
  orblendEngine('on-change-input')
})

//////////

//APAGAR NOTA
let timeoutID
function deleteNote(noteId) {
  timeoutID = setTimeout(() => {
    let noteContainer = document.getElementById(noteId + '-note-container')
    noteContainer.style.cssText = 'opacity: 0;  transform: scale(80%);'

    setTimeout(() => {
      noteContainer.remove()
      for (let note of noteousMain) {
        if (note.id === noteId) {
          noteousMain.splice(noteousMain.indexOf(note), 1)
        }
      }

      localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
      orblendEngine('change')
    }, 100)
  }, 1500)

  let noteTextContainer = document.getElementById(noteId + '-text-container')
  let textElement = document.getElementById(noteId + '-text')
  let actionButtonsContainer = document.getElementById(
    noteId + '-action-buttons-container'
  )
  let noteDateContainer = document.getElementById(
    noteId + '-note-date-container'
  )

  noteTextContainer.removeAttribute('onclick')
  textElement.addEventListener('click', () => {
    clearTimeout(timeoutID)
    renderNote('render-all')
  })
  textElement.innerHTML = 'Movido para orb Concluídos. Clique para Desfazer'
  actionButtonsContainer.style.cssText = 'opacity: 0;'
  noteDateContainer.style.cssText = 'opacity: 0;'
}

//////////

//ABRIR NOTA
function openNote(noteId) {
  editMode = true
  for (let note of noteousMain) {
    if (note.id === noteId) {
      notePriority('retrieve-priority', note.priority)
      notePriority('retrieve-priority-blur-input', note.priority)
      noteousSettings.priority = note.priority
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }
  }
  if (window.screen.width <= 600) {
    //Se for dispositivo móvel, ao abrir uma nota o teclado não irá aparecer imediatamente (readonly), mas ao tocar no campo de input o teclado aparecerá (readonly remove)
    noteInput.setAttribute('readonly', true)
    noteInput.focus()
    noteButtonCancelEdit.removeAttribute('hidden')
    labelWrite.innerHTML = '📄 Veja aqui sua nota'
    editNote(noteId)
    noteInput.addEventListener('click', noteInputEdit, false)
  } else if (window.screen.width >= 601) {
    noteInput.focus()
    noteButtonCancelEdit.removeAttribute('hidden')
    labelWrite.innerHTML = '📝 Edite aqui sua nota'
    editNote(noteId)
  }
}

//////////

function editNote(noteId) {
  for (let note of noteousMain) {
    noteIdEdit = noteId
    if (note.id === noteId) {
      //Entra no Modo de edição
      editMode = true
      noteInput.classList.add('edit-mode')
      readSection.classList.add('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)
      writePanel.classList.add('edit-mode')

      infoPanel.innerHTML = ''

      noteButtonAdd.setAttribute('hidden', 'true')

      noteInput.value = note.text //coloca o texto da nota dentro do campo de input

      noteInput.addEventListener('input', () => {
        if (editMode == true) {
          if (noteInput.value == note.text) {
            noteButtonEdit.setAttribute('hidden', 'true')
            noteButtonCancelEdit.removeAttribute('hidden')
            notePriority(
              'retrieve-priority-blur-input',
              noteousSettings.priority
            )
          } else if (noteInput.value != note.text) {
            noteButtonEdit.removeAttribute('hidden')
            noteButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrieve-priority', noteousSettings.priority)
          }
        }
      })

      //Se durante Modo de edição clicar em "Confirmar edição"
      noteButtonEdit.addEventListener('click', () => {
        if (noteInput.value != '' && noteInput.value != null) {
          for (let note of noteousMain) {
            if (note.id === noteIdEdit) {
              note.text = noteInput.value
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
      noteButtonCancelEdit.addEventListener('click', exitEditMode)
    }
  }
}

function exitEditMode() {
  //Remove informações do Backup Inteligente de Nota
  noteInput.value = ''
  noteIdEdit = 0
  orblendEngine('on-change-input')

  editMode = false

  writePanel.classList.remove('edit-mode')
  readSection.classList.remove('edit-mode')

  noteInput.classList.remove('edit-mode')
  noteInput.value = ''
  noteInput.removeAttribute('readonly')
  noteInput.removeEventListener('click', noteInputEdit, false)

  noteousSettings.priority = 'solid'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  writeOptions.style.cssText = 'border-style: solid; opacity: 0;'
  noteInput.style.cssText = 'border-style: solid;'

  orblendEngine('change')

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
