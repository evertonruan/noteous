// ELEMENTOS /////////////////////////////////////

let labelWrite = document.querySelector('#write-label')
let noteInput = document.querySelector('#write-input')
let noteButtonAdd = document.querySelector('#write-button-add')
let noteButtonEdit = document.querySelector('#write-button-edit')
let noteButtonCancelEdit = document.querySelector('#write-button-cancel')
let noteList = document.querySelector('#read-notes-list')

let readSection = document.querySelector('#section-read')
let writePanel = document.querySelector('#write-panel')

let pos
let notePos

let enoteObject = JSON.parse(localStorage.getItem('Enote')) || []

renderNote()

//FUNÇÕES /////////////////////////////////////

//RENDERIZAR NOTAS

function renderNote() {
  noteList.innerHTML = ''

  for (let note of enoteObject) {
    note.id = Date.now() + enoteObject.indexOf(note)
  }

  localStorage.setItem('Enote', JSON.stringify(enoteObject))

  enoteAllNotes = JSON.stringify(enoteObject)

    let noteP = document.createElement('p')
    noteP.classList.add('enote-all-notes-p')
    let noteText = document.createTextNode(enoteAllNotes)
    noteP.appendChild(noteText)
    noteList.appendChild(noteP)
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
  if (noteInput.value || '') {
    let objNote = {
      text: noteInput.value
    }

    enoteObject.unshift(objNote)

    localStorage.setItem('Enote', JSON.stringify(enoteObject))

    renderNote()
    noteInput.value = ''
    noteInput.focus()
    noteButtonAdd.disabled = true
  }
}

//APAGAR NOTA

function deleteNote(pos) {
  enoteObject.splice(pos, 1)

  localStorage.setItem('Enote', JSON.stringify(enoteObject))
  renderNote()
}

//EDITAR NOTA

function editNote(pos) {
  notePos = pos //notePos --> variável para identificar índice da nota
  for (let note of enoteObject) {
    if (enoteObject.indexOf(note) == notePos) {
      //Entra no Modo de edição
      noteInput.classList.toggle('edit-mode')
      readSection.classList.toggle('edit-mode') //coloca a seção de leitura das nota no modo de edição (que desabilita as ações das notas enquanto uma nota está sendo editada)
      writePanel.classList.toggle('edit-mode')

      noteButtonAdd.setAttribute('hidden', 'true')
      noteButtonEdit.removeAttribute('hidden')
      noteButtonCancelEdit.removeAttribute('hidden')

      noteInput.focus()
      noteInput.value = note.text //coloca o texto da nota dentro do campo de input
      labelWrite.innerHTML = 'Edite aqui sua nota'

      //Se durante Modo de edição clicar em "Confirmar edição"
      noteButtonEdit.addEventListener('click', function (event) {
        if (noteInput.value != '' && noteInput.value != null) {
          let objNote = {
            text: noteInput.value
          }

          enoteObject.splice(notePos, 1, objNote)

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
  writePanel.classList.toggle('edit-mode')
  readSection.classList.toggle('edit-mode')
  noteInput.classList.toggle('edit-mode')
  noteInput.value = ''

  noteButtonAdd.removeAttribute('hidden')
  noteButtonAdd.disabled = true
  noteButtonEdit.setAttribute('hidden', 'true')
  noteButtonCancelEdit.setAttribute('hidden', 'true')
  labelWrite.innerHTML = 'Qual o próximo passo?'
}
