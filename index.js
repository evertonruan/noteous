var noteInput = document.querySelector("#noteInput");
var noteButton = document.querySelector("#noteButton");
var noteUl = document.querySelector("#noteUl");

var enoteObject = JSON.parse(localStorage.getItem("Enote")) || [];

renderNote();

function addNote() {
    var noteInputValue = noteInput.value;
    
    var obj = {
        id: Date.now(),
        text: noteInputValue
    };

    enoteObject.push(obj);

    localStorage.setItem("Enote", JSON.stringify(enoteObject)); //transfere valor da ul para localStorage

    renderNote();
}


function deleteNote(pos) {
    enoteObject.splice(pos, 1);

    localStorage.setItem("Enote", JSON.stringify(enoteObject));
    renderNote();
}


function renderNote() {
    noteUl.innerHTML = '';
    
    for (var note in enoteObject) { //percorre o array de objetos principal: o renderNote
         
        for (var prop in enoteObject[note]) { //percorre cada objeto encontrado
            var noteLi = document.createElement("li"); //cria um novo elemento li 
            var noteText = document.createTextNode(enoteObject[note][prop]);
            
            var linkElement = document.createElement('a');
            linkElement.setAttribute('href', '#');

            var pos = enoteObject.indexOf(enoteObject[note]);

            linkElement.setAttribute('onclick', 'deleteNote(' + pos + ')');
            var linkText = document.createTextNode('Concluído  |  ');
            
            linkElement.appendChild(linkText);

            noteLi.appendChild(linkElement);
            

            noteLi.appendChild(noteText); //coloca a variavel do input dentro do li
            noteUl.appendChild(noteLi); //adiciona li dentro do ul*/
            }
    }
}
