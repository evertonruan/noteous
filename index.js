var noteInput = document.querySelector("#noteInput");
var noteButtonEdit = document.querySelector('#noteButtonEdit');
var noteButtonDo = document.querySelector("#noteButtonDo");
var noteButtonMemo = document.querySelector("#noteButtonMemo");
var posId = document.querySelector('#posId');
var noteInputEdit = document.querySelector("#noteInputEdit");
var editWindowBack = document.querySelector("#editWindowBack");
var editWindow = document.querySelector("#editWindow");

var listDo = document.querySelector("#listDo");
var listMemo = document.querySelector("#listMemo");
var pos;
var editPos;

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


function editNoteDo(pos){
    console.log(pos);
    editWindow.style.visibility = "visible";
    editWindowBack.style.visibility = "visible";
    enoteObjectDoOpened = enoteObjectDo[pos];
    for (var note in enoteObjectDoOpened) { //percorre o array de objetos principal: o renderNote
            console.log(posId.value);
            noteInputEdit.value = enoteObjectDoOpened[note];
            posId.value = pos;
            console.log(posId.value);
    }
}

function setEditNoteDo() {
    var noteInputValue = noteInputEdit.value;
    var objDo = {
        text: noteInputValue
    };

    enoteObjectDo.splice(posId.value, 1, objDo);
    console.log(enoteObjectDo);

    localStorage.setItem("EnoteDo", JSON.stringify(enoteObjectDo));
    renderNote();
    noteInputEdit.value = '';
    editWindow.style.visibility = "hidden";
    editWindowBack.style.visibility = "hidden";
}

function editNoteMemo(){
    //soon!
} 

function renderNote() {
    listDo.innerHTML = '';
    listMemo.innerHTML = '';
    
    for (var note in enoteObjectDo) { //percorre o array de objetos principal: o renderNote
         
        for (var prop in enoteObjectDo[note]) { //percorre cada objeto encontrado
            var noteLi = document.createElement("li"); //cria um novo elemento li 
            var noteText = document.createTextNode(enoteObjectDo[note][prop]);

            pos = enoteObjectDo.indexOf(enoteObjectDo[note]);
            
            var deleteLink = document.createElement('a');
            deleteLink.classList.add("material-icons")
            deleteLink.setAttribute('href', '#');
            deleteLink.setAttribute('onclick', 'deleteNoteDo(' + pos + ')');
            var deleteText = document.createTextNode('check_circle');
            deleteLink.appendChild(deleteText);
            noteLi.appendChild(deleteLink);

            var editLink = document.createElement('a');
            editLink.classList.add("material-icons");
            editLink.setAttribute('href', '#');
            editLink.setAttribute('onclick', 'editNoteDo(' + pos + ')');            
            var editText = document.createTextNode('edit')
            editLink.appendChild(editText);
            noteLi.appendChild(editLink);

            var newLine = document.createElement('br');
            noteLi.appendChild(newLine);   

            noteLi.appendChild(noteText); //coloca a variavel do input dentro do li

            listDo.appendChild(noteLi); //adiciona li dentro do ul*/
            }
    }

    for (var note in enoteObjectMemo) { //percorre o array de objetos principal: o renderNote
         
        for (var prop in enoteObjectMemo[note]) { //percorre cada objeto encontrado
            var noteLi = document.createElement("li"); //cria um novo elemento li 
            var noteText = document.createTextNode(enoteObjectMemo[note][prop]);

            pos = enoteObjectDo.indexOf(enoteObjectMemo[note]);
            var linkElement = document.createElement('a');
            linkElement.classList.add("material-icons");
            linkElement.setAttribute('href', '#');
            linkElement.setAttribute('onclick', 'deleteNoteMemo(' + pos + ')');
            
            linkText = document.createTextNode('delete');

            linkElement.appendChild(linkText);
            noteLi.appendChild(linkElement);

            var newLine = document.createElement("br");
            noteLi.appendChild(newLine);

            noteLi.appendChild(noteText); //coloca a variavel do input dentro do li
            listMemo.appendChild(noteLi); //adiciona li dentro do ul*/
            }
    }
}
