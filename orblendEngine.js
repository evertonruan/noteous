//✨ ORBLEND ENGINE 2.3

const smartCalcExpressionPattern =
  /\d+(?:[.,]\d+)?(?:\s*[+\-*/]\s*\d+(?:[.,]\d+)?)+/g
const smartCalcTokenPattern = /\d+(?:[.,]\d+)?|[+\-*/]/g

let smartCalcHoverTimeoutId
let smartCalcClickTimeoutId
let smartCalcPendingHighlightElement = null
let smartCalcActiveHighlightElement = null
let smartCalcPopupContainer = null
let smartCalcPopupVisibilityMode = ''
let smartCalcEventsBound = false
let smartCalcPopupExitTimeoutId

const smartCalcPopupAnimationDuration = 220

function escapeSmartCalcHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderSmartCalcHtmlFragment(text) {
  return escapeSmartCalcHtml(text).replace(/\n/g, '<br>')
}

function isSmartCalcBoundaryCharacter(character) {
  return character == null || !/[0-9.,]/.test(character)
}

function isSmartCalcNumberToken(token) {
  return /^\d+(?:[.,]\d+)?$/.test(token)
}

function formatSmartCalcTotal(totalValue) {
  const normalizedTotalValue =
    Math.abs(totalValue) < Number.EPSILON ? 0 : totalValue

  let formattedTotal = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 10,
    useGrouping: false
  }).format(normalizedTotalValue)

  if (formattedTotal.includes(',')) {
    formattedTotal = formattedTotal.replace(/0+$/g, '').replace(/,$/g, '')
  }

  return formattedTotal
}

function evaluateSmartCalc(expressionText) {
  const compactExpressionText = expressionText.replace(/\s+/g, '')
  const tokenList = compactExpressionText.match(smartCalcTokenPattern)

  if (
    !tokenList ||
    tokenList.join('') != compactExpressionText ||
    tokenList.length < 3 ||
    tokenList.length % 2 == 0 ||
    !isSmartCalcNumberToken(tokenList[0])
  ) {
    return null
  }

  let reducedValues = [Number(tokenList[0].replace(',', '.'))]
  let additiveOperators = []

  for (let tokenIndex = 1; tokenIndex < tokenList.length; tokenIndex += 2) {
    const operatorToken = tokenList[tokenIndex]
    const numberToken = tokenList[tokenIndex + 1]

    if (!/^[+\-*/]$/.test(operatorToken) || !isSmartCalcNumberToken(numberToken)) {
      return null
    }

    const numberValue = Number(numberToken.replace(',', '.'))

    if (operatorToken == '*') {
      reducedValues[reducedValues.length - 1] *= numberValue
    } else if (operatorToken == '/') {
      if (numberValue == 0) {
        return null
      }
      reducedValues[reducedValues.length - 1] /= numberValue
    } else {
      additiveOperators.push(operatorToken)
      reducedValues.push(numberValue)
    }
  }

  let totalValue = reducedValues[0]

  for (
    let operatorIndex = 0;
    operatorIndex < additiveOperators.length;
    operatorIndex++
  ) {
    if (additiveOperators[operatorIndex] == '+') {
      totalValue += reducedValues[operatorIndex + 1]
    } else {
      totalValue -= reducedValues[operatorIndex + 1]
    }
  }

  return Number.isFinite(totalValue) ? totalValue : null
}

function findSmartCalcMatches(inputValue) {
  let smartCalcMatches = []
  let expressionMatch

  smartCalcExpressionPattern.lastIndex = 0

  while ((expressionMatch = smartCalcExpressionPattern.exec(inputValue))) {
    const expressionText = expressionMatch[0]
    const startIndex = expressionMatch.index
    const endIndex = startIndex + expressionText.length
    const previousCharacter = inputValue[startIndex - 1]
    const nextCharacter = inputValue[endIndex]

    if (
      !isSmartCalcBoundaryCharacter(previousCharacter) ||
      !isSmartCalcBoundaryCharacter(nextCharacter)
    ) {
      continue
    }

    const totalValue = evaluateSmartCalc(expressionText)

    if (totalValue == null) {
      continue
    }

    smartCalcMatches.push({
      startIndex,
      endIndex,
      expressionText,
      totalText: formatSmartCalcTotal(totalValue)
    })
  }

  return smartCalcMatches
}

