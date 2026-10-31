import * as storage from '../storage-service.js'
import { findMonth, findWeek } from '../note-helpers.js'

const TEN_MINUTES = 10 * 60 * 1000
const TWELVE_HOURS = 12 * 60 * 60 * 1000
const GREETING_DURATION = 3000
const FADE_DURATION = 350

let infoPanel
let settings
let started = false
let phase = 'greeting'
let deferredInstallPrompt = null
let installPromptAllowed = false
let refreshVersion = 0
let notesCount = null
let displayedInfo = null
let phaseTwoNeedsFadeIn = false

export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault()
    deferredInstallPrompt = event
    installPromptAllowed = false
    if (started) {
      registerInstallPrompt()
      renderPhaseTwo()
    }
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
    installPromptAllowed = false
    if (started) renderPhaseTwo()
  })
}

function isInstalled() {
  return (typeof matchMedia === 'function' && matchMedia('(display-mode: standalone)').matches) ||
    navigator.standalone === true
}

function registerInstallPrompt() {
  if (!deferredInstallPrompt || isInstalled()) return

  if (settings?.noteousApp?.installPrompt <= 6) {
    settings.noteousApp.installPrompt++
    storage.saveSettings(settings)
    installPromptAllowed = true
  }
}

function cameFromHub() {
  const navigation = performance.getEntriesByType('navigation')[0]
  if (navigation?.type === 'reload' || !document.referrer) return false

  const referrer = new URL(document.referrer)
  return referrer.origin === location.origin && referrer.pathname.endsWith('/hub.html')
}

function greetingText(now, firstInTwelveHours) {
  if (!firstInTwelveHours) {
    const greeting = Math.random() < 0.5 ? 'Oi' : 'Olá'
    return `${greeting}, Boas-vindas novamente`
  }

  const hour = now.getHours()
  const greeting = hour >= 5 && hour < 12 ? 'Bom dia' : hour >= 12 && hour < 18 ? 'Boa tarde' : 'Boa noite'
  const weekday = findWeek(now.getDay()).replace('-feira', '')
  return `${greeting}! Hoje é ${weekday}, ${now.getDate()} de ${findMonth(now.getMonth())}`
}

function createTextInfo(text) {
  const element = document.createElement('p')
  element.classList.add('info-element')
  element.textContent = text
  return element
}

function createInstallButton() {
  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('write-buttons')
  button.textContent = 'Instalar noteous preview'
  button.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return

    button.disabled = true
    try {
      const prompt = deferredInstallPrompt
      await prompt.prompt()
      await prompt.userChoice
      if (deferredInstallPrompt === prompt) {
        deferredInstallPrompt = null
        installPromptAllowed = false
      }
      renderPhaseTwo()
    } catch (error) {
      console.error('Falha ao abrir a instalação do noteous', error)
      button.disabled = false
    }
  })
  return button
}

function renderPhaseTwo() {
  if (!started || phase !== 'information' || notesCount === null) return

  const candidates = [
    {
      id: 'first-note',
      score: 10,
      eligible: notesCount === 0,
      create: () => createTextInfo('Adicione sua primeira nota')
    },
    {
      id: 'install',
      score: 2,
      eligible: installPromptAllowed && !!deferredInstallPrompt && !isInstalled(),
      create: createInstallButton
    }
  ]
  const selected = candidates.reduce((best, candidate) => {
    if (!candidate.eligible || (best && candidate.score <= best.score)) return best
    return candidate
  }, null)

  const animate = phaseTwoNeedsFadeIn
  phaseTwoNeedsFadeIn = false
  if (displayedInfo === (selected?.id ?? null) && !animate) return
  displayedInfo = selected?.id ?? null
  const element = selected?.create()
  if (element && animate) element.classList.add('info-fade-in')
  infoPanel.replaceChildren(...(element ? [element] : []))
}

export async function refreshSmartInfoHandler() {
  if (!started) return

  const version = ++refreshVersion
  try {
    const count = await storage.getNotesCount()
    if (version !== refreshVersion) return
    notesCount = count
    renderPhaseTwo()
  } catch (error) {
    console.error('Falha ao atualizar as informações do painel', error)
  }
}

export function startSmartInfoHandler(noteousSettings) {
  if (started) return

  infoPanel = document.querySelector('#info-panel')
  settings = noteousSettings
  started = true
  registerInstallPrompt()

  const now = new Date()
  const previousValue = settings.noteousApp.lastAccess
  const previousOpening = previousValue == null ? null : Number(previousValue)
  const elapsed = previousOpening === null || !Number.isFinite(previousOpening)
    ? Infinity
    : now.getTime() - previousOpening
  const skipGreeting = cameFromHub() || (elapsed >= 0 && elapsed < TEN_MINUTES)
  settings.noteousApp.lastAccess = now.getTime()
  storage.saveSettings(settings)

  if (skipGreeting) {
    phase = 'information'
  } else {
    const greeting = createTextInfo(greetingText(now, elapsed < 0 || elapsed >= TWELVE_HOURS))
    infoPanel.replaceChildren(greeting)
    setTimeout(() => {
      greeting.classList.add('info-fade-out')
      setTimeout(() => {
        phase = 'information'
        infoPanel.replaceChildren()
        displayedInfo = null
        phaseTwoNeedsFadeIn = true
        renderPhaseTwo()
      }, FADE_DURATION)
    }, GREETING_DURATION)
  }

  refreshSmartInfoHandler()
}
