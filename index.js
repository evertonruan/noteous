var noteInput = document.querySelector("#noteInput");
var noteButtonDo = document.querySelector("#noteButtonDo");
var noteButtonMemo = document.querySelector("#noteButtonMemo");

var listDo = document.querySelector("#listDo");


var enoteObjectDo = JSON.parse(localStorage.getItem("EnoteDo")) || [];
var enoteObjectMemo = JSON.parse(localStorage.getItem("EnoteMemo")) || [];

renderNote();

function addNoteDo() {
    var noteInputValue = noteInput.value;

    if (noteInputValue || "") {

        var objDo = {
            text: noteInputValue
        };
    
        enoteObjectDo.push(objDo);
    
        localStorage.setItem("EnoteDo", JSON.stringify(enoteObjectDo)); //transfere valor da ul para localStorage
        
        renderNote();
        noteInput.value = '';
    }
}

function addNoteMemo() {
    var noteInputValue = noteInput.value;

    if (noteInputValue || "") {

        var objMemo = {
            text: noteInputValue
        };
    
        enoteObjectMemo.push(objMemo);
    
        localStorage.setItem("EnoteMemo", JSON.stringify(enoteObjectMemo)); //transfere valor da ul para localStorage
        
        renderNote();
        noteInput.value = '';
    }
}

function deleteNoteDo(pos) {
    enoteObjectDo.splice(pos, 1);

    localStorage.setItem("EnoteDo", JSON.stringify(enoteObjectDo));
    renderNote();
}

function deleteNoteMemo(pos) {
    enoteObjectMemo.splice(pos, 1);

    localStorage.setItem("EnoteMemo", JSON.stringify(enoteObjectMemo));
    renderNote();
}

function editNote(){
    //soon!
} 

function renderNote() {
    listDo.innerHTML = '';
    listMemo.innerHTML = '';
    
    for (var note in enoteObjectDo) { //percorre o array de objetos principal: o renderNote
         
        for (var prop in enoteObjectDo[note]) { //percorre cada objeto encontrado
            var noteLi = document.createElement("li"); //cria um novo elemento li 
            var noteText = document.createTextNode(enoteObjectDo[note][prop]);

            var pos = enoteObjectDo.indexOf(enoteObjectDo[note]);
            var linkElement = document.createElement('a');
            linkElement.setAttribute('href', '#');

            linkElement.setAttribute('onclick', 'deleteNoteDo(' + pos + ')');
            var linkText = document.createTextNode('Concluído  |  ');
            
            linkElement.appendChild(linkText);
            noteLi.appendChild(linkElement);
            

            noteLi.appendChild(noteText); //coloca a variavel do input dentro do li
            listDo.appendChild(noteLi); //adiciona li dentro do ul*/
            }
    }

    for (var note in enoteObjectMemo) { //percorre o array de objetos principal: o renderNote
         
        for (var prop in enoteObjectMemo[note]) { //percorre cada objeto encontrado
            var noteLi = document.createElement("li"); //cria um novo elemento li 
            var noteText = document.createTextNode(enoteObjectMemo[note][prop]);

            var pos = enoteObjectDo.indexOf(enoteObjectMemo[note]);
            var linkElement = document.createElement('a');
            linkElement.setAttribute('href', '#');

            linkElement.setAttribute('onclick', 'deleteNoteMemo(' + pos + ')');
            var linkText = document.createTextNode('Apagar Memo  |  ');
            
            linkElement.appendChild(linkText);
            noteLi.appendChild(linkElement);
            

            noteLi.appendChild(noteText); //coloca a variavel do input dentro do li
            listMemo.appendChild(noteLi); //adiciona li dentro do ul*/
            }
    }
}
