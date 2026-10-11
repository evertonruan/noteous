// Dismiss on contact without blocking native scrolling or passing the gesture
// through to a control beneath the transparent overlay.
export function enableOverlayDismiss(overlay, dismiss) {
  let releaseTimer = 0
  function release() {
    clearTimeout(releaseTimer)
    overlay.classList.remove('overlay-dismissing')
  }
  overlay.addEventListener('pointerdown', event => {
    clearTimeout(releaseTimer)
    overlay.classList.add('overlay-dismissing')
    event.stopPropagation()
    overlay.setPointerCapture(event.pointerId)
    dismiss()
  })
  overlay.addEventListener('pointerup', () => {
    // A tap's click follows pointerup in the same task. Keep intercepting it.
    releaseTimer = setTimeout(release, 0)
  })
  overlay.addEventListener('pointercancel', release)
  overlay.addEventListener('lostpointercapture', () => {
    releaseTimer = setTimeout(release, 0)
  })
  overlay.addEventListener('click', event => {
    event.preventDefault()
    event.stopPropagation()
    dismiss()
    release()
  })
}
