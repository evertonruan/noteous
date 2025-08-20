//noteous SW version = 250821

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
  '/assets/images/cupcake/cupcake-outline.webp',
  '/assets/images/cupcake/cupcake.webp',
  '/assets/images/cupcake/cupcake-2.webp',
  '/assets/images/cupcake/cupcake-3.webp',
  '/assets/images/cupcake/cupcake-4.webp',
  '/assets/images/cupcake/cupcake-5.webp',
  '/assets/images/cupcake/cupcake-6.webp',
  '/assets/images/cupcake/cupcake-7.webp',
  '/assets/images/cupcake/cupcake-8.webp',
  '/assets/images/cupcake/cupcake-9.webp',
  '/assets/images/cupcake/cupcake-10.webp',
  '/assets/images/cupcake/cupcake-11.webp',
  '/assets/images/cupcake/cupcake-12.webp',
  '/assets/images/cupcake/cupcake-13.webp',
  '/assets/images/cupcake/cupcake-14.webp',
  '/assets/images/cupcake/cupcake-15.webp',
  '/assets/images/cupcake/cupcake-16.webp',
  '/assets/images/cupcake/cupcake-17.webp',
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
  const url = new URL(event.request.url);
  console.log(url)

  if (event.request.method === 'POST' && url.pathname === '/fileload') {
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

          // Redireciona para index.html
          return Response.redirect('/index.html', 303);
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

