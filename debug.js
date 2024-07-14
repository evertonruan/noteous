let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

let body = document.querySelector('body')

body.append(document.createTextNode(`Bem-vindo à página de diagnóstico do noteous`))

body.append(document.createElement('br'))
body.append(document.createElement('br'))

body.append(document.createElement('br'))

body.append(document.createTextNode(`• CONFIGURAÇÕES ARMAZENADAS`))

body.append(document.createElement('br'))
body.append(document.createElement('br'))

for (let prop in noteousSettings) {
    body.append(document.createTextNode(`${prop}: ${noteousSettings[prop]}`))
    body.append(document.createElement('br'))
}

body.append(document.createElement('br'))
body.append(document.createElement('br'))
body.append(document.createElement('br'))

body.append(document.createTextNode(`• SOLUÇÃO DE PROBLEMAS`))
body.append(document.createElement('br'))
body.append(document.createElement('br'))

body.append(document.createTextNode(`noteous não atualiza: um problema pode estar ocorrendo no mecanismo do Service Worker. Clique no botão abaixo para reinstalar. Suas notas não serão afetadas.`))

body.append(document.createElement('br'))
body.append(document.createElement('br'))

let buttonUnregisterServiceWorker = document.createElement('button')
buttonUnregisterServiceWorker.setAttribute('onclick','unRegisterServiceWorker()')
buttonUnregisterServiceWorker.innerText = 'Remover Service Worker'
body.append(buttonUnregisterServiceWorker)

function unRegisterServiceWorker() {
    buttonUnregisterServiceWorker.removeAttribute('onclick')
    buttonUnregisterServiceWorker.innerText = '🔄️ Removendo Service Worker'
    
    setTimeout(() => {
        if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
        });

        self.addEventListener('activate', e => {
            console.log("SW activated")
            e.waitUntil(
              caches.keys().then(keyList => {
                return Promise.all(
                  keyList.map(key => {
                    if (key === 'noteousCache') {
                      return
                    }
          
                    return caches.delete(key)
                  })
                )
              })
            )
          })
}
        buttonUnregisterServiceWorker.innerText = '🔄️ Instalando Service Worker'
        setTimeout(() => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js')
              }
            buttonUnregisterServiceWorker.innerText = '✅ Service Worker reinstalado'

            body.append(document.createElement('br'))
            let notice = document.createElement('p')
            notice.innerHTML = `Agora, siga estes passos para verificar uma atualização: <br>
            1 - Feche o noteous. Aguarde alguns instantes e abra-o novamente <br>
            2 - Recarregue a página algumas vezes <br>
            3 - Caso ainda não atualize, desinstale e instale novamente. Sua notas não serão afetadas se você fizer isso`
            body.append(notice)
            body.append(document.createTextNode(``))
        }, 4000);
    }, 1000);
    




}




