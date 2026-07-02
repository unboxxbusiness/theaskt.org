/**
 * Splits a long body of text into smaller, natural sentences or sentence groups.
 * Prevents SpeechSynthesis engines from locking up or freezing on large string buffers.
 */
export function splitSpeechChunks(text: string, maxChunkLength: number = 200): string[] {
  if (!text) return [];

  // Split by sentence ending marks (. ! ?) followed by whitespace or string boundaries
  const sentenceRegex = /[^.!?]+[.!?]+(?:\s+|$)/g;
  const sentences = text.match(sentenceRegex) || [text];
  
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();
    if (!cleanSentence) continue;

    // If combining exceeds the length constraint, store current chunk and reset
    if ((currentChunk + " " + cleanSentence).length > maxChunkLength) {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = cleanSentence;
    } else {
      currentChunk = currentChunk ? `${currentChunk} ${cleanSentence}` : cleanSentence;
    }
  }

  // Push remaining contents
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
