export async function extractKeywordsFromText(text) {
    const programmingLanguages = [
    'JavaScript', 'Java', 'Python', 'Ruby', 'PHP', 'C#', 'C++', 'TypeScript', 'Swift', 
    'Kotlin', 'Go', 'Rust', 'Scala', 'Perl', 'Lua', 'Haskell', 'Objective-C', 'Dart', 'Groovy',
    'Clojure', 'Elm', 'Erlang', 'Fortran', 'Lisp', 'Matlab', 'Pascal', 'R', 'SQL', 'VBA', 
    'Visual Basic', 'Assembly', 'Bash', 'Shell',
  ];

  programmingLanguages.sort((a, b) => b.length - a.length);

  const foundLanguages = programmingLanguages.filter(language => {
    // Escape regex special characters in language names
    const escapedLanguage = language.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Use a lookbehind and lookahead to ensure the language stands alone
    const pattern = new RegExp(`(?<!\\w)${escapedLanguage}(?!\\w)`, 'gi');
    return pattern.test(text);
  });

  // Special handling for 'C' to avoid matching 'C++' or 'C#'
  if (text.match(/(?<!\w)C(?!\+|#|\w)/gi)) {
    foundLanguages.push('C');
  }  
  return foundLanguages;
}
