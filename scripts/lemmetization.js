
// -----------------------------
// Dictionary loader
// -----------------------------
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

// -----------------------------
// Main lemmatizer function
// -----------------------------
async function findWord(givenWord) {
    if (!dictionary) await loadDictionary();

    const word = normalizeGreek(givenWord);
    console.log("Normalized:", word); // DEBUG

    // 0️⃣ Handle irregulars and articles first
    const irregulars = {
        "των": "των",
        "του": "του",
        "την": "την",
        "τον": "τον",
        "τα": "τα",
        "ταις": "ταις"
    };
    if (irregulars[word] && dictionary[irregulars[word]]) {
        const r = dictionary[irregulars[word]];
        return [r.transliteration, r.definition];
    }

    // 1️⃣ Direct match
    if (dictionary[word]) {
        const r = dictionary[word];
        return [r.transliteration, r.definition];
    }

    // -----------------------------
    // 2️⃣ Noun/Adjective declensions
    // -----------------------------
    const nounEndings = {
        // First declension (mostly feminine)
        "α": ["α"],
        "ας": ["α"],
        "ᾳ": ["α"],
        "αν": ["α"],
        "αι": ["α"],
        "αις": ["α"],
        "ων": ["α"],

        // Second declension (masc/neut)
        "ος": ["ος"],
        "ου": ["ος"],
        "ῳ": ["ος"],
        "ον": ["ον"],
        "οι": ["ος"],
        "οις": ["ος"],
        "ους": ["ος"],

        // Third declension fallback
        "ης": ["η"],
        "ην": ["η"],
        "ῃ": ["η"],
        "ες": ["ης"]
    };

    for (let ending in nounEndings) {
        if (word.endsWith(ending)) {
            const stem = word.slice(0, -ending.length);
            for (let lemmaEnding of nounEndings[ending]) {
                const candidate = stem + lemmaEnding;
                if (dictionary[candidate]) {
                    const r = dictionary[candidate];
                    return [r.transliteration, r.definition];
                }
            }
        }
    }

    // -----------------------------
    // 3️⃣ Verb endings (present/contracted verbs + participles)
    // -----------------------------
    const verbEndings = {
        // Present indicative/contracted verbs
        "ω": ["ω", "εω", "αω", "οω"],

        // Present participles
        "ων": ["ω"],
        "οντος": ["ω"],
        "οντι": ["ω"],
        "οντα": ["ω"],
        "ουσα": ["ω"],
        "ουσης": ["ω"],
        "ουσῃ": ["ω"],
        "ουσαν": ["ω"],
        "ον": ["ω"]
    };

    for (let ending in verbEndings) {
        if (word.endsWith(ending)) {
            const stem = word.slice(0, -ending.length);
            for (let lemmaEnding of verbEndings[ending]) {
                const candidate = stem + lemmaEnding;
                if (dictionary[candidate]) {
                    const r = dictionary[candidate];
                    return [r.transliteration, r.definition];
                }
            }
        }
    }

    // -----------------------------
    // 4️⃣ Irregular adjectives (πᾶς / πᾶσα / πᾶν etc.)
    // -----------------------------
    const irregularAdjectives = {
        "πασαν": "πᾶς",
        "πασα": "πᾶς",
        "παν": "πᾶς",
        "παντα": "πᾶς",
        "παντων": "πᾶς",
        "παντι": "πᾶς"
    };
    if (irregularAdjectives[word] && dictionary[irregularAdjectives[word]]) {
        const r = dictionary[irregularAdjectives[word]];
        return [r.transliteration, r.definition];
    }

    // -----------------------------
    // 5️⃣ Fallback: maybe it's already a lemma
    // -----------------------------
    if (dictionary[normalizeGreek(givenWord)]) {
        const r = dictionary[normalizeGreek(givenWord)];
        return [r.transliteration, r.definition];
    }

    return null;
}

// -----------------------------
// Helper: normalize Greek text
// -----------------------------
function normalizeGreek(text) {
    return text
        .normalize("NFD")                 // split accents
        .replace(/[\u0300-\u036f]/g, "")  // remove diacritics
        .replace(/[^\p{L}\p{N}]/gu, "")   // remove punctuation
        .toLowerCase();                   // normalize case
}