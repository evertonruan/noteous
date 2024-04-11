// ELEMENTOS /////////////////////////////////////
let body = document.querySelector('body')

let themeButton = document.querySelector('#theme-container')

//WRITE-SECTION
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')

let infoPanel = document.querySelector('#info-panel')

let writeOptions = document.querySelector('#write-options')

let labelWrite = document.querySelector('#write-label')
let writeInput = document.querySelector('#write-input')
let writeButtonAdd = document.querySelector('#write-button-add')
let writeButtonEdit = document.querySelector('#write-button-edit')
let writeButtonCancelEdit = document.querySelector('#write-button-cancel')

//READ-SECTION
let readSection = document.querySelector('#section-read')
let readPanel = document.querySelector('#read-panel')
let readOptions = document.querySelector('#read-options')
let readOptionsSort = document.querySelector('#read-options-sort')
let readNotesList = document.querySelector('#read-notes')

// VARIÁVEIS IMPORTANTES /////////////////////////////////////

let currentVersion = 1.45
let noteIdEdit //usada para confirmar qual nota está sendo editada
let editMode = false
let tabIndexCounter = 10

//função em variável para 'desbloquear' writeInput se tela é pequena
//usado em openNote() e exitEditMode()
let writeInputEdit = function (event) {
  writeInput.removeAttribute('readonly')
  labelWrite.innerHTML = '📝 Edite aqui sua nota'
}

///////////////////////////////////////////////////////////////

