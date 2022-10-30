// ELEMENTOS /////////////////////////////////////

let settingsButton = document.querySelector('#nav-settings')
let themeButton = document.querySelector('#theme-container')

let welcomePanel = document.querySelector('#welcome-panel')
let welcomeTextContainer = document.querySelector('#welcome-text-container')
let labelWrite = document.querySelector('#write-label')
let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteButtonEdit = document.querySelector('#write-button-edit')
let noteButtonCancelEdit = document.querySelector('#write-button-cancel')
let noteList = document.querySelector('#read-notes-list')

let settingsSection = document.querySelector('#section-settings')
let readOptionsSort = document.querySelector('#read-options-sort')
let readSection = document.querySelector('#section-read')
let writeSection = document.querySelector('#section-write')
let writePanel = document.querySelector('#write-panel')
let body = document.querySelector('body')

/////////////

let noteIdEdit

//INICIALIZAÇÃO: coletar dados do LocalStorage

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []

showWelcome()
getSettings()
renderNote()

//////////////////////////////////////////

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

//INICIALIZAÇÃO
//Verifica se é o primeiro acesso. Se for, adiciona o tema claro e exibe tela de boas vindas
//Se já acessou, verifica qual foi o último tema salvo e aplica ele
let theme = JSON.parse(localStorage.getItem('theme'))
if (theme == null) {
  //se o tema é null, isso significa que o noteous nunca foi aberto, então --> aplicará tema claro + exibirá tela de boas vindas
  themeLight()

  //Configuração da tela de Boas vindas (noteous 1.0)

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
  greetingTitle1.append(document.createTextNode('Enote agora é'))

  let greetingTitleIcon = document.createElement('img')
  greetingTitleIcon.setAttribute('src', './img/logo-icon.png')
  greetingTitleIcon.classList.add('greeting-title-icon')

  greetingTitle2 = document.createElement('p')
  greetingTitle2.classList.add('greeting-title2')
  greetingTitle2.append(document.createTextNode('noteous'))
  greetingSectionTitle.append(greetingTitleIcon, greetingTitle2)

  ////////////////////

  let greetingDescriptionTitle = document.createElement('p')
  greetingDescriptionTitle.classList.add('greeting-description-title')
  greetingDescriptionTitle.append(document.createTextNode('O que há de novo'))
  let greetingDescriptionUl = document.createElement('ul')
  let greetingDescriptionLi1 = document.createElement('li')
  let greetingDescriptionLi2 = document.createElement('li')
  let greetingDescriptionLi3 = document.createElement('li')
  let greetingDescriptionLi4 = document.createElement('li')
  let greetingDescriptionLi5 = document.createElement('li')
  let greetingDescriptionLi6 = document.createElement('li')

  greetingDescriptionLi1.classList.add('greeting-description-point')
  greetingDescriptionLi2.classList.add('greeting-description-point')
  greetingDescriptionLi3.classList.add('greeting-description-point')
  greetingDescriptionLi4.classList.add('greeting-description-point')
  greetingDescriptionLi5.classList.add('greeting-description-point')
  greetingDescriptionLi6.classList.add('greeting-description-point')

  greetingDescriptionLi1.append(
    document.createTextNode(
      'Temas: personalize sua experiência com o novo suporte a temas. Escolha entre claro e escuro'
    )
  )
  greetingDescriptionLi2.append(
    document.createTextNode(
      'Novo suporte a datas: agora quando você adiciona uma nota, verá também a data e hora em que ela foi criada. Inclusive, se editar a nota, também verá a data da última edição'
    )
  )
  greetingDescriptionLi3.append(
    document.createTextNode(
      'Novo design de notas: veja todas as suas anotações com um design atualizado'
    )
  )
  greetingDescriptionLi4.append(
    document.createTextNode(
      'Melhoria ao editar notas: agora você pode editar uma anotação simplesmente tocando ou clicando nela'
    )
  )
  greetingDescriptionLi5.append(
    document.createTextNode(
      'Essa atualização também inclui diversas melhorias internas'
    )
  )

  greetingDescriptionLi6.append(
    document.createTextNode(
      'IMPORTANTE: Se você já utilizava o Enote, poderá transferir manualmente suas notas para o noteous. Clique em Saiba Mais para obter instruções'
    )
  )

  greetingDescriptionUl.append(
    greetingDescriptionLi1,
    greetingDescriptionLi2,
    greetingDescriptionLi3,
    greetingDescriptionLi4,
    greetingDescriptionLi5,
    greetingDescriptionLi6
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
} else if (theme.themeLum == 'light') {
  themeLight()
} else if (theme.themeLum == 'dark') {
  themeDark()
}

themeButton.addEventListener('click', () => {
  //verifica qual tema está ativo e muda para outro
  let theme = JSON.parse(localStorage.getItem('theme'))
  if (theme.themeLum == 'light') {
    themeDark()
  } else if (theme.themeLum == 'dark') {
    themeLight()
  }
})

//FUNÇÕES /////////////////////////////////////

//GETSETTINGS --> ao atualizar página, recupera dados salvos
function getSettings() {
  let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
  if (noteousSettings == null) {
    let noteousSettings = { sort: 'recent' }
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  } else if (noteousSettings.sort == 'recent') {
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

//RENDERIZAR NOTAS

//BOTÃO ORDENAR NOTAS
readOptionsSort.addEventListener('click', sortNotes)

function sortNotes() {
  let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
  if (noteousSettings.sort == 'recent') {
    noteList.style.cssText =
      'flex-wrap: wrap-reverse; flex-direction: row-reverse;'

    readOptionsSort.innerHTML = ''
    readOptionsSort.append(
      document.createTextNode('Ordenando por: Antigo primeiro')
    )
    noteousSettings = { sort: 'old' }
    renderNote()
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  } else if (noteousSettings.sort == 'old') {
    noteList.style.cssText = 'flex-wrap: wrap; flex-direction: row;'

    readOptionsSort.innerHTML = ''
    readOptionsSort.append(
      document.createTextNode('Ordenando por: Recente primeiro')
    )
    noteousSettings = { sort: 'recent' }
    renderNote()
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  }
}

function renderNote() {
  noteList.innerHTML = ''

  for (let note of noteousMain) {
    let noteContainer = document.createElement('div')
    noteContainer.classList.add('note-container')
    noteContainer.setAttribute('onclick', `openNote(${note.id})`)

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
      text: noteInput.value
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

//ABRIR NOTA
function openNote(noteId) {
  if (window.screen.width <= 600) {
    noteInput.setAttribute('readonly', true)
    noteInput.focus()
    editNote(noteId)
  } else if (window.screen.width >= 601) {
    noteInput.focus()
    editNote(noteId)
  }
}

//EDITAR NOTA

function editNote(noteId) {
  for (let note of noteousMain) {
    noteIdEdit = noteId
    if (note.id === noteId) {
      //Entra no Modo de edição
      noteInput.classList.toggle('edit-mode')
      readSection.classList.toggle('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)
      writePanel.classList.toggle('edit-mode')

      welcomeTextContainer.setAttribute('hidden', 'true')
      welcomePanel.classList.toggle('edit-mode')

      noteButtonAdd.setAttribute('hidden', 'true')
      noteButtonEdit.removeAttribute('hidden')
      noteButtonCancelEdit.removeAttribute('hidden')

      noteInput.removeAttribute('readonly')
      noteInput.value = note.text //coloca o texto da nota dentro do campo de input
      labelWrite.innerHTML = '📝 Edite aqui sua nota'

      //Se durante Modo de edição clicar em "Confirmar edição"
      noteButtonEdit.addEventListener('click', () => {
        if (noteInput.value != '' && noteInput.value != null) {
          for (let note of noteousMain) {
            if (note.id === noteIdEdit) {
              note.text = noteInput.value
              note.editedAt = Date.now()
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
  writePanel.classList.toggle('edit-mode')
  readSection.classList.toggle('edit-mode')
  noteInput.classList.toggle('edit-mode')
  noteInput.value = ''

  welcomePanel.classList.toggle('edit-mode')
  welcomeTextContainer.removeAttribute('hidden')

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
