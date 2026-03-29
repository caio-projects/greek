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

let dictionary = null;

async function loadDictionary() {
    const response = await fetch('dicts/dictionary.json');
    const raw = await response.json();

    dictionary = {};

    for (let key in raw) {
        const normalizedKey = normalizeGreek(key);
        dictionary[normalizedKey] = raw[key];
    }
}

async function findWord(givenWord) {
    if (!dictionary) await loadDictionary();

    const word = normalizeGreek(givenWord);

    console.log("Normalized:", word); // DEBUG

    // 0. Handle articles and irregulars
    const irregulars = {
        "των": ["ho/he/to", "definite article (genitive plural): 'of the'"],
        "του": ["ho/he/to", "definite article (genitive singular): 'of the'"],
        "την": ["ho/he/to", "definite article (accusative feminine singular)"],
        "τον": ["ho/he/to", "definite article (accusative masculine singular)"],
        "τα": ["ho/he/to", "definite article (plural)"],
    };

    if (irregulars[word]) {
        return irregulars[word];
    }

    // 1. Direct match
    if (dictionary[word]) {
        const r = dictionary[word];
        return [r.transliteration, r.definition];
    }

        // 2. Handle contracted verbs (λαλῶ → λαλέω)
    if (word.endsWith("ω")) {
        const stem = word.slice(0, -1);

        const candidates = [
            stem + "εω", // λαλω → λαλεω
            stem + "αω", // τιμω → τιμαω
            stem + "οω"  // δηλω → δηλοω
        ];

        for (let c of candidates) {
            if (dictionary[c]) {
                const r = dictionary[c];
                return [r.transliteration, r.definition];
            }
        }
    }
    // 2. Handle common endings (THIS FIXES γλώσσαις)
    const endings = ["αις", "ων", "ους", "οις", "αι", "ας", "οι"];

    for (let ending of endings) {
        if (word.endsWith(ending)) {
            const stem = word.slice(0, -ending.length);

            const candidates = [
                stem + "α",
                stem + "ος",
                stem + "η",
                stem + "ον"
            ];

            for (let c of candidates) {
                if (dictionary[c]) {
                    const r = dictionary[c];
                    return [r.transliteration, r.definition];
                }
            }
        }
    }

    return null;
}

function normalizeGreek(text) {
    return text
        .normalize("NFD")                 // split accents from letters
        .replace(/[\u0300-\u036f]/g, "")  // remove all diacritics
        .replace(/[^\p{L}\p{N}]/gu, "")   // remove punctuation/symbols
        .toLowerCase();                  // normalize case
}
