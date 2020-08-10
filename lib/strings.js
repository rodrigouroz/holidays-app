import stringSimilarity from 'string-similarity';

const slugify = (str) => {
  const map = {
    '-': '_',
    a: 'á|à|ã|â|À|Á|Ã|Â',
    e: 'é|è|ê|É|È|Ê',
    i: 'í|ì|î|Í|Ì|Î',
    o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
    u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
    c: 'ç|Ç',
    n: 'ñ|Ñ',
  };

  for (let pattern in map) {
    str = str.replace(new RegExp(map[pattern], 'g'), pattern);
  }

  return str;
};

export default function phraseMatches(phraseToMatch, phrase, threshold = 0.8) {
  let searchWhat;
  let searchIn;

  if (phrase.length > phraseToMatch.length) {
    searchWhat = slugify(phraseToMatch.trim().toLowerCase());
    searchIn = slugify(phrase.trim().toLowerCase());
  } else {
    searchWhat = slugify(phrase.trim().toLowerCase());
    searchIn = slugify(phraseToMatch.trim().toLowerCase());
  }

  // try some shortcuts
  if (searchWhat == searchIn || searchIn.includes(searchWhat)) {
    return true;
  }

  const phraseArray = searchIn.split(' ');
  const string_length = searchWhat.split(' ').length;

  for (let i = 0; i <= phraseArray.length - string_length; i++) {
    const subPhrase = phraseArray.slice(i, i + string_length).join(' ');
    if (
      stringSimilarity.compareTwoStrings(searchWhat, subPhrase) >= threshold
    ) {
      return true;
    }
  }

  return false;
}
