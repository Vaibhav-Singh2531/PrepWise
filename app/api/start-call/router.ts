// app/api/start-call/route.ts
import { NextResponse } from 'next/server';
import { VapiClient } from '@vapi-ai/server-sdk';

const serverVapi = new VapiClient({
  token: process.env.VAPI_API_KEY!,
  baseUrl: process.env.VAPI_API_BASE_URL, // optional
});

export async function POST(request: Request) {
  try {
    // No body needed for pure web flow
    const response = await serverVapi.calls.create({
      workflowId: process.env.VAPI_WORKFLOW_ID!,
    });

    const callId = (response as any).id as string;
    return NextResponse.json({ callId });
  } catch (e: any) {
    console.error('start-call error:', e);
    return NextResponse.json(
      { error: e.message || 'Internal error' },
      { status: e.statusCode || 500 }
    );
  }
}
