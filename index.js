// ELEMENTOS /////////////////////////////////////

let labelWrite = document.querySelector('#write-label')
let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteButtonEdit = document.querySelector('#write-button-edit')
let noteButtonCancelEdit = document.querySelector('#write-button-cancel')
let noteList = document.querySelector('#read-notes-list')
let readSection = document.querySelector('#section-read')

let pos
let noteId

let enoteObject = JSON.parse(localStorage.getItem('Enote')) || []

renderNote()

//FUNÇÕES /////////////////////////////////////

//RENDERIZAR NOTAS

function renderNote() {
  noteList.innerHTML = ''

  for (let note of enoteObject) {
    let noteLi = document.createElement('li')
    let noteText = document.createTextNode(note.text)

    pos = enoteObject.indexOf(note)

    //DELETE
    let deleteLink = document.createElement('a')
    deleteLink.classList.add('action-buttons')
    deleteLink.classList.add('material-icons')
    deleteLink.setAttribute('href', '#')
    deleteLink.setAttribute('onclick', 'deleteNote(' + pos + ')')
    let deleteText = document.createTextNode('check_circle')
    deleteLink.appendChild(deleteText)
    noteLi.appendChild(deleteLink)

    //EDIT
    let editLink = document.createElement('a')
    editLink.classList.add('action-buttons')
    editLink.classList.add('material-icons')
    editLink.setAttribute('href', '#')
    editLink.setAttribute('onclick', 'editNote(' + pos + ')')
    let editText = document.createTextNode('edit')
    editLink.appendChild(editText)
    noteLi.appendChild(editLink)

    let newLine = document.createElement('br')
    noteLi.appendChild(newLine)
    noteLi.appendChild(noteText)
    noteList.appendChild(noteLi)
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

function addNote() {
  let noteInputValue = noteInput.value

  if (noteInputValue || '') {
    let objDo = {
      text: noteInputValue
    }

    enoteObject.unshift(objDo)

    localStorage.setItem('Enote', JSON.stringify(enoteObject))

    renderNote()
    noteInput.value = ''
    noteInput.focus()
    noteButtonAdd.disabled = true
  }
}

function deleteNote(pos) {
  enoteObject.splice(pos, 1)

  localStorage.setItem('Enote', JSON.stringify(enoteObject))
  renderNote()
}

function editNote(pos) {
  noteId = pos //noteId --> variável para identificar índice da nota
  for (let note of enoteObject) {
    if (enoteObject.indexOf(note) == noteId) {
      //Entra no Modo de edição
      noteInput.classList.toggle('edit-mode')
      readSection.classList.toggle('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)

      noteButtonAdd.setAttribute('hidden', 'true')
      noteButtonEdit.removeAttribute('hidden')
      noteButtonCancelEdit.removeAttribute('hidden')

      noteInput.focus()
      noteInput.value = note.text //coloca o texto da nota dentro do campo de input
      labelWrite.innerHTML = 'Edite aqui sua nota'

      //Se durante Modo de edição clicar em "Confirmar edição"
      noteButtonEdit.addEventListener('click', function (event) {
        if (noteInput.value != '' && noteInput.value != null) {
          let objDo = {
            text: noteInput.value
          }

          enoteObject.splice(noteId, 1, objDo)

          localStorage.setItem('Enote', JSON.stringify(enoteObject))

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
  readSection.classList.toggle('edit-mode')
  noteInput.classList.toggle('edit-mode')
  noteInput.value = ''

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
