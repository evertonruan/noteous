    function fileLoad() {
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
                alert({fileContent})
                //Problema no SW: Ao importar um arquivo 1 vez, nas próximas vezes que o aplicativo é iniciado, ele continua "importando" o mesmo arquivo. Solução: adicionar ID a todos os arquivos e comparar com o ID salvo. Se for o mesmo, isso significa que está entrando no aplicativo e "importando" o arquivo, o que será desconsiderado. Se for diferente, significa que é uma ação legítima
                
                if (noteousSettings.fileId != fileContent[0].exportDate) {
                    if (noteousSettings.fileId == '') {
                        noteousSettings.fileId = fileContent[0].exportDate
                        localStorage.setItem('noteousSettings', JSON.stringify(noteousSettings))
                    }
                    alert(fileContent)
                    console.log(event.data.content)
                }
            } catch (error) {
                console.error(error.message);
            }
        } else if (event.data.content === '') {
            console.log(event.data.content)
        }
    })        
}