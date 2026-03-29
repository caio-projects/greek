function loadContent(){
    separateContent();
};

function separateContent(){
    var contentDiv = document.getElementsByClassName("content")[0];
    var mainElement = document.getElementById("main-content");
    var mainContent = mainElement.textContent;
    var mainArray = mainContent
    .split(/\s+/)
    .map(word => word.replace(/[^\p{L}]+/gu, "")) // keep only letters
    .filter(word => word.length > 0);

    mainElement.parentNode.removeChild(mainElement);
    for(let word = 0; word <= mainArray.length-1; word++){
        var span = document.createElement('span');
        span.textContent = mainArray[word];
        span.style.color = dye(mainArray[word])[0];
        span.title = dye(mainArray[word])[1];
        span.onclick = () => loadPopUp(mainArray[word]);
        contentDiv.appendChild(span); 
    };
};

async function loadPopUp(word) {
    const infos = await findWord(word);
    if (infos) {
        openPopUp(word, infos);
    }
}

function openPopUp(word, infos){
    console.log(infos);
    var modal = document.getElementsByClassName("modal")[0];
    var title = document.getElementById("content-word");
    var transliterationParagraph = document.getElementById("transliterationP");
    var definitionParagraph = document.getElementById("definitionP");
    transliterationParagraph.innerText = 'Transliteration: '+infos[0];
    definitionParagraph.innerText = 'Definition: '+infos[1];
    title.innerText = word;
    modal.style.display = "block";
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    } 
};