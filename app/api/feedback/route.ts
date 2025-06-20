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
      prompt: `You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        'You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories',
    });


    // Check for existing feedback with userId and interviewId, limit to 1 document
    const querySnapshot = await db.collection('feedback')
      .where('userId', '==', userId)
      .where('interviewId', '==', interviewId)
      .limit(1)
      .get();

    // Delete the existing feedback if found
    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      await existingDoc.ref.delete();
    }

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
