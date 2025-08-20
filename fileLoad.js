// Suporte a Web Share Target: processa dados compartilhados via POST
if (window.location.pathname === '/fileLoad') {
    // Detecta se foi aberto via POST (compartilhamento)
    if (window.location.search || window.location.hash) {
        // Não é POST, segue fluxo normal
    } else if (window.location.origin && window.location.pathname) {
        // Tenta ler dados do formulário compartilhado
        if (window.FormData) {
            // Aguarda DOM pronto
            window.addEventListener('DOMContentLoaded', async () => {
                try {
                    const form = document.querySelector('form');
                    let formData;
                    if (form) {
                        formData = new FormData(form);
                    } else if (window.navigator && window.navigator.clipboard) {
                        // fallback: tenta ler do clipboard
                        formData = null;
                    }
                    if (formData) {
                        const title = formData.get('name');
                        const text = formData.get('description');
                        const url = formData.get('link');
                        const file = formData.get('file');
                        let fileContent = '';
                        if (file && file.text) {
                            fileContent = await file.text();
                        }
                        // Exibe os dados compartilhados
                        let result = '';
                        if (title) result += `<h2>${title}</h2>`;
                        if (text) result += `<pre>${text}</pre>`;
                        if (url) result += `<a href="${url}" target="_blank">${url}</a><br>`;
                        if (fileContent) result += `<pre>${fileContent}</pre>`;
                        if (!result) result = '<p>Nenhum dado compartilhado recebido.</p>';
                        document.body.innerHTML = `<div style="padding:2em;max-width:600px;margin:auto;">${result}</div>`;
                    }
                } catch (e) {
                    document.body.innerHTML = '<p>Erro ao processar dados compartilhados.</p>';
                }
            });
        }
    }
} else if ('serviceWorker' in navigator) {
    // Fluxo antigo: importa arquivo via Service Worker
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