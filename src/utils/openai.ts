import OpenAI from 'openai';

/**
 * Creates and configures the OpenAI client
 */
export function createOpenAIClient(): OpenAI {
  // Ensure the API key is available
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  // Create a new OpenAI client instance
  const openai = new OpenAI({
    apiKey,
    // Optional: Add additional configuration options as needed
    // dangerouslyAllowBrowser: true, // Use this if you need client-side usage
  });

  return openai;
}

/**
 * Singleton instance of the OpenAI client
 */
export const openai = createOpenAIClient();

// Export the OpenAI types for convenience
export type { OpenAI };