function buildSmartCalcRenderHtml(inputValue) {
  const smartCalcMatches = findSmartCalcMatches(inputValue)

  if (smartCalcMatches.length == 0) {
    return renderSmartCalcHtmlFragment(inputValue)
  }

  let renderHtml = ''
  let sliceStartIndex = 0

  smartCalcMatches.forEach((smartCalcMatch) => {
    renderHtml += renderSmartCalcHtmlFragment(
      inputValue.slice(sliceStartIndex, smartCalcMatch.startIndex)
    )
    renderHtml += `<span class="orblend-highlight-math" data-smart-calc-key="${smartCalcMatch.startIndex}-${smartCalcMatch.endIndex}" data-smart-calc-total="${smartCalcMatch.totalText}">${renderSmartCalcHtmlFragment(smartCalcMatch.expressionText)}</span>`
    sliceStartIndex = smartCalcMatch.endIndex
  })

  renderHtml += renderSmartCalcHtmlFragment(inputValue.slice(sliceStartIndex))

  return renderHtml
}

function clearSmartCalcHoverTimeout() {
  if (smartCalcHoverTimeoutId) {
    clearTimeout(smartCalcHoverTimeoutId)
    smartCalcHoverTimeoutId = null
  }
}

function clearSmartCalcClickTimeout() {
  if (smartCalcClickTimeoutId) {
    clearTimeout(smartCalcClickTimeoutId)
    smartCalcClickTimeoutId = null
  }
}

function removeSmartCalcPopup() {
  if (smartCalcPopupExitTimeoutId) {
    clearTimeout(smartCalcPopupExitTimeoutId)
    smartCalcPopupExitTimeoutId = null
  }

  if (smartCalcPopupContainer) {
    smartCalcPopupContainer.remove()
    smartCalcPopupContainer = null
  }
}

function hideSmartCalcPopup() {
  clearSmartCalcHoverTimeout()
  clearSmartCalcClickTimeout()
  smartCalcPendingHighlightElement = null
  smartCalcActiveHighlightElement = null
  smartCalcPopupVisibilityMode = ''

  if (!smartCalcPopupContainer) {
    return
  }

  const popupContainer = smartCalcPopupContainer

  if (smartCalcPopupExitTimeoutId) {
    clearTimeout(smartCalcPopupExitTimeoutId)
    smartCalcPopupExitTimeoutId = null
  }

  popupContainer.classList.remove('orblend-pop-visible')
  popupContainer.classList.add('orblend-pop-exit')

  smartCalcPopupExitTimeoutId = setTimeout(() => {
    if (smartCalcPopupContainer == popupContainer) {
      smartCalcPopupContainer = null
    }

    popupContainer.remove()
    smartCalcPopupExitTimeoutId = null
  }, smartCalcPopupAnimationDuration)
}

function createSmartCalcPopup(totalText) {
  let popupContainer = document.createElement('div')
  popupContainer.id = 'orblend-pop-container'

  let popupIcon = document.createElement('img')
  popupIcon.id = 'orblend-pop-icon'
  popupIcon.setAttribute('aria-hidden', 'true')
  popupIcon.setAttribute('alt', '')
  popupIcon.setAttribute('src', './assets/icons/orblend-pop-icon.webp')

  let popupText = document.createElement('span')
  popupText.id = 'orblend-pop-text'
  popupText.textContent = `Total = ${totalText}`

  popupContainer.append(popupIcon, popupText)

  return popupContainer
}

function positionSmartCalcPopup(highlightElement) {
  if (!smartCalcPopupContainer || !highlightElement) return

  const highlightRectangle = highlightElement.getBoundingClientRect()
  const popupRectangle = smartCalcPopupContainer.getBoundingClientRect()

  let popupLeft =
    highlightRectangle.left + highlightRectangle.width / 2 - popupRectangle.width / 2
  let popupTop = highlightRectangle.top - popupRectangle.height - 10

  popupLeft = Math.min(
    Math.max(8, popupLeft),
    Math.max(8, window.innerWidth - popupRectangle.width - 8)
  )

  if (popupTop < 8) {
    popupTop = highlightRectangle.bottom + 10
  }

  smartCalcPopupContainer.style.left = `${popupLeft}px`
  smartCalcPopupContainer.style.top = `${popupTop}px`
}