//INICIALIZAÇÃO //////////////////////////////////////////////

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

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

    //Section e Panel
    //greetingSection --> sectionMain + sectionTitle
    let greetingSection = document.createElement('div')
    greetingSection.classList.add('greeting-section')

    let greetingPanel = document.createElement('div')
    greetingPanel.classList.add('greeting-panel')

    let greetingTitleContainer = document.createElement('div')
    greetingTitleContainer.classList.add('greeting-title-container')

    //Titles e Descriptions
    let greetingTitle1 = document.createElement('p')
    greetingTitle1.classList.add('greeting-title1')

    let greetingTitleIcon = document.createElement('img')
    greetingTitleIcon.setAttribute('src', './img/logo-icon.png')
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
      welcomeToNoteous('render-policies')
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
      greetingTitle1.append(document.createTextNode('Bem-vindo ao'))
      greetingTitle2.append(document.createTextNode('noteous'))
      greetingDescriptionTitle.append(
        document.createTextNode(
          'Faça anotações, realize tarefas, seja mais produtivo'
        )
      )

      greetingDescription1.append(
        document.createTextNode(
          'Temas: personalize sua experiência com o brilhante tema claro ou com o elegante tema escuro'
        )
      )

      greetingDescription2.append(
        document.createTextNode(
          'Organize suas tarefas por prioridade: quando adicionar uma nota é só tocar ou clicar no círculo ° para trocar entre diferentes bordas, que representam prioridades.'
        )
      )

      greetingDescription3.append(
        document.createTextNode(
          'noteous possui um design inovador que convida você a fazer anotações. Veja a data de hoje, escreva sua próxima tarefa ou registre algo para não esquecer.'
        )
      )

      greetingDescription4.append(
        document.createTextNode(
          'noteous está em constante melhoria. Quando tiver uma nova versão, chegará automaticamente para você.'
        )
      )

      greetingDescriptionContainer1.append(greetingDescription1)
      greetingDescriptionContainer2.append(greetingDescription2)
      greetingDescriptionContainer3.append(greetingDescription3)
      greetingDescriptionContainer4.append(greetingDescription4)

      greetingDescriptionContainerAll.append(
        greetingDescriptionContainer1,
        greetingDescriptionContainer2,
        greetingDescriptionContainer3,
        greetingDescriptionContainer4
      )
    } else if (subcontext == 'new-version') {
      greetingTitle1.append(document.createTextNode('Bem-vindo ao'))
      greetingTitle2.append(document.createTextNode('noteous'))
      greetingDescriptionTitle.append(
        document.createTextNode(
          'O noteous foi atualizado: a versão 1.5 está incrível! Veja algumas novidades'
        )
      )

      greetingDescription1.append(
        document.createTextNode(
          'O noteous está mais acessível: navegue apenas usando o teclado e ajuste o tamanho do texto. Além disso, o noteous é agora melhor compatível com leitores de tela.'
        )
      )

      greetingDescription2.append(
        document.createTextNode(
          'Experiência aprimorada: os temas claro e escuro estão ainda mais bonitos. A edição de notas está ainda mais intuitiva. E outras pequenas melhorias tornam tudo muito mais incrível!'
        )
      )

      greetingDescriptionContainerAll.append(
        greetingDescriptionContainer1,
        greetingDescriptionContainer2
      )

      greetingDescriptionContainer1.append(greetingDescription1)
      greetingDescriptionContainer2.append(greetingDescription2)
    }
  } else if (context == 'render-policies') {
    let greetingPanel = document.querySelector('.greeting-panel')
    greetingPanel.innerHTML = ''

    let greetingPoliciesTitle = document.createElement('p')
    greetingPoliciesTitle.classList.add('greeting-description-title')
    greetingPoliciesTitle.innerHTML = 'Aceite os Termos'

    let greetingPoliciesContainer = document.createElement('div')
    let greetingPoliciesText = document.createElement('p')
    greetingPoliciesText.classList.add('greeting-policies-text')
    greetingPoliciesContainer.append(greetingPoliciesText)
    greetingPanel.append(greetingPoliciesTitle, greetingPoliciesContainer)

    fetch('./policies.json')
      .then(response => response.json())
      .then(policies => {
        let termsUse = policies.termsUse
        console.log(termsUse)
      })
    /*
    fetch('./policies.json')
      .then(response => response.json())
      .then(policies => {
        let termsUse = policies.termsUse
        console.log(termsUse)
      })
*/

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
      if (noteousSettings.noteousVersion != currentVersion) {
        //SE HÁ NOVA VERSÃO
        welcomeToNoteous('render-welcome', 'new-version')
      } else {
        //SE NÃO HÁ NOVA VERSÃO
        renderNote('render-all')
        orblendEngine('load')
        orblendEngine('on-change-input')

        //Aplica última ordenação
        sortNotes('retrieveSort')
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
      welcomeToNoteous('render-welcome', 'first-access')
    }
  }

  if (context == 'set-settings') {
    //1.Limpar configurações (elimina propriedades de versões antigas, como :theme)
    noteousSettings = {}
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

    //2.Aplicar novas configurações
    noteousSettings = {
      noteousVersion: currentVersion,
      sort: 'recent',
      priority: 'solid',
      input: '',
      noteId: 0,
      look: { baseRem: '--base-rem: 100%;' }
    }
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

    //2.1. Aplicar configurações de tema
    noteousTheme('set-theme-light')
  }
}

//////////

