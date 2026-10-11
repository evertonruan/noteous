import { enableOverlayDismiss } from '../overlay-dismiss.js'

// Start floating after this page scroll; compact over the following distance.
const SCROLL_START = 10
const SCROLL_DISTANCE = 50
// Unfocused floating drafts show a short preview; focus reveals the full editor.
const COMPACT_HEIGHT_LIMIT = 120
const NORMAL_WIDTH_RATIO = 0.65
const FOCUSED_WIDTH_RATIO = 0.8
const MOBILE_VIEWPORT_QUERY = '(max-width: 600px)'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const INPUT_BORDER_WIDTH = 7
const NORMAL_MIN_INPUT_HEIGHT = 96
const FOCUSED_MIN_INPUT_HEIGHT = 112
const COMPACT_MIN_INPUT_HEIGHT = 48
const MIN_VISIBLE_INPUT_HEIGHT = 44
const MIN_OUTER_INPUT_HEIGHT = 50
const TEXT_PREVIEW_REDUCTION = 48
const VIEWPORT_HEIGHT_RATIO = 0.6
const VIEWPORT_RESERVED_SPACE = 120
const FLOATING_TOP_GAP = 12
const FOCUS_CLEANUP_DELAY = 50
const MEASUREMENT_STYLE_PROPERTIES = [
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'boxSizing',
  'whiteSpace',
  'overflowWrap'
]
let controller

// Only calculated values live in this class rule. Appearance and state rules
// remain in style.css; no style attributes are written to DOM elements.
function createLayoutValues() {
  const stylesheet = document.createElement('style')
  stylesheet.id = 'smart-input-resize-values'
  stylesheet.textContent = '.smart-input-resize-values {}'
  document.head.append(stylesheet)
  const declaration = stylesheet.sheet.cssRules[0].style
  const values = new Map()
  function setValue(property, value) {
    if (values.get(property) === value) return
    values.set(property, value)
    declaration.setProperty(property, value)
  }
  return { setValue, destroy: () => stylesheet.remove() }
}

function interpolate(start, end, progress) {
  return start + (end - start) * progress
}

// Pure geometry calculation: no DOM reads, style writes or event handling.
function calculateInputHeight(state, geometry, contentHeight) {
  const { hasWritePanelFocus, isMobileViewport, isFloating, collapseProgress, hasText } =
    state
  const {
    minimumInputHeight,
    maximumWrapperHeight,
    verticalBorderWidth,
    viewportHeight,
    windowHeight,
    hasRoundedBottom
  } = geometry
  let minHeight = minimumInputHeight
  let maxHeight = Math.max(
    minHeight,
    (maximumWrapperHeight || windowHeight * VIEWPORT_HEIGHT_RATIO) - verticalBorderWidth
  )
  if (isMobileViewport) {
    const effectiveProgress = hasWritePanelFocus ? 0 : collapseProgress
    minHeight = hasWritePanelFocus
      ? FOCUSED_MIN_INPUT_HEIGHT
      : NORMAL_MIN_INPUT_HEIGHT - COMPACT_MIN_INPUT_HEIGHT * effectiveProgress
    // Replacing the rounded bottom border with the tray must not move content.
    if (hasWritePanelFocus || !isFloating) {
      const fullBorderWidth = 2 * INPUT_BORDER_WIDTH
      minHeight += Math.max(fullBorderWidth - verticalBorderWidth, 0)
    }
    const expandedLimit = viewportHeight * VIEWPORT_HEIGHT_RATIO
    const compactLimit = Math.min(expandedLimit, COMPACT_HEIGHT_LIMIT)
    const heightLimit = interpolate(expandedLimit, compactLimit, effectiveProgress)
    maxHeight = Math.max(
      MIN_VISIBLE_INPUT_HEIGHT,
      Math.min(heightLimit, viewportHeight - VIEWPORT_RESERVED_SPACE) -
        verticalBorderWidth
    )
    minHeight = Math.min(minHeight, maxHeight)
  }
  if (isMobileViewport && isFloating && !hasWritePanelFocus) {
    const expandedLimit = Math.max(
      MIN_OUTER_INPUT_HEIGHT,
      Math.min(
        viewportHeight * VIEWPORT_HEIGHT_RATIO,
        viewportHeight - VIEWPORT_RESERVED_SPACE
      )
    )
    const compactLimit = Math.max(
      MIN_OUTER_INPUT_HEIGHT,
      Math.min(
        viewportHeight * VIEWPORT_HEIGHT_RATIO,
        COMPACT_HEIGHT_LIMIT,
        viewportHeight - VIEWPORT_RESERVED_SPACE
      )
    )
    const normalVerticalBorderWidth = INPUT_BORDER_WIDTH * (hasRoundedBottom ? 2 : 1)
    const normalOuterMinHeight = NORMAL_MIN_INPUT_HEIGHT + 2 * INPUT_BORDER_WIDTH
    const normalHeight = Math.min(
      Math.max(contentHeight + normalVerticalBorderWidth, normalOuterMinHeight),
      expandedLimit
    )
    const compactHeight = Math.min(
      Math.max(
        contentHeight - (hasText ? TEXT_PREVIEW_REDUCTION : 0),
        COMPACT_MIN_INPUT_HEIGHT
      ) +
        2 * INPUT_BORDER_WIDTH,
      compactLimit
    )
    return (
      interpolate(normalHeight, compactHeight, collapseProgress) - verticalBorderWidth
    )
  }
  return Math.min(Math.max(contentHeight, minHeight), maxHeight)
}

