import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { functions } from "@/inngest/functions";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function createHandler() {
  return serve({
    client: inngest,
    functions,
    signingKey: process.env.INNGEST_SIGNING_KEY,
    streaming: 'allow',
  });
}

const handler = createHandler();

export const { GET, POST, PUT } = handler;
