if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')

    // Solicita ao Service Worker o conteúdo do arquivo
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
            type: 'requestFileContent'
        });
    }

    navigator.serviceWorker.addEventListener('message', event => {
        navigator.serviceWorker.controller.postMessage({
            type: ''
        });
        navigator.serviceWorker.removeEventListener('message', event)

        if (event.data.content !== '') {
            let fileContent = event.data.content
            try {
                fileContent = JSON.parse(fileContent);
                console.log(fileContent)
                // Se for um pacote de cópia de notas válido, renderiza o modal de visualização
                if (fileContent.notes && fileContent.exportDate) {
                    // Carrega o about.js dinamicamente se necessário
                    if (typeof showNotesModal === 'function') {
                        showNotesModal(fileContent)
                    } else {
                        // Se não estiver disponível, carrega o script e chama depois
                        const script = document.createElement('script');
                        script.src = 'about.js';
                        script.onload = () => {
                            if (typeof showNotesModal === 'function') {
                                showNotesModal(fileContent)
                            }
                        };
                        document.body.appendChild(script);
                    }
                }
                //Problema no SW: Ao importar um arquivo 1 vez, nas próximas vezes que o aplicativo é iniciado, ele continua "importando" o mesmo arquivo. Solução: adicionar ID a todos os arquivos e comparar com o ID salvo. Se for o mesmo, isso significa que está entrando no aplicativo e "importando" o arquivo, o que será desconsiderado. Se for diferente, significa que é uma ação legítima
                // (Ajuste conforme sua lógica de ID, se necessário)
            } catch (error) {
                console.error(error.message);
            }
        } else if (event.data.content === '') {
            console.log('O conteúdo do arquivo está vazio.');
        }
    })
}