function orblendEngine(context) {
  let subcontext

  const getRandom = () => {
    let math = Math.random()
    if (math < 0.5) {
      return false
    } else {
      return true
    }
  }

  let dateElement = function makeDateElement() {
    let dateNow = new Date()
    let infoElementDate = document.createElement('p')
    infoElementDate.classList.add('info-element')
    let infoElementDateText = document.createTextNode(
      `Olá! Hoje é ${findWeek(new Date(dateNow).getDay())}, ${new Date(
        dateNow
      ).getDate()} de ${findMonth(new Date(dateNow).getMonth())}`
    )
    infoElementDate.append(infoElementDateText)
    return infoElementDate
  }

  let infoElement = function makeInfoElement(subcontext, random) {
    let infoText
    if (subcontext == 'no-notes') {
      infoText = 'Você ainda não tem anotações \n Adicione sua próxima tarefa!'
    } else if (subcontext == 'has-notes') {
      infoText = ''
    }
    let infoElementTip = document.createElement('p')
    infoElementTip.classList.add('info-element')
    let infoElementTipText = document.createTextNode(`${infoText}`)
    infoElementTip.append(infoElementTipText)

    if (infoText == '') {
      infoElementTip.style.marginBottom = '0;'
      infoPanel.style.cssText = 'margin-bottom: 0;'
    } else {
      infoPanel.style.cssText = ''
    }

    return infoElementTip
  }

  if (context == 'change') {
    //exibir/ocultar readOptions
    if (noteousMain.length > 1) {
      readOptionsSort.style.cssText = 'opacity: 1'
    } else {
      readOptionsSort.style.cssText = 'opacity: 0'
    }

    //Configurar informações
    if (noteousMain.length > 0) {
      subcontext = 'has-notes'
    } else {
      subcontext = 'no-notes'
    }
    infoPanel.innerHTML = ''
    infoPanel.append(dateElement(), infoElement(subcontext, getRandom()))
  } else if (context == 'load') {
    //Backup Inteligente de Nota
    //Verifica se há uma nota não salva
    if (noteousSettings.input != '') {
      if (noteousSettings.noteId != 0) {
        if (confirm('Você estava editando uma nota, deseja recuperá-la?')) {
          openNote(noteousSettings.noteId)
          writeInput.value = noteousSettings.input
        } else {
          noteousSettings.input = ''
          noteousSettings.noteId = 0
        }
      } else {
        if (confirm('Há uma nota não salva. Deseja recuperá-la?')) {
          writeInput.value = noteousSettings.input
          writeInput.focus()
        } else {
          noteousSettings.input = ''
        }
      }
    }

    ////////////////////////////

    //exibir/ocultar readOptions
    if (noteousMain.length > 1) {
      readOptionsSort.style.cssText = 'opacity: 1'
    } else {
      readOptionsSort.style.cssText = 'opacity: 0'
    }

    ////////////////////////////

    //Configurar informações
    if (noteousMain.length > 0) {
      subcontext = 'has-notes'
    } else {
      subcontext = 'no-notes'
    }
    infoPanel.innerHTML = ''
    infoPanel.append(dateElement(), infoElement(subcontext, getRandom()))
  } else if (context == 'on-change-input') {
    //Habilitar/Desabilitar Botão Adicionar Nota
    if (writeInput.value === '') {
      writeButtonAdd.disabled = true
      writeButtonAdd.setAttribute('aria-hidden', 'true')
    } else {
      writeButtonAdd.disabled = false
      writeButtonAdd.setAttribute('aria-hidden', 'false')
    }

    //Backup Inteligente de Nota
    if (editMode == false) {
      noteousSettings.input = writeInput.value
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (editMode == true) {
      noteousSettings.input = writeInput.value
      noteousSettings.noteId = noteIdEdit
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }

    //Redimensionamento Inteligente do Campo de Input
    //Verifica quantas linhas há no Campo de Input
    let input = noteousSettings.input
    let newLines
    if (input.match(/\n/g) == null) {
      //se não houver novas linhas (/n) --> esvazia variável newLines que indica quantidade de linhas
      newLines = ['']
    } else {
      newLines = input.match(/\n/g) //se houver linhas, informa quantidade na variável newLines
    }

    //Aplica novo tamanho se tiver 2 linhas OU mais de 120 caracteres
    if (editMode == false) {
      if (newLines.length > 2 || writeInput.value.length > 120) {
        writeInput.classList.add('edit-mode')
        writePanel.classList.add('edit-mode')
      } else if (newLines.length < 2 || writeInput.value.length < 120) {
        writeInput.classList.remove('edit-mode')
        writePanel.classList.remove('edit-mode')
      }
    }
  }
}

//////////

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

function sortNotes(context) {
  if (context == 'retrieveSort') {
    if (noteousSettings.sort == 'recent') {
      readNotesList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Recente primeiro')
      )
    } else if (noteousSettings.sort == 'old') {
      readNotesList.style.cssText =
        'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Antigo primeiro')
      )
    }
  } else {
    if (noteousSettings.sort == 'recent') {
      readNotesList.style.cssText =
        'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

      readOptionsSort.innerHTML = ''
      readOptionsSort.append(
        document.createTextNode('Ordenando por: Antigo primeiro')
      )
      noteousSettings.sort = 'old'
      renderNote()
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (noteousSettings.sort == 'old') {
      readNotesList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

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

function renderNote(context, noteId) {
  if (context == 'render-all') {
    readNotesList.innerHTML = ''

    for (let note of noteousMain) {
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
      let deleteActionButton = document.createElement('button')
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
      noteTextContainer.setAttribute('aria-label', `Anotação:${note.text}`)
      noteTextContainer.setAttribute(
        'onkeyup',
        `if (event.key === 'Enter') { openNote(${note.id}); }`
      )

      deleteActionButton.tabIndex = tabIndexCounter += 1
      deleteActionButton.setAttribute('aria-label', 'Concluir nota')
      deleteActionButton.setAttribute(
        'onkeyup',
        `if (event.key === 'Enter') { deleteNote(${note.id}); }`
      )

      //APPENDS
      actionButtonsContainer.appendChild(deleteActionButton)
      noteTextContainer.appendChild(textElement)
      noteDateContainer.appendChild(dateElement)
      noteTextContainer.appendChild(noteDateContainer)

      noteContainer.appendChild(actionButtonsContainer)
      noteContainer.appendChild(noteTextContainer)

      readNotesList.appendChild(noteContainer)
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

        deleteActionButton.tabIndex = tabIndexCounter += 1
        deleteActionButton.setAttribute('aria-label', 'Concluir nota')
        deleteActionButton.setAttribute(
          'onkeyup',
          `if (event.key === 'Enter') { deleteNote(${note.id}); }`
        )

        //APPENDS
        actionButtonsContainer.appendChild(deleteActionButton)
        noteTextContainer.appendChild(textElement)
        noteDateContainer.appendChild(dateElement)
        noteTextContainer.appendChild(noteDateContainer)

        noteContainer.appendChild(actionButtonsContainer)
        noteContainer.appendChild(noteTextContainer)

        readNotesList.prepend(noteContainer)
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
    writeInput.focus()
    orblendEngine('on-change-input')
  }
}

writeButtonAdd.addEventListener('click', addNote)

writeInput.addEventListener('input', () => {
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
          //note.orb = 'done'
          noteousMain.splice(noteousMain.indexOf(note), 1)
        }
      }

      localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
      orblendEngine('change')
    }, 100)
  }, 2000)

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

  actionButtonsContainer.style.cssText = 'opacity: 0;'
  noteDateContainer.style.cssText = 'opacity: 0;'
}

//////////

//ABRIR NOTA
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
    labelWrite.innerHTML = '📄 Veja aqui sua nota'
    editNote(noteId)
    writeInput.addEventListener('click', writeInputEdit, false)
  } else if (window.screen.width >= 601) {
    writeInput.focus()
    writeButtonCancelEdit.removeAttribute('hidden')
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
      writeOptions.classList.add('edit-mode')
      writeInput.classList.add('edit-mode')
      readSection.classList.add('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)
      writePanel.classList.add('edit-mode')

      infoPanel.innerHTML = ''

      writeButtonAdd.setAttribute('hidden', 'true')

      writeInput.value = note.text //coloca o texto da nota dentro do campo de input

      writeInput.addEventListener('input', () => {
        if (editMode == true) {
          if (writeInput.value == note.text) {
            writeButtonEdit.setAttribute('hidden', 'true')
            writeButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrievePriorityBlurInput', noteousSettings.priority)
          } else if (writeInput.value != note.text) {
            writeButtonEdit.removeAttribute('hidden')
            writeButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrievePriority', noteousSettings.priority)
          }
        }
      })

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
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
