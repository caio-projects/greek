function loadContent(){
    separateContent();
};

function separateContent(){
    var contentDiv = document.getElementsByClassName("content")[0];
    var mainElement = document.getElementById("main-content");
    var mainContent = mainElement.textContent;
    var mainArray = mainContent.split(" ");

    mainElement.parentNode.removeChild(mainElement);
    for(let word = 0; word <= mainArray.length-1; word++){
    var span = document.createElement('span');
    span.textContent = mainArray[word];
    span.onclick = () => loadPopUp(mainArray[word]);
    contentDiv.appendChild(span); 
    };
};

function loadPopUp(word){
    openPopUp(word);
    findWord(word);
};

function openPopUp(word){
    var modal = document.getElementsByClassName("modal")[0];
    var title = document.getElementById("content-word");
    title.innerText = word;
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 
};

function findWord(word){
};