// ELEMENTOS /////////////////////////////////////

var noteInput = document.querySelector('#noteInput')
var noteButtons = document.querySelector('.noteButtons')
var noteButtonEdit = document.querySelector('#noteButtonEdit')
var noteButtonDo = document.querySelector('#Do')
var posId = document.querySelector('#posId')
var noteInputEdit = document.querySelector('#noteInputEdit')
var editWindowBack = document.querySelector('#editWindowBack')
var editWindow = document.querySelector('#editWindow')

var listDo = document.querySelector('#listDo')
var pos
var editPos

var enoteObjectDo = JSON.parse(localStorage.getItem('EnoteDo')) || []

renderNote()

//FUNÇÕES /////////////////////////////////////

function addNote(noteButtons) {
  if (noteButtons.id == 'noteButtonDo') {
    var noteInputValue = noteInput.value

    if (noteInputValue || '') {
      var objDo = {
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

  for (var note in enoteObjectDo) {
    for (var prop in enoteObjectDo[note]) {
      //percorre cada objeto encontrado
      var noteLi = document.createElement('li')
      var noteText = document.createTextNode(enoteObjectDo[note][prop])

      pos = enoteObjectDo.indexOf(enoteObjectDo[note])

      var deleteLink = document.createElement('a')
      deleteLink.classList.add('material-icons')
      deleteLink.setAttribute('href', '#')
      deleteLink.setAttribute('onclick', 'deleteNoteDo(' + pos + ')')
      var deleteText = document.createTextNode('check_circle')
      deleteLink.appendChild(deleteText)
      noteLi.appendChild(deleteLink)

      /*
      var editLink = document.createElement('a')
      editLink.classList.add('material-icons')
      editLink.setAttribute('href', '#')
      editLink.setAttribute('onclick', 'editNoteDo(' + pos + ')')
      var editText = document.createTextNode('edit')
      editLink.appendChild(editText)
      noteLi.appendChild(editLink)
      */

      var newLine = document.createElement('br')
      noteLi.appendChild(newLine)

      noteLi.appendChild(noteText) //coloca a variavel do input dentro do li

      listDo.appendChild(noteLi) //adiciona li dentro do ul*/
    }
  }
}

function deleteNoteDo(pos) {
  enoteObjectDo.splice(pos, 1)

  localStorage.setItem('EnoteDo', JSON.stringify(enoteObjectDo))
  renderNote()
}

function editNoteDo(pos) {
  console.log(pos)
  editWindow.style.visibility = 'visible'
  editWindowBack.style.visibility = 'visible'
  enoteObjectDoOpened = enoteObjectDo[pos]
  for (var note in enoteObjectDoOpened) {
    console.log(posId.value)
    noteInputEdit.value = enoteObjectDoOpened[note]
    posId.value = pos
    console.log(posId.value)
  }
}

function setEditNoteDo() {
  var noteInputValue = noteInputEdit.value
  var objDo = {
    text: noteInputValue
  }

  enoteObjectDo.splice(posId.value, 1, objDo)
  console.log(enoteObjectDo)

  localStorage.setItem('EnoteDo', JSON.stringify(enoteObjectDo))
  renderNote()
  noteInputEdit.value = ''
  editWindow.style.visibility = 'hidden'
  editWindowBack.style.visibility = 'hidden'
}
