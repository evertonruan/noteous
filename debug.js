let noteousMain = JSON.parse(localStorage.getItem('noteous-main')) || []
let noteousSettings = JSON.parse(localStorage.getItem('noteous-settings'))

let body = document.querySelector('body')

for (let prop in noteousSettings) {
    body.append(document.createTextNode(`${prop}: ${noteousSettings[prop]}`))
    body.append(document.createElement('br'))
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations()
        .then(function(registrations) {
            for (let registration of registrations) {
                console.log(registration.unregister());
                
            }
        });
}


