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
          noteInput.value = noteousSettings.input
        } else {
          noteousSettings.input = ''
          noteousSettings.noteId = 0
        }
      } else {
        if (confirm('Há uma nota não salva. Deseja recuperá-la?')) {
          noteInput.value = noteousSettings.input
          noteInput.focus()
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
    if (noteInput.value === '') {
      noteButtonAdd.disabled = true
    } else {
      noteButtonAdd.disabled = false
    }

    //Backup Inteligente de Nota
    if (editMode == false) {
      noteousSettings.input = noteInput.value
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      console.log(noteousSettings.input)
    } else if (editMode == true) {
      noteousSettings.input = noteInput.value
      noteousSettings.noteId = noteIdEdit
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      console.log(noteousSettings.input)
      console.log(noteousSettings.noteId)
    }

    //Redimensionamento Inteligente do Campo de Input
    //Verifica quantas linhas há no Campo de Input
    let input = noteousSettings.input
    let newLines
    if (input.match(/\n/g) == null) {
      newLines = ['']
    } else {
      newLines = input.match(/\n/g)
    }

    //Aplica novo tamanho se tiver 2 linhas OU mais de 120 caracteres
    if (editMode == false) {
      if (newLines.length > 2 || noteInput.value.length > 120) {
        noteInput.classList.add('edit-mode')
        writePanel.classList.add('edit-mode')
      } else if (newLines.length < 2 || noteInput.value.length < 120) {
        noteInput.classList.remove('edit-mode')
        writePanel.classList.remove('edit-mode')
      }
    }
  }
}
