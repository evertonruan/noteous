// ELEMENTOS /////////////////////////////////////
let body = document.querySelector('body')

let themeButton = document.querySelector('#theme-container')

//WRITE-SECTION
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')

let welcomePanel = document.querySelector('#welcome-panel')
let welcomeTextContainer = document.querySelector('#welcome-text-container')

let writeOptions = document.querySelector('#write-options')

let labelWrite = document.querySelector('#write-label')
let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteButtonEdit = document.querySelector('#write-button-edit')
let noteButtonCancelEdit = document.querySelector('#write-button-cancel')

//READ-SECTION
let readSection = document.querySelector('#section-read')
let readOptionsSort = document.querySelector('#read-options-sort')
let noteList = document.querySelector('#read-notes-list')

// VARIÁVEIS IMPORTANTES /////////////////////////////////////

let currentVersion = 1.3
let noteIdEdit //usada para confirmar qual nota está sendo editada
let editMode = false

///////////////////////////////////////////////////////////////

//INICIALIZAÇÃO //////////////////////////////////////////////

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

getSettings()
renderNote()
showWelcome()

/////////////////////////////////////////////////////////////

//welcomeToNoteous --> ao acessar 1ª vez ou nova versão
function welcomeToNoteous(context) {
  setTheme('setThemeLight')
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
        'Temas: personalize sua experiência com o novo suporte a temas. Escolha entre claro e escuro'
      )
    )
    greetingDescriptionLi2.append(
      document.createTextNode(
        'Organize suas tarefas por prioridade: quando adicionar uma nota é só tocar ou clicar no círculo ° para trocar entre diferentes bordas, que representam prioridades.'
      )
    )
    greetingDescriptionLi3.append(
      document.createTextNode(
        'Melhoria ao editar notas: agora você pode editar uma anotação simplesmente tocando ou clicando nela'
      )
    )
    greetingDescriptionLi4.append(
      document.createTextNode(
        'IMPORTANTE: Se você já utilizava o Enote, poderá transferir manualmente suas notas para o noteous. Clique em Saiba Mais para obter instruções'
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
    greetingTitle2.append(document.createTextNode('noteous 1.3'))
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
        'Novo recurso: Prioridade de notas • Organize melhor suas tarefas com este recurso! Ao adicionar ou editar uma nota, toque/clique no círculo ° que aparecer no canto. Você poderá escolher entre 3 tipos de borda, que representam prioridades diferentes.'
      )
    )
    greetingDescriptionLi2.append(
      document.createTextNode(
        'Melhoria: ao editar uma nota, o botão de "Confirmar" só vai aparecer quando você fizer alguma alteração.'
      )
    )
    greetingDescriptionLi3.append(
      document.createTextNode(
        'Melhoria: Se você usa o noteous no celular, vai gostar disso: ao abrir uma nota o teclado não vai aparecer junto. Se quiser editar a nota é só tocar novamente e o teclado irá abrir.'
      )
    )
    greetingDescriptionLi4.append(
      document.createTextNode(
        'Você não vai notar, mas várias revisões foram feitas no código interno!'
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
    btnNext.appendChild(document.createTextNode('Atualizar noteous'))
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
function setTheme(context) {
  //context => recuperar tema, trocar tema, aplicar tema claro, aplicar tema escuro
  if (context == 'retrieveTheme') {
    if (noteousSettings.theme.themeLum == 'light') {
      setTheme('setThemeLight')
      console.log(context)
    } else if (noteousSettings.theme.themeLum == 'dark') {
      setTheme('setThemeDark')
    }
  } else if (context == 'changeTheme') {
    console.log(context)
    if (noteousSettings.theme.themeLum == 'light') {
      setTheme('setThemeDark')
    } else if (noteousSettings.theme.themeLum == 'dark') {
      setTheme('setThemeLight')
    }
  } else if (context == 'setThemeLight') {
    console.log(context)
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
  } else if (context == 'setThemeDark') {
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

themeButton.addEventListener('click', () => {
  setTheme('changeTheme')
})

//FUNÇÕES /////////////////////////////////////

//GETSETTINGS --> ao atualizar página, recupera dados salvos
function getSettings() {
  //JÁ ACESSOU NOTEOUS --> recupera dados
  if (noteousSettings != null) {
    if (noteousSettings.noteousVersion != currentVersion) {
      //VERIFICA SE HÁ NOVA VERSÃO
      noteousSettings = {
        noteousVersion: currentVersion,
        sort: 'recent',
        priority: 'solid'
      }
      welcomeToNoteous('new-version')
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else {
      //SE NÃO HÁ NOVA VERSÃO

      //Aplica última ordenação
      sortNotes('retrieveSort')
      //Aplica último tema
      setTheme('retrieveTheme')
    }
  } else if (noteousSettings == null) {
    //NÃO HÁ CONFIGURAÇÕES --> PRIMEIRO ACESSO AO NOTEOUS
    noteousSettings = {
      noteousVersion: currentVersion,
      sort: 'recent',
      priority: 'solid'
    }
    welcomeToNoteous('first-access')
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  }
}

//MOSTRAR BOAS VINDAS
function showWelcome() {
  let dateNow = new Date()
  let welcomeText = document.createTextNode(
    `Olá! Hoje é ${findWeek(new Date(dateNow).getDay())}, ${new Date(
      dateNow
    ).getDate()} de ${findMonth(new Date(dateNow).getMonth())}`
  )
  welcomeTextContainer.append(welcomeText)
}

//OPÇÕES DE NOTA
//Ao carregar, Define prioridade = solid, Salva nas configurações e Aplica
noteousSettings.priority = 'solid'
localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
notePriority('retrievePriority', noteousSettings.priority)

function notePriority(context, priority) {
  //context ==> recuperar prioridade, recuperar prioridade ao tirar foco do input(ao tirar foco define opacidade = 0 de Opções da Nota. Mas, é necessário também definir junto a borda, pois ao contrário um sobrescreve o outro), trocar prioridade
  if (context == 'retrievePriority') {
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
  } else if (context == 'retrievePriorityBlurInput') {
    if (priority == 'solid') {
      writeOptions.style.cssText = 'border-style: solid; opacity: 0'
    } else if (priority == 'double') {
      writeOptions.style.cssText = 'border-style: double;  opacity: 0'
    } else if (priority == 'dotted') {
      writeOptions.style.cssText = 'border-style: dotted;  opacity: 0'
    }
  } else if (context == 'changePriority') {
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
    notePriority('retrievePriority', noteousSettings.priority)
  }
})

noteInput.addEventListener('blur', () => {
  if (editMode == false) {
    notePriority('retrievePriorityBlurInput', noteousSettings.priority)
  }
})

writeOptions.addEventListener('click', () => {
  noteInput.focus()
  notePriority('changePriority', noteousSettings.priority)
})

//BOTÃO ORDENAR NOTAS
function sortNotes(context) {
  if (context == 'retrieveSort') {
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

//RENDERIZAR NOTAS
function renderNote() {
  noteList.innerHTML = ''

  for (let note of noteousMain) {
    let noteContainer = document.createElement('div')
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
    actionButtonsContainer.classList.add('action-buttons-container')

    //DELETE
    let deleteActionButton = document.createElement('a')
    deleteActionButton.classList.add('action-buttons', 'material-icons')
    deleteActionButton.setAttribute('href', '#')
    deleteActionButton.setAttribute('onclick', `deleteNote(${note.id})`)
    deleteActionButton.appendChild(document.createTextNode('check_circle'))

    //NOTE TEXT
    let noteTextContainer = document.createElement('div')
    noteTextContainer.classList.add('note-text-container')
    noteTextContainer.setAttribute('onclick', `openNote(${note.id})`)
    let textElement = document.createElement('p')

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
    noteDateContainer.classList.add('note-date-container')
    let dateElement = document.createElement('p')
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

    //APPENDS
    actionButtonsContainer.appendChild(deleteActionButton)
    noteTextContainer.appendChild(textElement)
    noteDateContainer.appendChild(dateElement)
    noteTextContainer.appendChild(noteDateContainer)

    noteContainer.appendChild(actionButtonsContainer)
    noteContainer.appendChild(noteTextContainer)

    noteList.appendChild(noteContainer)
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

//ADICIONAR NOTA

noteButtonAdd.addEventListener('click', addNote)

//Habilitar/desabilitar botão Adicionar
noteButtonAdd.disabled = true
noteInput.addEventListener('input', function (event) {
  if (noteInput.value === '') {
    noteButtonAdd.disabled = true
  } else {
    noteButtonAdd.disabled = false
  }
})

// ADICIONAR NOTA

function addNote() {
  if (noteInput.value || '') {
    let objNote = {
      id: Date.now(),
      text: noteInput.value,
      priority: noteousSettings.priority
    }

    noteousMain.unshift(objNote)

    localStorage.setItem('noteous-main', JSON.stringify(noteousMain))

    renderNote()
    noteInput.value = ''
    noteInput.focus()
    noteButtonAdd.disabled = true
  }
}

//APAGAR NOTA

function deleteNote(noteId) {
  for (let note of noteousMain) {
    if (note.id === noteId) {
      //let indexPosition = noteousMain.indexOf(note)
      noteousMain.splice(noteousMain.indexOf(note), 1)
    }
  }

  localStorage.setItem('noteous-main', JSON.stringify(noteousMain))
  renderNote()
}

//função em variável para 'desbloquear' noteInput se tela é pequena
let noteInputEdit = function (event) {
  noteInput.removeAttribute('readonly')
  labelWrite.innerHTML = '📝 Edite aqui sua nota'
}

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

//EDITAR NOTA

function editNote(noteId) {
  for (let note of noteousMain) {
    noteIdEdit = noteId
    if (note.id === noteId) {
      //Entra no Modo de edição
      editMode = true
      noteInput.classList.toggle('edit-mode')
      readSection.classList.toggle('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)
      writePanel.classList.toggle('edit-mode')

      welcomeTextContainer.setAttribute('hidden', 'true')
      welcomePanel.classList.toggle('edit-mode')

      noteButtonAdd.setAttribute('hidden', 'true')

      noteInput.value = note.text //coloca o texto da nota dentro do campo de input

      noteInput.addEventListener('input', () => {
        if (editMode == true) {
          if (noteInput.value == note.text) {
            noteButtonEdit.setAttribute('hidden', 'true')
            noteButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrievePriorityBlurInput', noteousSettings.priority)
          } else if (noteInput.value != note.text) {
            noteButtonEdit.removeAttribute('hidden')
            noteButtonCancelEdit.removeAttribute('hidden')
            notePriority('retrievePriority', noteousSettings.priority)
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

          renderNote()

          exitEditMode()
        }
      })

      //Se durante Modo de edição clicar em "Cancelar"
      noteButtonCancelEdit.addEventListener('click', exitEditMode)
    }
  }
}

function exitEditMode() {
  editMode = false
  writePanel.classList.toggle('edit-mode')
  readSection.classList.toggle('edit-mode')

  noteInput.classList.toggle('edit-mode')
  noteInput.value = ''
  noteInput.removeAttribute('readonly')
  noteInput.removeEventListener('click', noteInputEdit, false)
  noteousSettings.priority = 'solid'
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  writeOptions.style.cssText = 'border-style: solid; opacity: 0;'
  noteInput.style.cssText = 'border-style: solid;'

  welcomePanel.classList.toggle('edit-mode')
  welcomeTextContainer.removeAttribute('hidden')

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
