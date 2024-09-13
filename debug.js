let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

let body = document.querySelector('body')
let br = function (event) {body.append(document.createElement('br'))}

body.append(document.createTextNode(`Bem-vindo à página de diagnóstico do noteous preview`))

br()
br()
br()


body.append(document.createTextNode(`• CONFIGURAÇÕES ARMAZENADAS`))

br()
br()

for (let prop in noteousSettings) {
    body.append(document.createTextNode(`${prop}: ${noteousSettings[prop]}`))
    body.append(document.createElement('br'))
}

br()
br()
br()

body.append(document.createTextNode(`• SOLUÇÃO DE PROBLEMAS`))

br()
br()

body.append(document.createTextNode(`Versão atual: 1.62. Versão instalada ${noteousSettings.noteousVersion}`))

br()

// Obtém todos os caches disponíveis
caches.keys().then((cacheNames) => {
  cacheNames.forEach((cacheName) => {
    caches.open(cacheName).then((cache) => {
      cache.keys().then((cachedRequests) => {
        console.log(`Recursos em cache no ${cacheName}:`);
        cachedRequests.forEach((request) => {
          console.log(request.url);
        });
      });
    });
  });
});


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
    }
    buttonUnregisterServiceWorker.innerText = '🔄️ Limpando o cache'
    setTimeout(() => {
      caches.keys().then((cacheNames) => {
        for (const name of cacheNames) {
          caches.delete(name);
        }
      });

      noteousSettings.debug = 'SW'
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))
      window.location.reload()
    }, 2000);
  }, 2000);
}

//Ao recarregar a página, verifica se o SW está sendo reinstalado
if (noteousSettings.debug == 'SW') {
  reinstallServiceWorker()
}


function reinstallServiceWorker() {
  buttonUnregisterServiceWorker.removeAttribute('onclick')
  buttonUnregisterServiceWorker.innerText = '🔄️ Instalando Service Worker'
  setTimeout(() => {
      if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('sw.js')
          }
      buttonUnregisterServiceWorker.innerText = '✅ Service Worker reinstalado'

      noteousSettings.debug = ''
      localStorage.setItem('noteous-settings', JSON.stringify(noteousSettings))

      body.append(document.createElement('br'))
      let notice = document.createElement('p')
      notice.innerHTML = `Agora, siga estes passos para verificar uma atualização: <br>
      1 - Feche o noteous. Aguarde alguns instantes e abra-o novamente <br>
      2 - Recarregue a página algumas vezes <br>
      3 - Caso ainda não atualize, desinstale e instale novamente. Sua notas não serão afetadas se você fizer isso`
      body.append(notice)
      body.append(document.createTextNode(``))
  }, 4000);
}

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.getRegistration().then(function(registration) {
  if (registration) {
    body.append(document.createTextNode(`Se a versão atual for diferente da versão instalada, um problema pode estar ocorrendo no mecanismo do Service Worker. Clique no botão abaixo para reinstalar. Suas notas não serão afetadas.`))

  br()
  br()  

  let buttonUnregisterServiceWorker = document.createElement('button')
  buttonUnregisterServiceWorker.setAttribute('onclick','unRegisterServiceWorker()')
  buttonUnregisterServiceWorker.innerText = 'Remover Service Worker'
  body.append(buttonUnregisterServiceWorker)

    }
  }).catch(function(error) {
    br()
    body.append(document.createTextNode('❌ Não há diagnósticos disponíveis'))
  })

}
