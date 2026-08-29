//✨ ORBLEND ENGINE 2.4

import * as storage from './modules/storage-service.js'

import {
  enableSmartCalcEvents,
  buildSmartCalcRenderHtml,
  hideSmartCalcPopup,
  handleSmartCalcHover,
  handleSmartCalcHoverLeave,
  handleSmartCalcClick
} from './modules/orblend-engine/smart-calc.js'

import { smartInputResize } from './modules/orblend-engine/smart-input-resize.js'

import { smartNoteBackup } from './modules/orblend-engine/smart-note-backup.js'

import {
  getOrbLabel,
  getOrbMessage,
  createOrbButton,
  getStorageData,
  getNotesCount,
} from './modules/orblend-engine/orb-helpers.js'

import { findWeek, findMonth } from './modules/note-helpers.js'

export async function orblendEngine(context, labelMessage, note, orb, action) {
  const infoPanel = document.querySelector('#info-panel')
  const writeLabel = document.querySelector('#write-label')
  const writeInput = document.querySelector('#write-input')
  const writeInputWrapper = document.querySelector('#write-input-wrapper')
  const writeButtonsContainer = document.querySelector('#write-buttons-container')
  const writeButtonAdd = document.querySelector('#write-button-add')
  const writeButtonDismiss = document.querySelector('#write-button-dismiss')
  const orbsList = document.querySelector('#orbs-list')
  const orbInfoLabel = document.querySelector('#orb-panel-label')
  const orbInfoCount = document.querySelector('#orb-panel-count')
  const readHeader = document.querySelector('#read-header')

////////

  let noteousSettings
  let subcontext

////////

// ✨ Smart Calc

  if (context == 'enable-smart-calc') {
    enableSmartCalcEvents()
    return
  }

  if (context == 'render-smart-calc') {
    return buildSmartCalcRenderHtml(note || '')
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

  ////////

  // ✨ Smart Input Resize

  if (context == 'smart-input-resize') {
    smartInputResize()
    return
  }

////////

//info-panel
//info-element

  const infoElement = function makeInfoElement(subcontext) {
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

  let dateElement = function makeDateElement() {
    let dateNow = new Date()
    let infoElementDate = document.createElement('p')
    infoElementDate.classList.add('info-element')
    let infoElementDateText = document.createTextNode(
      `Olá! Hoje é ${findWeek(dateNow.getDay())}, ${dateNow.getDate()} de ${findMonth(dateNow.getMonth())}`
    )
    infoElementDate.append(infoElementDateText)
    return infoElementDate
  }

////////

//write-label
  if (context == '' && labelMessage != '') {
    setWriteLabel(labelMessage)
  }

  function setWriteLabel(labelMessage) {
    // noteous preview 1.9: writeLabel now is controlled by Orblend Engine
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

////////

// Orb Links

  if (context == 'has-link') {
      return hasLink(note || labelMessage || '')
    }

  function hasLink(text) {
    if (!text) return false
    const urlPattern = /(?:https?:\/\/|www\.)\S+/i
    return urlPattern.test(text)
  }

////////

  if (context == 'check-selected-orb') {
    const orbKey = orb || window.selectedOrb
    if (!orbKey) return true
    if (orbKey === 'done') return note?.done === true
    if (orbKey === 'link') return note?.link === true && note?.done !== true
    return note?.done !== true
  }

  if (context == 'update-orb-info') {
    if (action == 'clean-notes-count') {
      window.orbNotesCount = 0
    }
    if (action == 'increase-notes-count') {
      window.orbNotesCount += 1
    }
    if (action == 'decrease-notes-count') {
      window.orbNotesCount -= 1
    }
    if (action == 'retrieve-notes-count') {
      return window.orbNotesCount
    }

    const userNotesCount = await getNotesCount()
    if (userNotesCount == 0) {
      readHeader.classList.add('invisible-element')
    } else {
      readHeader.classList.remove('invisible-element')
      orbInfoCount.innerHTML = `<span class="orb-panel-count-number">${window.orbNotesCount}</span>`
      orbInfoCount.setAttribute('aria-label', getOrbMessage(window.orbNotesCount, window.selectedOrb))
      orbInfoLabel.textContent = getOrbLabel(window.selectedOrb)
    }
  }

  if (context == 'change') {
    
    infoPanel.innerHTML = ''
    infoPanel.append(dateElement(), infoElement(subcontext))
    window.showInstallButton()

  } else if (context == 'app-load') {
  noteousSettings = getStorageData()
  
    //✨ Smart Note Backup: Restore
    smartNoteBackup(
      noteousSettings,
      writeInput,
      writeButtonsContainer,
      writeButtonDismiss,
      () => {
        setWriteLabel('restore-note')
      }
    )

    //orbs-list

    if (orbsList) orbsList.innerHTML = ''
      for (let orb of noteousSettings.orbsIndex) {
        const orbButton = createOrbButton(orb, noteousSettings)
        orbsList.appendChild(orbButton)
      }
    await orblendEngine('update-orb-info')

    //info-panel
    
    const userNotesCount = await getNotesCount()
    if (userNotesCount > 0) {
      subcontext = 'has-notes'
    } else {
      subcontext = 'no-notes'
    }
    infoPanel.innerHTML = ''
    infoPanel.append(dateElement(), infoElement(subcontext))
    
    window.showInstallButton()
    
  } else if (context == 'on-change-input') {
    //Toggle Write Buttons
    if (writeInput.value == '') {
      setWriteLabel('start-note')
      writeButtonDismiss.classList.add('hidden-element')
      writeButtonAdd.disabled = true
      writeButtonsContainer.classList.add('hidden-buttons')
      writeInputWrapper.classList.add('rounded-bottom')
      writeButtonAdd.setAttribute('aria-hidden', 'true')
    } else {
      noteousSettings = getStorageData()
      if (noteousSettings.input == '') {
        setWriteLabel('add-note')
      } 
      writeButtonAdd.disabled = false
      writeButtonsContainer.classList.remove('hidden-buttons')
      writeInputWrapper.classList.remove('rounded-bottom')
      writeButtonAdd.setAttribute('aria-hidden', 'false')
    }

    //✨ Smart Note Backup
    if (window.editMode == false) {
      noteousSettings = getStorageData()
      noteousSettings.input = writeInput.value
      storage.saveSettings(noteousSettings)
    }
  }
}