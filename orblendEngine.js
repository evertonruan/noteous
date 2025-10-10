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
    // Ensure install button is present if eligible after info panel refresh
    placeInstallButton()
  } else if (context == 'load') {
    //Backup Inteligente de Nota
    //Verifica se há uma nota não salva
    if (noteousSettings.input != '') {
      if (noteousSettings.noteId != 0) {
        openNote(noteousSettings.noteId)
        writeInput.value = noteousSettings.input
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
    // Ensure install button is present if eligible on first load
    placeInstallButton()
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
