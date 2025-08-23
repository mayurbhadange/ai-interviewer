import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractQuestionsFromGeminiOutput } from "./parse-question";

export async function generatePersonalQuestions(
  experience: any[] | [],
  projects: any[] | [],
  skills: any[] | []
) {
  try {
    // Import Google Generative AI

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare the context for Gemini
    const experienceContext = experience
      ?.map(
        (exp: any) =>
          `${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date}): ${exp.description}`
      )
      .join("\n");   

    const projectsContext = projects
      ?.map((proj: any) => `Project: ${proj.project_name} - ${proj.description}`)
      .join("\n");

    const skillsContext = skills?.map((skill: any) => skill.name).join(", ");

    // Create the prompt for Gemini
    const prompt = `
    Based on the following user profile, generate 5 personalized interview questions:

    Experience:
    ${experienceContext}

    Projects:
    ${projectsContext}

    Skills:
    ${skillsContext}

    Generate 5 questions that cover the user's experience, projects, and skills. Focus on challenging 
    technical questions related to their skills and projects, and behavioral questions based on their experience.
    Return only the questions as an array of strings, without any additional text.
    `;

    // Call Gemini API
    const generationConfig = {
      temperature: 0.8,
      topP: 1,
      topK: 32,
      maxOutputTokens: 1024,
    };

    const systemInstruction = {
      role: "system",
      parts: [
        {
          text: "You are a smart interview assistant that generates personalized interview questions.",
        },
      ],
    };

    const chat = model.startChat({
      generationConfig,
      systemInstruction,
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;
    const content = response.text();

    // Extract questions using our helper function
    const questions: string[] = extractQuestionsFromGeminiOutput(content);
    return questions;
  } catch (error: any) {
    console.error("Error generating questions with Gemini:", error);
    throw new Error("Failed to generate personal interview questions");
  }
}
