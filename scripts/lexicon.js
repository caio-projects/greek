
async function loadPopUp(word) {
    const infos = await findWord(word);
    if (infos) {
        openPopUp(word, infos);
    }
}

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
        "ταις": ["ho/he/to", "definite article (dative plural feminine)"], // ✅ THIS

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
    const endings = [
        "αις","οις","ους","ων",
        "αι","οι","ας",
        "ην","ης","ῃ", // 👈 important feminine endings
        "ος","ον"
    ];
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
