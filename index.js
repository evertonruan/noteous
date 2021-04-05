var noteInput = document.querySelector("#noteInput");
var noteButton = document.querySelector("#noteButton");
var noteUl = document.querySelector("#noteUl");

function addNote() {
        var noteInputValue = noteInput.value; //coloca o value do input na variável
        var noteText = document.createTextNode(noteInputValue); //Coloca a variavel de value dentro de outra variável suportável

        var noteLi = document.createElement("li"); //cria um novo elemento li
        
        noteLi.appendChild(noteText); //coloca a variavel do input dentro do li
        noteUl.appendChild(noteLi); //adiciona li dentro do ul
        
        var enoteObject = {
            text: noteInputValue
        }



        localStorage.setItem("Enote", JSON.stringify(enoteObject)); //transfere valor da ul para localStorage

        renderNote();
    
}

function renderNote() {
    renderNote = localStorage.getItem("Enote");
    alert(renderNote);
}
