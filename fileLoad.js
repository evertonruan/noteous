    function fileLoad() {
  return new Promise((resolve, reject) => {
    let fileContent

    // Solicita ao Service Worker o conteúdo do arquivo
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'requestFileContent',
      })
    }

    const messageHandler = event => {
      navigator.serviceWorker.removeEventListener('message', messageHandler)

      if (event.data.content !== '') {
        fileContent = event.data.content

        let parsed = null
        try {
          parsed = JSON.parse(fileContent)
        } catch (e) {
          parsed = null
        }

        if (parsed && Array.isArray(parsed.notes)) {
          // Valid noteous backup
          noteousSettings.fileId = parsed.exportDate
          localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
          resolve(parsed)
        } else {
          // Not a valid backup: treat as plain text
          resolve({ isPlainText: true, text: fileContent })
        }

      } else if (event.data.content === '') {
        resolve(null)
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler)
  })
}
