//noteous 2.0 SW version

/*
When the user accepts the terms, the Service Worker is installed and adds resources to the cache.
Once they are cached, noteous will use only this local content and will no longer connect to the server to update content.
To update any content: 1. Upload the resource; 2. Change the value in the Service Worker version.
When there are changes in the sw.js file, it will force the Service Worker to update, subsequently updating all resources
(First, in page load, it will update the resources changed and activate (not install) SW new version. When tab is closed and reopened, then new SW version will be installed)
*/


//INSTALLATION
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open('noteousCache');
        await cache.addAll(noteousResources);
      } catch (error) {
        console.error('SW CACHE ERROR:', error);
      }
    })()
  );
});

const noteousResources = [
  '/',
  'noteousParams.js',
  'fileLoad.js',
  'noteousUpdate.json',
  'index.html',
  'index.js',
  'about.html',
  'about.js',
  'debug.html',
  'debug.js',
  'style.css',
  'reset.css',
  'policies.json',
  'orblendEngine.js',
  'assets/fonts/dm-sans-400.woff2',
  'assets/fonts/dm-sans-800.woff2',
  'assets/fonts/dm-serif-text-italic.woff2',
  'assets/fonts/source-sans-3-500.woff2',
  '/assets/icons/favicon.png',
  '/assets/images/social-link.webp']

//ACTIVATION
//Limpeza de cache
self.addEventListener('activate', event => {
  event.waitUntil(
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


// Função auxiliar para ler arquivos .txt
async function readFile(file) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

// Armazena o conteúdo do último arquivo enviado
let lastUploadedFileContent = '';

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Lida com POST para /fileload
  if (event.request.method === 'POST' && url.pathname === '/fileload') {
    event.respondWith(handlePostRequest(event));
    return;
  }
  
  // Lida com cache para requests como GET
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

async function handlePostRequest(event) {
  try {
    const formData = await event.request.formData();
    const files = formData.getAll('texts');

    if (files.length > 0) {
      for (let file of files) {
        if (file.type === 'text/plain') {
          const content = await readFile(file);
          lastUploadedFileContent = content;

          // Redireciona para about.html
          return Response.redirect('/about.html', 303);
        } else {
          console.warn('Tipo de arquivo não suportado:', file.type);
        }
      }
    }
  } catch (error) {
    console.error('Error ao processar o arquivo:', error);
    return new Response('Erro ao processar o arquivo', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Lida com a comunicação entre a página e o Service Worker
self.addEventListener('message', event => {
  if (event.data.type === 'requestFileContent') {
    // Envia o conteúdo do arquivo apenas uma vez
    event.source.postMessage({
      type: 'fileContent',
      content: lastUploadedFileContent,
    });
    // Limpa o conteúdo do último arquivo enviado
    lastUploadedFileContent = '';
  }
});

