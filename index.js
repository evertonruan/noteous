// ELEMENTOS /////////////////////////////////////
let body = document.querySelector('body')

let themeButton = document.querySelector('#theme-container')

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
let readOptionsSort = document.querySelector('#read-options-sort')
let noteList = document.querySelector('#read-notes-list')

// VARIÁVEIS IMPORTANTES /////////////////////////////////////

let currentVersion = 1.3
let noteIdEdit //usada para confirmar qual nota está sendo editada
let editMode = false

import orblendEngine from './orblend-engine.js'

///////////////////////////////////////////////////////////////

//INICIALIZAÇÃO //////////////////////////////////////////////

let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))
console.log(localStorage)

getSettings()
renderNote('render-all')
orblendEngine('load')

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
        priority: 'solid',
        input: ''
      }
      welcomeToNoteous('new-version')
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else {
      //SE NÃO HÁ NOVA VERSÃO

      //Aplica última ordenação
      sortNotes('retrieveSort')
      //Aplica último tema
      setTheme('retrieveTheme')

      //Verifica se há uma nota não salva
      if (noteousSettings.input != '') {
        if (confirm('Há uma nota não salva. Deseja recuperá-la?')) {
          noteInput.value = noteousSettings.input
        } else {
          noteousSettings.input = ''
        }
      }
    }
  } else if (noteousSettings == null) {
    //NÃO HÁ CONFIGURAÇÕES --> PRIMEIRO ACESSO AO NOTEOUS
    noteousSettings = {
      noteousVersion: currentVersion,
      sort: 'recent',
      priority: 'solid',
      input: ''
    }
    welcomeToNoteous('first-access')
    localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
  }
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
      writeOptions.style.cssText =
        'border-style: solid; opacity: 0; transform: scale(60%);'
    } else if (priority == 'double') {
      writeOptions.style.cssText =
        'border-style: double;  opacity: 0; transform: scale(60%);'
    } else if (priority == 'dotted') {
      writeOptions.style.cssText =
        'border-style: dotted;  opacity: 0; transform: scale(60%);'
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
function renderNote(context, noteId, orbId) {
  if (context == 'render-all') {
    noteList.innerHTML = ''

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

      //APPENDS
      actionButtonsContainer.appendChild(deleteActionButton)
      noteTextContainer.appendChild(textElement)
      noteDateContainer.appendChild(dateElement)
      noteTextContainer.appendChild(noteDateContainer)

      noteContainer.appendChild(actionButtonsContainer)
      noteContainer.appendChild(noteTextContainer)

      noteList.appendChild(noteContainer)

      orblendEngine('change')
    }

    setTimeout(() => {
      //css inicia em 0. Após renderizar, altera para 1
      readPanel.style.cssText = 'opacity: 1; transform: translateY(-10px);'
    }, 300)
  } else if (context == 'add') {
    console.log(noteId)
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

  //Recuperar nota não salva
  noteousSettings.input = noteInput.value
  localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

  //Verifica quantas linhas há
  let input = noteousSettings.input
  newLines = input.match(/\n/g)
  console.log(newLines)
  if (newLines.length > 1) {
    noteInput.classList.add('edit-mode')
    writePanel.classList.add('edit-mode')
  } else {
    noteInput.classList.remove('edit-mode')
    writePanel.classList.remove('edit-mode')
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

    renderNote('add', objNote.id)
    noteInput.value = ''
    noteInput.focus()
    noteButtonAdd.disabled = true
  }
}

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
  textElement.innerHTML = 'Nota concluída. Clique para Desfazer'
  actionButtonsContainer.style.cssText = 'opacity: 0;'
  noteDateContainer.style.cssText = 'opacity: 0;'
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

      infoPanel.classList.toggle('edit-mode')

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

  infoPanel.classList.toggle('edit-mode')

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
