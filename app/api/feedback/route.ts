import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { interviewId, userId, transcript } = await req.json();

    const formattedTranscript = transcript.map(
      (s: { role: string; content: string }) => `- ${s.role}: ${s.content}\n`
    ).join('');

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google('gemini-2.0-flash-001', {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories...
      
      Transcript:
      ${formattedTranscript}

      Please score the candidate from 0 to 100 in the following areas:
      - Communication Skills
      - Technical Knowledge
      - Problem-Solving
      - Cultural & Role Fit
      - Confidence & Clarity
      `,
      system:
        'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories.',
    });

    const feedback = await db.collection('feedback').add({
      interviewId,
      userId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, feedbackId: feedback.id });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
