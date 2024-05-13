export function Language(text,English) {
    // Regex pattern for Czech-specific characters
    if(English){
    return !(/[čšřžýáíéůďťňóúČŠŘŽÝÁÍÉŮĎŤŇÓÚ]/.test(text));}
    return /[čšřžýáíéůďťňóúČŠŘŽÝÁÍÉŮĎŤŇÓÚ]/.test(text);
    
}