function showSmartCalcPopup(highlightElement, visibilityMode) {
  if (!highlightElement) return

  clearSmartCalcHoverTimeout()
  clearSmartCalcClickTimeout()
  removeSmartCalcPopup()

  const totalText = highlightElement.dataset.smartCalcTotal

  smartCalcPopupContainer = createSmartCalcPopup(totalText)
  smartCalcActiveHighlightElement = highlightElement
  smartCalcPendingHighlightElement = null
  smartCalcPopupVisibilityMode = visibilityMode

  const popupContainer = smartCalcPopupContainer

  popupContainer.style.visibility = 'hidden'
  document.body.appendChild(popupContainer)
  positionSmartCalcPopup(highlightElement)

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (smartCalcPopupContainer != popupContainer) return
      popupContainer.style.visibility = 'visible'
      popupContainer.classList.add('orblend-pop-visible')
    })
  })

  popupContainer.addEventListener('mouseleave', () => {
    if (smartCalcPopupVisibilityMode == 'hover') {
      hideSmartCalcPopup()
    }
  })

  if (visibilityMode == 'click') {
    smartCalcClickTimeoutId = setTimeout(() => {
      hideSmartCalcPopup()
    }, 2000)
  }
}

function findSmartCalcHighlightElementAtPointer(clientX, clientY) {
  if (!writeInputRender) return null

  let highlightElementList = writeInputRender.querySelectorAll(
    '.orblend-highlight-math'
  )

  for (let highlightElement of highlightElementList) {
    let highlightRectangles = highlightElement.getClientRects()

    for (let highlightRectangle of highlightRectangles) {
      if (
        clientX >= highlightRectangle.left &&
        clientX <= highlightRectangle.right &&
        clientY >= highlightRectangle.top &&
        clientY <= highlightRectangle.bottom
      ) {
        return highlightElement
      }
    }
  }

  return null
}

function handleSmartCalcHover(event) {
  if (smartCalcPopupVisibilityMode == 'click') {
    return
  }

  const highlightElement = findSmartCalcHighlightElementAtPointer(
    event.clientX,
    event.clientY
  )

  if (!highlightElement) {
    clearSmartCalcHoverTimeout()

    if (smartCalcPopupVisibilityMode == 'hover') {
      hideSmartCalcPopup()
    }

    return
  }

  if (
    smartCalcPopupVisibilityMode == 'hover' &&
    smartCalcActiveHighlightElement == highlightElement
  ) {
    return
  }

  if (smartCalcPendingHighlightElement == highlightElement) {
    return
  }

  clearSmartCalcHoverTimeout()

  if (
    smartCalcPopupVisibilityMode == 'hover' &&
    smartCalcActiveHighlightElement != highlightElement
  ) {
    hideSmartCalcPopup()
  }

  smartCalcPendingHighlightElement = highlightElement
  smartCalcHoverTimeoutId = setTimeout(() => {
    showSmartCalcPopup(highlightElement, 'hover')
  }, 500)
}

function handleSmartCalcHoverLeave(event) {
  clearSmartCalcHoverTimeout()

  if (smartCalcPopupVisibilityMode != 'hover') {
    return
  }

  if (
    smartCalcPopupContainer &&
    smartCalcPopupContainer.contains(event.relatedTarget)
  ) {
    return
  }

  hideSmartCalcPopup()
}

function handleSmartCalcClick(event) {
  const highlightElement = findSmartCalcHighlightElementAtPointer(
    event.clientX,
    event.clientY
  )

  if (!highlightElement) {
    return
  }

  showSmartCalcPopup(highlightElement, 'click')
}

function enableSmartCalcEvents() {
  if (smartCalcEventsBound || !writeInput) return

  writeInput.addEventListener('mousemove', (event) => {
    orblendEngine('handle-smart-calc-hover', '', event)
  })

  writeInput.addEventListener('mouseleave', (event) => {
    orblendEngine('handle-smart-calc-hover-leave', '', event)
  })

  writeInput.addEventListener('click', (event) => {
    orblendEngine('show-smart-calc-popup-on-click', '', event)
  })

  writeInput.addEventListener('scroll', () => {
    orblendEngine('hide-smart-calc-popup')
  })

  writeInput.addEventListener('blur', (event) => {
    if (
      smartCalcPopupContainer &&
      smartCalcPopupContainer.contains(event.relatedTarget)
    ) {
      return
    }

    orblendEngine('hide-smart-calc-popup')
  })

  window.addEventListener('resize', () => {
    orblendEngine('hide-smart-calc-popup')
  })

  smartCalcEventsBound = true
}
 
