//✨ ORBLEND ENGINE 2.0

function orblendEngine(context, labelMessage, note, orb) {
  let subcontext

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

  let infoElement = function makeInfoElement(subcontext) {
    let infoText

    if (subcontext == 'no-notes') {
      infoText = 'Você ainda não tem anotações \n Escreva sua primeira nota ✏️'
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

  if (context == '' && labelMessage != '') {
    //Utiliza função setWriteLabel se não houver contexto mas houver mensagem de label 
    setWriteLabel(labelMessage)
  }
  
  function setWriteLabel(labelMessage) {
    // noteous preview 1.9: writeLabel agora é controlado pelo Orblend Engine
    if (labelMessage == 'continue-editing') {
      writeLabel.innerHTML = '✏️ Continue escrevendo sua nota'
    } else if (labelMessage == 'add-note'){
      writeLabel.innerHTML = 'Adicione sua próxima nota'
    } else if (labelMessage == 'edit-note') {
      writeLabel.innerHTML = '✏️ Edite aqui sua nota'
    } else if (labelMessage == 'open-note') {
      writeLabel.innerHTML = '📃 Veja sua nota'
    } else if (labelMessage == 'start-note') {
      writeLabel.innerHTML = 'Escreva sua próxima anotação'
    } else if (labelMessage == 'restore-note') {
      writeLabel.innerHTML = '📝 Essa nota não foi adicionada'
    }
  }

  if (context == 'change') {
    //exibir/ocultar readOptions
    if (noteousMain.length == 0) {
      orbsPanel.querySelectorAll('[id*="orb"]').forEach(element => {element.classList.add('hidden-element')})
      readOptions.classList.add('hidden-element')
      subcontext = 'no-notes'
    } else {
      orbsPanel.querySelectorAll('[id*="orb"]').forEach(element => {element.classList.remove('hidden-element')})
      readOptions.classList.remove('hidden-element')
      subcontext = 'has-notes'
    }

    //Configurar informações
    infoPanel.innerHTML = ''
    infoPanel.append(dateElement(), infoElement(subcontext))
    showInstallButton()
  } else if (context == 'load') {
    
      orbsPanel.innerHTML = ''
      for (let orb of noteousSettings.orbsIndex) {
      let orbButton = document.createElement('button')
      orbButton.classList.add('orb-button', 'material-icons')
      orbButton.id = `${orb}-orb-button`

      if (orb == 'done') {
        orbButton.innerHTML = 'check'
      }

      orbButton.addEventListener('click', () => {
        selectedOrb = orb
        noteousSettings.selectedOrb = selectedOrb
        localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
        renderNote('render-all','', orb)
      })
      orbsPanel.appendChild(orbButton)
    }

    //✨ Backup Inteligente de Nota
    
    if (noteousSettings.input != '') {
      //Há uma nota não salva
      if (noteousSettings.noteId != 0) {
        //Há uma nota em edição
        openNote(noteousSettings.noteId)
        writeInput.value = noteousSettings.input
      } else {
        orblendEngine('', 'restore-note')
        writeInput.value = noteousSettings.input
        writeInput.focus()
        writeButtonsContainer.classList.add('focus-input') 
        writeButtonDismiss.classList.remove('hidden-element')
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
    infoPanel.append(dateElement(), infoElement(subcontext))
    
    showInstallButton()
    orblendEngine('change')
  } else if (context == 'on-change-input') {
    //Habilitar/Desabilitar Botão Adicionar Nota
    if (writeInput.value === '') {
      setWriteLabel('start-note')
      writeButtonDismiss.classList.add('hidden-element')
      writeButtonAdd.disabled = true
      writeButtonsContainer.classList.add('hidden-buttons')
      writeInput.classList.add('rounded-bottom')
      writeButtonAdd.setAttribute('aria-hidden', 'true')
    } else {
      if (noteousSettings.input == '') {
        setWriteLabel('add-note')
      } 
      writeButtonAdd.disabled = false
      writeButtonsContainer.classList.remove('hidden-buttons')
      writeInput.classList.remove('rounded-bottom')
      writeButtonAdd.setAttribute('aria-hidden', 'false')
    }

    //✨ Backup Inteligente de Nota
    if (editMode == false) {
      noteousSettings.input = writeInput.value
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    } else if (editMode == true) {
      noteousSettings.input = writeInput.value
      noteousSettings.noteId = noteIdEdit
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
    }

    //✨ Redimensionamento Inteligente do Campo de Nota
    //Verifica quantas linhas há no Campo de Nota
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
  } else if (context == 'check-selected-orb') {
      if (orb == 'done' && selectedOrb == 'done') {
      let orbButtonElement = document.getElementById(`done-orb-button`)
      if (!orbButtonElement.classList.contains('selected-orb')) {
        orbButtonElement.classList.add('selected-orb')
        document.getElementById(`donutdough-orb-button`).classList.remove('selected-orb')
      }
      
      writeLabel.style.opacity = 0
      writeInput.placeholder = ''
      writeInput.disabled = true
      writeInput.classList.add('orb-done')
      
      return note?.done === true
    } else if (orb == 'donutdough' && selectedOrb == 'donutdough') {
      
      let orbButtonElement = document.getElementById(`donutdough-orb-button`)
      if (!orbButtonElement.classList.contains('selected-orb')) {
        orbButtonElement.classList.add('selected-orb')
        document.getElementById(`done-orb-button`).classList.remove('selected-orb')
      }

      if (writeInput.disabled == true && writeInput.classList.contains('orb-done')) {
        writeLabel.style.opacity = 100
        writeInput.placeholder = '✏️ Anote aqui'
        writeInput.disabled = false
        writeInput.classList.remove('orb-done')
      }

      return note?.done !== true
    }
  }
}