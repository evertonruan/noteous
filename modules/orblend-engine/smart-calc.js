// ✨ Smart Calc module

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
    Math.max(8, innerWidth - popupRectangle.width - 8)
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
  const writeInputRender = document.querySelector('#write-input-render')

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
  const writeInput = document.querySelector('#write-input')

  if (smartCalcEventsBound || !writeInput) return

  writeInput.addEventListener('mousemove', (event) => {
    handleSmartCalcHover(event)
  })

  writeInput.addEventListener('mouseleave', (event) => {
    handleSmartCalcHoverLeave(event)
  })

  writeInput.addEventListener('click', (event) => {
    handleSmartCalcClick(event)
  })

  writeInput.addEventListener('scroll', () => {
    hideSmartCalcPopup()
  })

  writeInput.addEventListener('blur', (event) => {
    if (
      smartCalcPopupContainer &&
      smartCalcPopupContainer.contains(event.relatedTarget)
    ) {
      return
    }

    hideSmartCalcPopup()
  })

  addEventListener('resize', () => {
    hideSmartCalcPopup()
  })

  smartCalcEventsBound = true
}

export {
  enableSmartCalcEvents,
  buildSmartCalcRenderHtml,
  hideSmartCalcPopup,
  handleSmartCalcHover,
  handleSmartCalcHoverLeave,
  handleSmartCalcClick
}
