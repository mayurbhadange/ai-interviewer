/**
 * Extracts an array of strings from Gemini model output that contains JSON within code blocks
 * @param rawContent - The raw content returned by the Gemini model
 * @returns An array of strings extracted from the content
 */
export function extractQuestionsFromGeminiOutput(rawContent: string): string[] {
  try {
    // Find content between the JSON code blocks
    const jsonRegex = /```(?:json)?\s*(\[[\s\S]*?\])\s*```/;
    const match = rawContent.match(jsonRegex);

    if (!match || !match[1]) {
      throw new Error("Could not find valid JSON array in the content");
    }

    // Parse the extracted JSON string
    const jsonString = match[1].trim();
    const questions = JSON.parse(jsonString);

    // Validate that we have an array of strings
    if (!Array.isArray(questions)) {
      throw new Error("Extracted content is not an array");
    }

    return questions;
  } catch (error) {
    console.error("Error parsing Gemini output:", error);
    // Fallback: try to extract anything that looks like an array
    const fallbackRegex = /\[\s*"([^"]*)"(?:,\s*"([^"]*)")*\s*\]/;
    const fallbackMatch = rawContent.match(fallbackRegex);

    throw new Error("Failed to parse Gemini output");
  }
}
