//noteous SW version = 250813

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
        console.log('Recursos adicionados ao cache com sucesso!');
      } catch (error) {
        console.error('Erro ao adicionar recursos ao cache:', error);
      }
    })()
  );
});

const noteousResources = [
  '/',
  'index.html',
  'index.js',
  'about.html',
  'about.js',
  'style.css',
  'reset.css',
  'policies.json',
  'orblendEngine.js',
  '/img/cupcake/cupcake-outline.png',
  '/img/cupcake/cupcake.png',
  '/img/cupcake/cupcake-2.png',
  '/img/cupcake/cupcake-3.png',
  '/img/cupcake/cupcake-4.png',
  '/img/cupcake/cupcake-5.png',
  '/img/cupcake/cupcake-6.png',
  '/img/cupcake/cupcake-7.png',
  '/img/cupcake/cupcake-8.png',
  '/img/cupcake/cupcake-9.png',
  '/img/cupcake/cupcake-10.png',
  '/img/cupcake/cupcake-11.png',
  '/img/cupcake/cupcake-12.png',
  '/img/cupcake/cupcake-13.png',
  '/img/cupcake/cupcake-14.png',
  '/img/cupcake/cupcake-15.png',
  '/img/cupcake/cupcake-16.png',
  '/img/cupcake/cupcake-17.png',
  '/img/social-chain.png']

//ACTIVATION
//Cache cleaning
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

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
    .then(cachedResponse => {
        return cachedResponse || fetch(event.request)
    }
  )
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

// Intercepta a ação de compartilhamento de arquivos
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && event.request.url.endsWith('/fileLoad')) {
    event.respondWith(handlePostRequest(event));
  }
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
  }
});
