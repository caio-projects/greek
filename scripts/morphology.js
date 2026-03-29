const caseColors = {
  nominative: "green",
  genitive: "purple",
  dative: "red",
  accusative: "lightblue",
  vocative: "yellow",
  verb: "orange"
};

function identifyCase(word) {
  // Normalize
  word = word.toLowerCase();

  // 1st declension endings
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

  // fallback
  return "unknown";
}

function dye(word) {
  const grammaticalCase = identifyCase(word);
  const color = caseColors[grammaticalCase] || "black";

  return color;
}