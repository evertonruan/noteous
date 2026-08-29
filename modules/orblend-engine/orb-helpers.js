import { orbParams } from './orb-params.js'
import * as storage from '../storage-service.js'
import { orblendEngine } from '../../orblendEngine.js'

function createOrbButton(orbKey, noteousSettings) {
  let orbButton = document.createElement('button')
  orbButton.classList.add('orb-button', 'material-icons')
  orbButton.id = `${orbKey}-orb-button`
  orbButton.textContent = getOrbIcon(orbKey)
  orbButton.addEventListener('click', async () => {
    const orb = orbKey
    window.selectedOrb = orb
    if (noteousSettings) {
      noteousSettings.selectedOrb = orb
      storage.saveSettings(noteousSettings)
    } else {
      const settings = storage.getSettings()
      if (settings) {
        settings.selectedOrb = orb
        storage.saveSettings(settings)
      }
    }
    await window.renderNote('render-all', '', orb)
    orblendEngine('update-orb-info')
  })

  orbButton.addEventListener('animationend', () => {
    orbButton.classList.remove('orb-button-load-enter')
    orbButton.style.removeProperty('--orb-button-load-delay')
  }, { once: true })

  return orbButton
}

function getOrbLabel(orbKey) {
  const orb = orbParams[orbKey]
  return orb ? orb.label : ''
}

function getOrbIcon(orbKey) {
  const orb = orbParams[orbKey]
  return orb ? orb.icon : ''
}

function getOrbCount(notes, orbKey) {
const orb = orbParams[orbKey]
return orb && typeof orb.count === 'function' ? orb.count(notes) : 0
}

function getOrbMessage(notes, orbKey) {
  const orb = orbParams[orbKey]
  if (!orb || !orb.messages || !orb.messages.panel) return ''
  const count = getOrbCount(notes, orbKey)
  return count === 1 ? orb.messages.panel.one : (orb.messages.panel.many.replace('{count}', count))
}

function isShownOrb(notes, orbKey) {
  const orb = orbParams[orbKey]
  return orb && typeof orb.isShown === 'function' ? orb.isShown(notes) : false
}

function getStorageData() {
  return storage.getSettings()
}

async function getNotesCount() {
  return await storage.getNotesCount()
}

export {
  getOrbLabel,
  getOrbCount,
  getOrbMessage,
  isShownOrb,
  createOrbButton,
  getStorageData,
  getNotesCount,
}