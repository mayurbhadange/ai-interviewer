import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();
    
    // Format the transcript for prompt
    const formattedTranscript = transcript
      .map(
        (
          exchange: {
            assistant: string;
            client: string;
          },
          index: number
        ) => `
    Question ${index + 1}: ${exchange.assistant}
    Answer ${index + 1}: ${exchange.client}
    `
      )
      .join("\n");

    // Create the prompt for Gemini
    const prompt = `Analyze the following interview conversation based on the transcript and provide feedback directly to the interviewee. 
    ${formattedTranscript}
    
    For each response, STRICTLY FOLLOW this exact formatting WITHOUT ANY ASTERISKS:
    
    Label: [GOOD/NEEDS_IMPROVEMENT]
    Question: [Interviewer's question]
    Your Answer: [Interviewee's answer]
    Feedback: [Provide direct feedback to the interviewee]
    Category: [List applicable categories from:
    - Formality of Language
    - Clarity of Content
    - Logical Organization
    - Conciseness
    - Relevance to Question
    - Completeness of Answer]
    Suggestions for improvement: [Specific improvements for each listed category]
    
    Overall Performance Summary
    After analyzing all individual responses, provide a summary using this format:

    For each response, STRICTLY FOLLOW this exact formatting WITHOUT ANY ASTERISKS:

    Relevant Responses: [How well answers aligned with questions]
    Clarity and Structure: [Coherence and organization of answers]
    Professional Language: [Professionalism of language]
    Initial Ideas: [Originality or thoughtfulness]
    Additional Notable Aspects: [Other strengths or improvement areas]
    Score: [X/10]
    
    IMPORTANT INSTRUCTIONS:
    1. Use the EXACT format shown above
    2. Do NOT use asterisks anywhere
    3. Be direct and specific in your feedback
    4. Address the interviewee directly
    
    Example:
    Label: Needs Improvement
    Question: Tell me about your previous work experience
    Your Answer: I worked at companies and did stuff
    Feedback: Your response lacks specific details and professional language
    Category: Formality of Language, Clarity of Content, Completeness of Answer
    Suggestions for improvement: Use more formal business language, Provide specific details about roles and responsibilities, Include timeline and company names with concrete achievements
    
    Example Overall Performance Summary:
    Relevant Responses: Your responses needed more alignment with the questions asked
    Clarity and Structure: Responses lacked proper structure and organization
    Professional Language: Language used was too informal for an interview setting
    Initial Ideas: You showed some creative thinking in your approaches
    Additional Notable Aspects: Need to improve response completeness
    Score: 5/10`;

    // Initialize the Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Generate content using Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2500,
      },
    });

    const gemini_feedback = result.response.text().trim();

    return NextResponse.json({
      status: true,
      message: "Feedback generated successfully!",
      data: gemini_feedback,
    });
  } catch (err: any) {
    console.error("Error: ", err);
    return NextResponse.json({
      status: false,
      message: `Error generating feedback: ${err.message}`,
      error: err,
    }, { status: 500 });
  }
}