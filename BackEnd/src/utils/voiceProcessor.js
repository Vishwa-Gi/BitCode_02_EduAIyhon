const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const processVoiceInput = async (voiceData) => {
    try {
        // Convert voice data to text (in a real application, you would use a speech-to-text service)
        const text = voiceData; // This would be replaced with actual speech-to-text conversion

        // Tokenize the text
        const tokens = tokenizer.tokenize(text);

        // Remove common words and keep important keywords
        const keywords = tokens.filter(word => {
            const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by'];
            return !commonWords.includes(word.toLowerCase());
        });

        // Join keywords to form the search query
        return keywords.join(' ');
    } catch (error) {
        console.error('Error processing voice input:', error);
        throw new Error('Failed to process voice input');
    }
};

module.exports = {
    processVoiceInput
}; 