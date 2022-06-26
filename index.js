// ELEMENTOS /////////////////////////////////////

let noteInput = document.querySelector('#noteInput')
let noteButtons = document.querySelector('.noteButtons')
let noteButtonEdit = document.querySelector('#noteButtonEdit')
let noteButtonDo = document.querySelector('#Do')
let posId = document.querySelector('#posId')
let noteInputEdit = document.querySelector('#noteInputEdit')
let editWindowBack = document.querySelector('#editWindowBack')
let editWindow = document.querySelector('#editWindow')

let listDo = document.querySelector('#listDo')
let pos
let editPos

let enoteObjectDo = JSON.parse(localStorage.getItem('EnoteDo')) || []

renderNote()

//FUNÇÕES /////////////////////////////////////

function addNote(noteButtons) {
  if (noteButtons.id == 'noteButtonDo') {
    let noteInputValue = noteInput.value

    if (noteInputValue || '') {
      let objDo = {
        text: noteInputValue
      }

      enoteObjectDo.push(objDo)

      localStorage.setItem('EnoteDo', JSON.stringify(enoteObjectDo))

      renderNote()
      noteInput.value = ''
    }
  }
}

function renderNote() {
  listDo.innerHTML = ''

  for (let note of enoteObjectDo) {
    console.log(note.text)
    let noteLi = document.createElement('li')
    let noteText = document.createTextNode(note.text)

    pos = enoteObjectDo.indexOf(note)

    //DELETE
    let deleteLink = document.createElement('a')
    deleteLink.classList.add('material-icons')
    deleteLink.setAttribute('onclick', 'deleteNoteDo(' + pos + ')')
    let deleteText = document.createTextNode('check_circle')
    deleteLink.appendChild(deleteText)
    noteLi.appendChild(deleteLink)

    //EDIT
    let editLink = document.createElement('a')
    editLink.classList.add('material-icons')
    editLink.setAttribute('href', '#')
    editLink.setAttribute('onclick', 'editNoteDo(' + pos + ')')
    let editText = document.createTextNode('edit')
    editLink.appendChild(editText)
    noteLi.appendChild(editLink)

    let newLine = document.createElement('br')
    noteLi.appendChild(newLine)
    noteLi.appendChild(noteText)
    listDo.appendChild(noteLi)
  }
}

/*
  for (let note in enoteObjectDo) {
    for (let prop in enoteObjectDo[note]) {
      //percorre cada objeto encontrado
      let noteLi = document.createElement('li')
      let noteText = document.createTextNode(enoteObjectDo[note][prop])

      pos = enoteObjectDo.indexOf(enoteObjectDo[note])

      let deleteLink = document.createElement('a')
      deleteLink.classList.add('material-icons')
      deleteLink.setAttribute('href', '#')
      deleteLink.setAttribute('onclick', 'deleteNoteDo(' + pos + ')')
      let deleteText = document.createTextNode('check_circle')
      deleteLink.appendChild(deleteText)
      noteLi.appendChild(deleteLink)

      /*
      let editLink = document.createElement('a')
      editLink.classList.add('material-icons')
      editLink.setAttribute('href', '#')
      editLink.setAttribute('onclick', 'editNoteDo(' + pos + ')')
      let editText = document.createTextNode('edit')
      editLink.appendChild(editText)
      noteLi.appendChild(editLink)
      */
/*
      let newLine = document.createElement('br')
      noteLi.appendChild(newLine)

      noteLi.appendChild(noteText) //coloca a letiavel do input dentro do li

      listDo.appendChild(noteLi) //adiciona li dentro do ul
  }
}
*/

function deleteNoteDo(pos) {
  enoteObjectDo.splice(pos, 1)

  localStorage.setItem('EnoteDo', JSON.stringify(enoteObjectDo))
  renderNote()
}

function editNoteDo(pos) {
  console.log(pos)
  for (let note of enoteObjectDo) {
    if (enoteObjectDo.indexOf(note) == pos) {
      let editedNote = ''
      editedNote = window.prompt('Editar nota', note.text)
      if (editedNote != '' && editedNote != null) {
        let objDo = {
          text: editedNote
        }

        enoteObjectDo.splice(pos, 1, objDo)
        console.log(enoteObjectDo)

        localStorage.setItem('EnoteDo', JSON.stringify(enoteObjectDo))
        renderNote()
      }
    }
  }

  /*
  enoteObjectDoOpened = enoteObjectDo[pos]
  for (let note in enoteObjectDoOpened) {
    console.log(posId.value)
    noteInputEdit.value = enoteObjectDoOpened[note]
    
    console.log(posId.value)
  }
  */
}

function setEditNoteDo() {}
