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
        fileContent = JSON.parse(fileContent)
        noteousSettings.fileId = fileContent.exportDate
        localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
        
        resolve(fileContent)
        
      } else if (event.data.content === '') {
        resolve(null)
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler)
  })
}
