const pdf = require('pdf-parse');

/**
 * @param {string} url
 */
async function extractTextFromPDF(url) {
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error; // Rethrow the error so it can be caught by the caller
  }
}

module.exports = { extractTextFromPDF };