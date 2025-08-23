import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

/**
 * Converts an array of strings into a single string with serial numbers
 * @param stringArray - Array of strings to be combined
 * @param separator - Optional separator between numbered items (default: newline)
 * @param startNumber - Optional starting number for enumeration (default: 1)
 * @returns Combined string with serial numbers
 */
function convertArrayToStringWithNumbers(
  stringArray: string[],
  separator: string = "\n",
  startNumber: number = 1
): string {
  // Map each string to include a serial number, then join with separator
  return stringArray
    .map((str, index) => `${index + startNumber}. ${str}`)
    .join(separator);
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const interview_id = url.searchParams.get("interview_id");

  try {
    const supabase = createClient();
    const result = await supabase
      .from("interviews")
      .select()
      .eq("id", interview_id)
      .single();

    const questions = convertArrayToStringWithNumbers(result.data.questions);

    if (result.error) {
      return NextResponse.json(
        {
          status: false,
          message: "Interview questions not found!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        context: questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error: ", error);
  }
}
