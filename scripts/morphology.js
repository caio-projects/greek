const caseColors = {
  nominative: "green",
  genitive: "purple",
  dative: "red",
  accusative: "lightblue",
  vocative: "yellow",
  verb: "orange",
  ambiguous: "gray",
  indeclinable: "black"
};

function identifyCase(word) {
    if (typeof word !== "string") return ["unknown"];

    word = normalizeGreek(word.toLowerCase());

    const particles = [
      "δε","και","γαρ","ουν","δη","τοι","γε","τε",
      "μη","ου","ουκ","ουχ","η","ει","εαν","αν","κε",
      "περ","μητι","μην","αρα","αγε","ιδου"
    ];

    if (particles.includes(word)) {
        return ["indeclinable"];
    }

    const prepositions = [
      "προς","εν","εις","εκ","εξ","απο","δια","κατα",
      "μετα","παρα","περι","υπερ","υπο","αντι","επι","προ"
    ];

    if (prepositions.includes(word)) {
        return ["indeclinable"];
    }

    // --- Neuter ambiguity rules ---
    if (word.endsWith("α") && word.length > 3) {
        return ["nominative", "accusative"];
    }

    if (word.endsWith("ον")) {
        return ["nominative", "accusative"];
    }

    // --- 1st declension ---
    if (word.endsWith("αι")) return ["nominative"];
    if (word.endsWith("η")) return ["nominative"];
    if (word.endsWith("ας") || word.endsWith("ης") || word.endsWith("ων")) return ["genitive"];
    if (word.endsWith("ᾳ") || word.endsWith("ῃ") || word.endsWith("αις")) return ["dative"];
    if (word.endsWith("αν") || word.endsWith("ην")) return ["accusative"];

    // --- 2nd declension ---
    if (word.endsWith("ος") || word.endsWith("οι")) return ["nominative"];
    if (word.endsWith("ου")) return ["genitive"];
    if (word.endsWith("ῳ") || word.endsWith("οις")) return ["dative"];
    if (word.endsWith("ους")) return ["accusative"];
    if (word.endsWith("ε")) return ["vocative"];

    return ["unknown"];
}

function dye(word) {
  const cases = identifyCase(word);

  if (cases.length > 1) {
    return [caseColors.ambiguous, cases.join("/")];
  }

  const grammaticalCase = cases[0];
  const color = caseColors[grammaticalCase] || "black";

  return [color, grammaticalCase];
}