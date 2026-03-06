import { NextRequest, NextResponse } from "next/server";
interface JobPayload {
  title: string;
  description: string;
  location?: string;
  jobType: string;
  contact?: string;
  posterUid: string;
  createdAt?: string;
}

// This runs when you visit /api/jobs in your browser or fetch it
export async function GET() {
  return NextResponse.json({
    message: "Hello World from the GET route!",
  });
}

// This runs when you send a POST request to /api/jobs
export async function POST(req: NextRequest) {
  const job: JobPayload = await req.json();

  // TODO: persist to a database (Firestore, Postgres, …)
  // e.g. await jobsCollection.add({ ...job, createdAt: new Date().toISOString() });

  return NextResponse.json({ success: true, job });
}