function hasLink(text) {
  if (!text) return false
  const urlPattern = /(?:https?:\/\/|www\.)\S+/i
  return urlPattern.test(text)
}

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

  if (context == 'enable-smart-calc') {
    enableSmartCalcEvents()
    return
  }

  if (context == 'render-smart-calc') {
    return buildSmartCalcRenderHtml(note || '')
  }

  if (context == 'has-link') {
    return hasLink(note || labelMessage || '')
  }

  if (context == 'hide-smart-calc-popup') {
    hideSmartCalcPopup()
    return
  }

  if (context == 'handle-smart-calc-hover') {
    handleSmartCalcHover(note)
    return
  }

  if (context == 'handle-smart-calc-hover-leave') {
    handleSmartCalcHoverLeave(note)
    return
  }

  if (context == 'show-smart-calc-popup-on-click') {
    handleSmartCalcClick(note)
    return
  }

  // ✨ Smart Input Resize
  if (context == 'smart-input-resize') {
    if (!writeInput || !writeInputWrapper) return

    writeInput.style.height = 'auto'
    const contentHeight = writeInput.scrollHeight
    const maxInputHeight =
      parseFloat(getComputedStyle(writeInputWrapper).maxHeight) ||
      window.innerHeight * 0.6

    if (contentHeight > maxInputHeight) {
      writeInput.style.height = maxInputHeight + 'px'
      writeInput.style.overflowY = 'auto'
    } else {
      writeInput.style.height = contentHeight + 'px'
      writeInput.style.overflowY = 'hidden'
      writeInput.scrollTop = 0
    }

    return
  }

  if (context == 'update-orb-info') {
    if (noteousMain.length == 0) {
      readHeader.classList.add('invisible-element')
    } else {
      const doneNotesCount = noteousMain.filter(note => note.done === true).length
      const activeNotesCount = noteousMain.filter(note => note.done !== true).length
      const linkNotesCount = noteousMain.filter(note => note.link === true && note.done !== true).length 

      readHeader.classList.remove('invisible-element')
      if (selectedOrb == 'done') {
        orbInfoLabel.textContent = 'Notas Concluídas'
        orbInfoCount.setAttribute('aria-label', doneNotesCount == 1 ? '1 nota concluída' : `${doneNotesCount} notas concluídas`)
        orbInfoCount.innerHTML = `<span class="orb-panel-count-number">${doneNotesCount}</span>`
      } else if (selectedOrb == 'link') {
        orbInfoLabel.textContent = 'Links'
        orbInfoCount.setAttribute('aria-label', linkNotesCount == 1 ? '1 nota com link' : `${linkNotesCount} notas com links`)
        orbInfoCount.innerHTML = `<span class="orb-panel-count-number">${linkNotesCount}</span>`
      } else {
        orbInfoLabel.textContent = 'Notas'
        orbInfoCount.setAttribute('aria-label', activeNotesCount == 1 ? '1 nota adicionada' : `${activeNotesCount} notas adicionadas`)
        orbInfoCount.innerHTML = `<span class="orb-panel-count-number">${activeNotesCount}</span>`
      }
    }
  }

  if (context == 'change') {
    //exibir/ocultar readOptions
    if (noteousMain.length == 0) {
      orbsList.querySelectorAll('[id*="orb"]').forEach(element => {element.classList.add('hidden-element')})
      orbsListLabel.classList.add('hidden-element')
      if (typeof syncReadOptionsVisibility == 'function') {
        syncReadOptionsVisibility()
      } else {
        readOptions.classList.add('hidden-element')
      }
      subcontext = 'no-notes'
    } else {
      orbsList.querySelectorAll('[id*="orb"]').forEach(element => {element.classList.remove('hidden-element')})
      orbsListLabel.classList.remove('hidden-element')
      if (typeof syncReadOptionsVisibility == 'function') {
        syncReadOptionsVisibility()
      } else {
        readOptions.classList.remove('hidden-element')
      }
      subcontext = 'has-notes'
    }

    //Configurar informações
    infoPanel.innerHTML = ''
    infoPanel.append(dateElement(), infoElement(subcontext))
    showInstallButton()
  } else if (context == 'load') {
    const hasActiveLinkNotes = noteousMain.some(
      note => note.link === true && note.done !== true
    )

    if (!hasActiveLinkNotes && noteousSettings.orbsIndex.includes('link')) {
      noteousSettings.orbsIndex = noteousSettings.orbsIndex.filter(
        orb => orb != 'link'
      )}    
    // Rebuild orb buttons from current settings
    if (orbsList) orbsList.innerHTML = ''
      for (let orb of noteousSettings.orbsIndex) {
      let orbButton = document.createElement('button')
      orbButton.classList.add('orb-button', 'material-icons')
      orbButton.id = `${orb}-orb-button`

      orbButton.addEventListener('animationend', () => {
        orbButton.classList.remove('orb-button-load-enter')
        orbButton.style.removeProperty('--orb-button-load-delay')
      }, { once: true })

      if (orb == selectedOrb) {
        orbButton.classList.add('selected-orb')
      }

      if (orb == 'done') {
        orbButton.innerHTML = 'check'
      }
      if (orb == 'donutdough') {
        orbButton.innerHTML = 'article'
      }
      if (orb == 'link') {
        orbButton.innerHTML = 'link'
      }
      
      orbButton.addEventListener('click', () => {
        selectedOrb = orb
        noteousSettings.selectedOrb = selectedOrb
        localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
        if (typeof queuePriorityListsOrbAnimation == 'function') {
          queuePriorityListsOrbAnimation(orbButton)
        }
        orbPanel.classList.remove('orb-panel-animate')
        void orbPanel.offsetWidth
        orbPanel.classList.add('orb-panel-animate')
        orblendEngine('update-orb-info')
        renderNote('render-all','', orb)
      })
      orbsList.appendChild(orbButton)
    }
    orblendEngine('update-orb-info')

    //✨ Backup Inteligente de Nota
    
    if (noteousSettings.input != '') {
      //Há uma nota não salva
      if (noteousSettings.noteId != 0) {
        //Há uma nota em edição
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
      writeInputWrapper.classList.add('rounded-bottom')
      writeButtonAdd.setAttribute('aria-hidden', 'true')
    } else {
      if (noteousSettings.input == '') {
        setWriteLabel('add-note')
      } 
      writeButtonAdd.disabled = false
      writeButtonsContainer.classList.remove('hidden-buttons')
      writeInputWrapper.classList.remove('rounded-bottom')
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
      writeInputWrapper.classList.add('orb-done')
      writeInputWrapper.classList.add('rounded-bottom')
      writeButtonsContainer.classList.add('hidden-buttons')
      
      return note?.done === true
    } else if (orb == 'donutdough' && selectedOrb == 'donutdough') {
      
      let orbButtonElement = document.getElementById(`donutdough-orb-button`)
      if (!orbButtonElement.classList.contains('selected-orb')) {
        orbButtonElement.classList.add('selected-orb')
        document.getElementById(`done-orb-button`).classList.remove('selected-orb')
      }

      if (writeInput.disabled == true && writeInputWrapper.classList.contains('orb-done')) {
        writeLabel.style.opacity = 100
        writeInput.placeholder = '✏️ Anote aqui'
        writeInput.disabled = false
        writeInputWrapper.classList.remove('orb-done')
        if (writeInputWrapper.classList.contains('rounded-bottom') && writeInput.value != '') {
          writeInputWrapper.classList.remove('rounded-bottom')
          writeButtonsContainer.classList.remove('hidden-buttons')
        }
      }

      return note?.done !== true
    }
    else if (orb == 'link' && selectedOrb == 'link') {
      let orbButtonElement = document.getElementById(`link-orb-button`)
      if (!orbButtonElement.classList.contains('selected-orb')) {
        orbButtonElement.classList.add('selected-orb')
        const dd = document.getElementById(`donutdough-orb-button`)
        if (dd) dd.classList.remove('selected-orb')
        const doneBtn = document.getElementById(`done-orb-button`)
        if (doneBtn) doneBtn.classList.remove('selected-orb')
      }

      if (writeInput.disabled == true && writeInputWrapper.classList.contains('orb-done')) {
        writeLabel.style.opacity = 100
        writeInput.placeholder = '✏️ Anote aqui'
        writeInput.disabled = false
        writeInputWrapper.classList.remove('orb-done')
        if (writeInputWrapper.classList.contains('rounded-bottom') && writeInput.value != '') {
          writeInputWrapper.classList.remove('rounded-bottom')
          writeButtonsContainer.classList.remove('hidden-buttons')
        }
      }

      return note?.link === true && note?.done !== true
    }
  } else if (context == 'orb-animation') {
      if (orb == 'done') {
        setTimeout(() => {
          document.getElementById(`done-orb-button`).classList.add('get-note')
        }, 100)
        setTimeout(() => {
          document.getElementById(`done-orb-button`).classList.remove('get-note')
        }, 500)
      }

  }
}