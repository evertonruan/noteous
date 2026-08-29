export function smartInputResize() {
  const writeInput = document.querySelector('#write-input')
  const writeInputWrapper = document.querySelector('#write-input-wrapper')
  if (!writeInput || !writeInputWrapper) return

  writeInput.style.height = 'auto'
  const contentHeight = writeInput.scrollHeight
  const maxInputHeight =
    parseFloat(getComputedStyle(writeInputWrapper).maxHeight) ||
    innerHeight * 0.6

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