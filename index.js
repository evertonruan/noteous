// ELEMENTOS /////////////////////////////////////

let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteId = document.querySelector('#note-id')
let noteList = document.querySelector('#read-notes-list')

let pos

let enoteObject = JSON.parse(localStorage.getItem('Enote')) || []

renderNote()

//FUNÇÕES /////////////////////////////////////

//Habilitar/desabilitar botão Adicionar
noteButtonAdd.disabled = true
noteInput.addEventListener('input', function (event) {
  if (noteInput.value === '') {
    noteButtonAdd.disabled = true
  } else {
    noteButtonAdd.disabled = false
  }
})

function renderNote() {
  noteList.innerHTML = ''

  for (let note of enoteObject) {
    let noteLi = document.createElement('li')
    let noteText = document.createTextNode(note.text)

    pos = enoteObject.indexOf(note)

    //DELETE
    let deleteLink = document.createElement('a')
    deleteLink.classList.add('material-icons')
    deleteLink.setAttribute('href', '#')
    deleteLink.setAttribute('onclick', 'deleteNote(' + pos + ')')
    let deleteText = document.createTextNode('check_circle')
    deleteLink.appendChild(deleteText)
    noteLi.appendChild(deleteLink)

    //EDIT
    let editLink = document.createElement('a')
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

function addNote(noteButtonAdd) {
  let noteInputValue = noteInput.value

  if (noteInputValue || '') {
    let objDo = {
      text: noteInputValue
    }

    enoteObject.push(objDo)

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
  for (let note of enoteObject) {
    if (enoteObject.indexOf(note) == pos) {
      let editedNote = ''
      editedNote = window.prompt('Editar nota', note.text)
      if (editedNote != '' && editedNote != null) {
        let objDo = {
          text: editedNote
        }

        enoteObject.splice(pos, 1, objDo)

        localStorage.setItem('Enote', JSON.stringify(enoteObject))
        renderNote()
      }
    }
  }
}
