    function fileLoad() {
  return new Promise((resolve, reject) => {
    let fileContent

    // Solicita ao Service Worker o conteúdo do arquivo
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'requestFileContent',
      })
    } else {
      console.error('Service Worker não está disponível')
      reject(new Error('Service Worker não disponível'))
      return
    }

    // Timeout de segurança
    const timeoutId = setTimeout(() => {
      navigator.serviceWorker.removeEventListener('message', messageHandler)
      console.error('Timeout ao carregar arquivo do Service Worker')
      reject(new Error('Timeout ao carregar arquivo'))
    }, 10000)

    const messageHandler = event => {
      clearTimeout(timeoutId)
      navigator.serviceWorker.removeEventListener('message', messageHandler)

      try {
        if (event.data.content !== '') {
          fileContent = event.data.content

          let parsed = null
          try {
            parsed = JSON.parse(fileContent)
          } catch (e) {
            console.warn('Erro ao fazer parse JSON:', e.message)
            parsed = null
          }

          if (parsed && Array.isArray(parsed.notes)) {
            // Valid noteous backup - validação adicional
            if (!Number.isInteger(parsed.exportDate) || parsed.notes.some(n => !n.id || !n.content)) {
              console.warn('Estrutura de backup inválida')
              resolve({ isPlainText: true, text: fileContent })
              return
            }
            
            // Salvar com validação
            if (noteousSettings) {
              noteousSettings.fileId = parsed.exportDate
              setSafeStorage('noteous-settings', noteousSettings)
            }
            resolve(parsed)
          } else {
            // Not a valid backup: treat as plain text
            resolve({ isPlainText: true, text: fileContent })
          }

        } else if (event.data.content === '') {
          resolve(null)
        }
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        reject(error)
      }
    }

    navigator.serviceWorker.addEventListener('message', messageHandler)
  })
}
