import { NextResponse } from 'next/server';

// This runs when you visit /api/jobs/[id] in your browser or fetch it
export async function GET() {
  return NextResponse.json({ 
    message: "Hello World from the GET route!" 
  });
}

// This runs when you send a POST request to /api/jobs/[id]
export async function POST() {
  return NextResponse.json({ 
    message: "Hello World from the POST route! Job created." 
  });
}