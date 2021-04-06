var noteInput = document.querySelector("#noteInput");
var noteButton = document.querySelector("#noteButton");
var noteUl = document.querySelector("#noteUl");

enoteObject = [{}]; //cria o array de objetos que irá "empacotar" todas as notes

function addNote() {
    var noteInputValue = noteInput.value;
    
    var obj = {
        id: Date.now(),
        text: noteInputValue
    };

    enoteObject.push(obj);
    console.log(enoteObject);
    
    for (var prop in obj) {
        console.log("obj." + prop + " = " + obj[prop]);
    }

    localStorage.setItem("Enote", JSON.stringify(enoteObject)); //transfere valor da ul para localStorage
}

function renderNote() {
    renderNote = JSON.parse(localStorage.getItem("Enote"));
    
    for (var note in renderNote) { //percorre o array de objetos principal: o renderNote
        console.log(renderNote[note]);
        for (var prop in renderNote[note]) { //percorre cada objeto encontrado
            console.log(renderNote[note][prop]);

            var noteLi = document.createElement("li"); //cria um novo elemento li
            var noteText = document.createTextNode(renderNote[note][prop]);
            noteLi.appendChild(noteText); //coloca a variavel do input dentro do li
            noteUl.appendChild(noteLi); //adiciona li dentro do ul*/
        }
        
    }
}
