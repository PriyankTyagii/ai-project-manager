import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/inngest/functions";

// Disable body parsing for Inngest
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const handler = serve({
  client: inngest,
  functions,
  signingKey: process.env.INNGEST_SIGNING_KEY,
  // Add streaming option to prevent buffering issues
  streaming: 'allow',
});

export const { GET, POST, PUT } = handler;