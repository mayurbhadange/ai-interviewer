import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractQuestionsFromGeminiOutput } from "./parse-question";

export async function generateCustomQuestions(
  skills: string[],
  jobDescription: string
) {
  try {
    // Import Google Generative AI

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Extract skill names from the skills array of objects
    const skillsContext = skills.map((skill) => skill).join(", ");

    // Create the prompt for Gemini
    const prompt = `
      Create 5 targeted interview questions based on the following job requirements and skills:
  
      Job Description:
      ${jobDescription}
  
      Required Skills:
      ${skillsContext}
  
      Generate 5 technical and behavioral questions that would effectively assess a candidate's suitability for this role.
      The questions should specifically address the listed skills and job requirements.
      Focus on challenging questions that reveal both technical proficiency and practical experience.
      Include at least one problem-solving scenario related to the job description.
      Return only the questions as an array of strings, without any additional text.
      STRICTLY RETURN AS ARRAY OF STRINGS. SO THAT IT IS EASY TO SEND DATA. 
      For Example :- 
      [
        "This is questions1", "This is question 2", ...]
      ]
      `;

    // Call Gemini API
    const generationConfig = {
      temperature: 0.7,
      topP: 1,
      topK: 32,
      maxOutputTokens: 1024,
    };

    const systemInstruction = {
      role: "system",
      parts: [
        {
          text: "You are an expert interview question generator that creates custom questions based on job requirements and skills.",
        },
      ],
    };

    const chat = model.startChat({
      generationConfig,
      systemInstruction, // Pass the corrected system instruction
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const content = response.text();

    // Extract questions using our helper function
    const questions: string[] = extractQuestionsFromGeminiOutput(content);
    return questions;
  } catch (error: any) {
    console.error("Error generating custom questions with Gemini:", error);
    throw new Error("Failed to generate custom interview questions");
  }
}