function createController(writeInput, writeInputWrapper) {
  const writePanel = document.querySelector('#write-panel')
  const writeInputRender = document.querySelector('#write-input-render')
  const writeButtonsContainer = document.querySelector('#write-buttons-container')
  const orbElements = [
    document.querySelector('#orbs-list-container'),
    document.querySelector('#orb-panel')
  ].filter(Boolean)
  const layoutValues = createLayoutValues()
  const setLayoutValue = layoutValues.setValue
  const eventController = new AbortController()
  const eventOptions = { signal: eventController.signal }
  let isDisposed = false
  writePanel.classList.add('smart-input-resize-values')
  document.body.classList.add('smart-input-resize-values')
  const mobileViewportQuery = matchMedia(MOBILE_VIEWPORT_QUERY)
  const focusOverlay = document.createElement('div')
  focusOverlay.id = 'write-focus-overlay'
  focusOverlay.setAttribute('aria-hidden', 'true')
  document.body.append(focusOverlay)
  enableOverlayDismiss(focusOverlay, () => {
    if (writePanel.contains(document.activeElement)) document.activeElement.blur()
    update()
  })
  const spacer = document.createElement('div')
  spacer.className = 'write-panel-spacer smart-input-resize-values'
  spacer.setAttribute('aria-hidden', 'true')
  writePanel.before(spacer)
  const orbsHiddenByWritePanel = new Set()
  let updateFrameId = 0
  let layoutHandoffFrameId = 0
  const activeBorderTransitions = new Set()
  let floatingOriginTop = 0
  let expandedButtonsHeight = 0
  let measurementKey = ''
  let measuredText = null
  let measuredHeight = 0
  let hadWritePanelFocus = false
  let focusAnimationTimeoutId = 0
  const reducedMotionQuery = matchMedia(REDUCED_MOTION_QUERY)

  function readWritePanelState() {
    const hasWritePanelFocus =
      writePanel.contains(document.activeElement) && !writeInput.disabled
    const isMobileViewport = mobileViewportQuery.matches
    const text = writeInput.value
    const pageScrollTop = window.scrollY
    const isFloating =
      isMobileViewport && pageScrollTop > SCROLL_START && !window.editMode
    const wasFloating = writePanel.classList.contains('write-panel-floating')
    return {
      hasWritePanelFocus,
      isMobileViewport,
      text,
      hasText: text.length > 0,
      pageScrollTop,
      isFloating,
      wasFloating,
      changingLayoutMode: isFloating !== wasFloating,
      collapseProgress: isFloating
        ? Math.min((pageScrollTop - SCROLL_START) / SCROLL_DISTANCE, 1)
        : 0,
      gradientProgress: isMobileViewport
        ? Math.min(Math.max(pageScrollTop / SCROLL_DISTANCE, 0), 1)
        : 0
    }
  }

  function update() {
    if (isDisposed) return
    const state = readWritePanelState()
    prepareLayoutUpdate(state)
    captureFloatingOrigin(state)
    applyWritePanelState(state)
    updateFloatingPosition(state)
    updateOrbVisibility(state.isMobileViewport && state.hasWritePanelFocus)

    const geometry = readInputGeometry(state)
    const contentHeight = measureContent(
      state.text,
      geometry.measurementWidth,
      geometry.inputStyle
    )
    const inputHeight = calculateInputHeight(state, geometry, contentHeight)
    applyInputHeight(inputHeight, contentHeight, geometry)
    syncRenderScroll()
    finishLayoutHandoff(state)
    // Border changes affect outside height even when text width is unchanged.
    if (activeBorderTransitions.size) scheduleUpdate()
  }

  function prepareLayoutUpdate(state) {
    writePanel.classList.toggle('write-panel-focus-active', state.hasWritePanelFocus)
    focusOverlay.classList.toggle('active', state.hasWritePanelFocus)
    writePanel.classList.toggle(
      'write-panel-has-text',
      state.isMobileViewport && state.hasText
    )
    if (state.changingLayoutMode) {
      cancelAnimationFrame(layoutHandoffFrameId)
      writePanel.classList.add('write-panel-scroll-handoff')
    }
    setLayoutValue('--write-panel-scroll-progress', state.gradientProgress)
    updateFocusTransition(state.hasWritePanelFocus, state.isFloating, state.wasFloating)
  }

  function captureFloatingOrigin(state) {
    if (!state.isFloating || state.wasFloating) return
    const panelRect = writePanel.getBoundingClientRect()
    floatingOriginTop = panelRect.top + state.pageScrollTop
    expandedButtonsHeight = writeButtonsContainer.getBoundingClientRect().height
    setLayoutValue('--write-panel-reserved-height', panelRect.height + 'px')
  }

  function applyWritePanelState(state) {
    writePanel.classList.toggle('write-panel-floating', state.isFloating)
    writePanel.classList.toggle(
      'write-panel-expanded',
      state.isMobileViewport && state.hasWritePanelFocus
    )
    spacer.classList.toggle('active', state.isFloating)
    writePanel.classList.toggle(
      'write-panel-compact',
      state.isFloating && !state.hasWritePanelFocus && state.collapseProgress === 1
    )
  }

  function updateFloatingPosition(state) {
    if (!state.isFloating) return
    const { hasWritePanelFocus, collapseProgress, pageScrollTop } = state
    const panelTop = interpolate(
      floatingOriginTop - pageScrollTop,
      FLOATING_TOP_GAP,
      collapseProgress
    )
    setLayoutValue(
      '--write-panel-collapse-progress',
      hasWritePanelFocus ? 0 : collapseProgress
    )
    setLayoutValue('--write-buttons-container-height', expandedButtonsHeight + 'px')
    setLayoutValue('--write-panel-top', Math.max(FLOATING_TOP_GAP, panelTop) + 'px')
  }

  function readInputGeometry(state) {
    const inputStyle = getComputedStyle(writeInput)
    const wrapperStyle = getComputedStyle(writeInputWrapper)
    const isAnimatingFocus =
      state.isFloating && writePanel.classList.contains('write-panel-focus-transition')
    const hasRoundedBottom = writeInputWrapper.classList.contains('rounded-bottom')
    let verticalBorderWidth =
      parseFloat(wrapperStyle.borderTopWidth) + parseFloat(wrapperStyle.borderBottomWidth)
    if (isAnimatingFocus) {
      // Use destination borders during a focus animation, avoiding a moving
      // height target as the animated border changes frame by frame.
      const compactBottomBorder =
        state.collapseProgress > 0
          ? Math.max(1, Math.floor(INPUT_BORDER_WIDTH * state.collapseProgress))
          : 0
      verticalBorderWidth = state.hasWritePanelFocus
        ? INPUT_BORDER_WIDTH * (hasRoundedBottom ? 2 : 1)
        : INPUT_BORDER_WIDTH +
          (hasRoundedBottom ? INPUT_BORDER_WIDTH : compactBottomBorder)
    }
    const scrollTop = writeInput.scrollTop
    const scrollLeft = writeInput.scrollLeft
    const scrollbarWidth = Math.max(writeInput.offsetWidth - writeInput.clientWidth, 0)
    const destinationBorderWidth = 2 * INPUT_BORDER_WIDTH
    // CSS owns the target width; ratios are fallbacks outside the mobile rules.
    const cssWidthRatio =
      parseFloat(getComputedStyle(writePanel).getPropertyValue('--write-panel-width')) /
      100
    const destinationWidthRatio =
      cssWidthRatio ||
      (state.hasWritePanelFocus ? FOCUSED_WIDTH_RATIO : NORMAL_WIDTH_RATIO)
    const destinationWidth = writePanel.parentElement.clientWidth * destinationWidthRatio
    return {
      inputStyle,
      minimumInputHeight: parseFloat(inputStyle.minHeight) || 0,
      maximumWrapperHeight: parseFloat(wrapperStyle.maxHeight) || 0,
      hasRoundedBottom,
      verticalBorderWidth,
      windowHeight: innerHeight,
      viewportHeight: window.visualViewport?.height || innerHeight,
      scrollTop,
      scrollLeft,
      measurementWidth: isAnimatingFocus
        ? Math.max(1, destinationWidth - destinationBorderWidth - scrollbarWidth)
        : writeInput.clientWidth
    }
  }

  function applyInputHeight(inputHeight, contentHeight, geometry) {
    const needsInternalScroll = contentHeight > inputHeight
    setLayoutValue('--write-input-height', inputHeight + 'px')
    writeInput.classList.toggle('write-input-scrollable', needsInternalScroll)
    writeInput.scrollTop = needsInternalScroll ? geometry.scrollTop : 0
    writeInput.scrollLeft = geometry.scrollLeft
  }

  function finishLayoutHandoff(state) {
    if (!state.changingLayoutMode) return
    // Commit the scroll layout before restoring CSS focus transitions.
    void writeInputWrapper.offsetWidth
    layoutHandoffFrameId = requestAnimationFrame(() => {
      writePanel.classList.remove('write-panel-scroll-handoff')
      layoutHandoffFrameId = 0
    })
  }

  function updateFocusTransition(hasWritePanelFocus, isFloating, wasFloating) {
    if (
      isFloating &&
      wasFloating &&
      hasWritePanelFocus !== hadWritePanelFocus &&
      !reducedMotionQuery.matches
    ) {
      clearTimeout(focusAnimationTimeoutId)
      writePanel.classList.add('write-panel-focus-transition')
      // Commit the current geometry before changing the focus targets.
      void writeInputWrapper.offsetWidth
      // Match the CSS duration so cleanup never cuts the animation short.
      const focusDuration = parseFloat(
        getComputedStyle(writePanel).getPropertyValue('--write-panel-focus-duration')
      )
      focusAnimationTimeoutId = setTimeout(() => {
        writePanel.classList.remove('write-panel-focus-transition')
        focusAnimationTimeoutId = 0
        scheduleUpdate()
      }, focusDuration + FOCUS_CLEANUP_DELAY)
    } else if (!isFloating || reducedMotionQuery.matches) {
      clearTimeout(focusAnimationTimeoutId)
      focusAnimationTimeoutId = 0
      writePanel.classList.remove('write-panel-focus-transition')
    }
    hadWritePanelFocus = hasWritePanelFocus
  }

  function updateOrbVisibility(hide) {
    for (const element of orbElements) {
      if (hide) {
        if (!element.classList.contains('invisible-element')) {
          orbsHiddenByWritePanel.add(element)
          element.classList.add('invisible-element')
        }
      } else if (orbsHiddenByWritePanel.has(element)) {
        if (element.id !== 'orbs-list-container' || !window.editMode) {
          element.classList.remove('invisible-element')
          orbsHiddenByWritePanel.delete(element)
        }
      }
    }
  }

  function measureContent(text, measurementWidth, inputStyle) {
    const measurementText = text || writeInput.placeholder
    const styleValues = MEASUREMENT_STYLE_PROPERTIES.map(
      (property) => inputStyle[property]
    )
    const nextMeasurementKey = JSON.stringify([measurementWidth, styleValues])
    if (nextMeasurementKey !== measurementKey || measurementText !== measuredText) {
      setLayoutValue('--write-input-render-measure-width', measurementWidth + 'px')
      setLayoutValue(
        '--write-input-render-measure-padding-right',
        inputStyle.paddingRight
      )
      // Reuse the render surface without changing the textarea's cursor,
      // selection, scroll position or height animation. Restore the original
      // nodes synchronously, preserving formatted text and attached listeners.
      const renderedNodes = Array.from(writeInputRender.childNodes)
      writeInputRender.classList.add('write-input-render-measuring')
      try {
        // Include the placeholder when empty, as the textarea does. An
        // invisible final character preserves the line after a trailing newline.
        writeInputRender.textContent = measurementText + '\u200b'
        measuredHeight = writeInputRender.scrollHeight
      } finally {
        writeInputRender.replaceChildren(...renderedNodes)
        writeInputRender.classList.remove('write-input-render-measuring')
      }
      measurementKey = nextMeasurementKey
      measuredText = measurementText
    }
    return measuredHeight
  }

  function syncRenderScroll() {
    if (!writeInputRender) return
    const padding = parseFloat(getComputedStyle(writeInput).paddingRight) || 0
    const gutter = Math.max(writeInput.offsetWidth - writeInput.clientWidth, 0)
    setLayoutValue('--write-input-render-padding-right', padding + gutter + 'px')
    setLayoutValue('--write-input-render-x', -writeInput.scrollLeft + 'px')
    setLayoutValue('--write-input-render-y', -writeInput.scrollTop + 'px')
  }

  function scheduleUpdate() {
    if (isDisposed || updateFrameId) return
    updateFrameId = requestAnimationFrame(() => {
      updateFrameId = 0
      update()
    })
  }
  window.addEventListener('scroll', scheduleUpdate, { ...eventOptions, passive: true })
  window.addEventListener('resize', scheduleUpdate, eventOptions)
  window.visualViewport?.addEventListener('resize', scheduleUpdate, eventOptions)
  mobileViewportQuery.addEventListener('change', scheduleUpdate, eventOptions)
  writePanel.addEventListener('focusin', scheduleUpdate, eventOptions)
  writePanel.addEventListener('focusout', scheduleUpdate, eventOptions)
  writeInput.addEventListener('input', scheduleUpdate, eventOptions)
  function trackBorderTransition(event) {
    if (
      event.target !== writeInputWrapper ||
      !/^border-(top|right|bottom|left)-width$/.test(event.propertyName)
    )
      return
    if (event.type === 'transitionrun') {
      activeBorderTransitions.add(event.propertyName)
    } else {
      activeBorderTransitions.delete(event.propertyName)
    }
    scheduleUpdate()
  }
  writeInputWrapper.addEventListener('transitionrun', trackBorderTransition, eventOptions)
  writeInputWrapper.addEventListener('transitionend', trackBorderTransition, eventOptions)
  writeInputWrapper.addEventListener(
    'transitioncancel',
    trackBorderTransition,
    eventOptions
  )
  // Width transitions change wrapping even after the focus event has finished.
  const observedElementWidths = new WeakMap()
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const width = entry.contentRect.width
      if (width !== observedElementWidths.get(entry.target)) {
        observedElementWidths.set(entry.target, width)
        scheduleUpdate()
      }
    }
  })
  resizeObserver.observe(writeInputWrapper)
  resizeObserver.observe(writeInput)
  function invalidateMeasurement() {
    if (isDisposed) return
    measurementKey = ''
    scheduleUpdate()
  }
  document.fonts?.ready.then(invalidateMeasurement)
  document.fonts?.addEventListener('loadingdone', invalidateMeasurement, eventOptions)

  function destroy() {
    if (isDisposed) return
    isDisposed = true
    eventController.abort()
    cancelAnimationFrame(updateFrameId)
    cancelAnimationFrame(layoutHandoffFrameId)
    clearTimeout(focusAnimationTimeoutId)
    resizeObserver.disconnect()
    updateOrbVisibility(false)
    if (writePanel.contains(document.activeElement)) document.activeElement.blur()
    writePanel.classList.remove(
      'smart-input-resize-values',
      'write-panel-focus-active',
      'write-panel-has-text',
      'write-panel-floating',
      'write-panel-expanded',
      'write-panel-compact',
      'write-panel-focus-transition',
      'write-panel-scroll-handoff'
    )
    document.body.classList.remove('smart-input-resize-values')
    writeInput.classList.remove('write-input-scrollable')
    focusOverlay.remove()
    spacer.remove()
    layoutValues.destroy()
  }

  return { update, syncRenderScroll, destroy }
}

export function smartInputResize() {
  const writeInput = document.querySelector('#write-input')
  const writeInputWrapper = document.querySelector('#write-input-wrapper')
  const writeInputRender = document.querySelector('#write-input-render')
  if (!writeInput || !writeInputWrapper || !writeInputRender) return
  controller ||= createController(writeInput, writeInputWrapper)
  controller.update()
}

export function syncSmartInputRenderScroll() {
  controller?.syncRenderScroll()
}

// Optional lifecycle hook for removing or rebuilding the write panel.
export function destroySmartInputResize() {
  controller?.destroy()
  controller = undefined
}
