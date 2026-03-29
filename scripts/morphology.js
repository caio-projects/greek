const caseColors = {
  nominative: "green",
  genitive: "purple",
  dative: "red",
  accusative: "lightblue",
  vocative: "yellow",
  verb: "orange"
};

function identifyCase(word) {
    if (typeof word !== "string") return "unknown";

    word = normalizeGreek(word.toLowerCase());

    const particles = [
    "δε",   // but, and
    "και",  // and, also
    "γαρ",  // for
    "ουν",  // therefore
    "δη",   // indeed, now
    "τοι",  // surely
    "γε",   // at least, indeed
    "τε",   // and (enclitic)
    "μη",   // not (non-indicative)
    "ου",   // not (indicative)
    "ουκ",  // not (before vowel)
    "ουχ",  // not (before rough breathing)
    "η",    // or / than
    "ει",   // if
    "εαν",  // if (conditional)
    "αν",   // modal particle
    "κε",   // variant of αν (rare)
    "περ",  // even, although
    "μητι", // lest, perhaps
    "μην",  // truly, indeed
    "αρα",  // then, therefore (question nuance)
    "αγε",  // come! (exhortation)
    "ιδου"  // behold (technically interjection, but treat same)
    ];
    
    if (particles.includes(word)) {
    return "particle";
    }
    // 1st declension
    if (word.endsWith("α") || word.endsWith("η") || word.endsWith("αι")) {
        return "nominative";
    }
    if (word.endsWith("ας") || word.endsWith("ης") || word.endsWith("ων")) {
        return "genitive";
    }
    if (word.endsWith("ᾳ") || word.endsWith("ῃ") || word.endsWith("αις")) {
        return "dative";
    }
    if (word.endsWith("αν") || word.endsWith("ην") || word.endsWith("ας")) {
        return "accusative";
    }

    // 2nd declension
    if (word.endsWith("ος") || word.endsWith("οι")) {
        return "nominative";
    }
    if (word.endsWith("ου")) {
        return "genitive";
    }
    if (word.endsWith("ῳ") || word.endsWith("οις")) {
        return "dative";
    }
    if (word.endsWith("ον") || word.endsWith("ους")) {
        return "accusative";
    }
    if (word.endsWith("ε")) {
        return "vocative";
    }

    return "unknown";
}

function dye(word) {
  const grammaticalCase = identifyCase(word);
  const color = caseColors[grammaticalCase] || "black";

  return [color, grammaticalCase];
}