import { NextRequest } from 'next/server';
import { TOOLS, callTool } from '@/lib/agentTools';

const SYSTEM_PROMPT = `You are a helpful shopping assistant for the Brandtech fashion store.
You have access to tools to search the FAQ, search products, and check stock.
Always call the appropriate tool — never answer product questions from memory.

CRITICAL RULES:
- Only show products that the tool actually returns. Never invent products.
- When a tool result includes "Image: <url>", display it as: ![product name](url)
- When a tool result includes "Link: <url>", use that EXACT url as: [View product](url)
- NEVER construct or guess URLs. Only use links from tool results.
- Be concise and friendly. Mention prices in DKK.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // The harness loop — keeps running until the model stops calling tools
    const conversationMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ];

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let iterations = 0;
        const MAX_ITERATIONS = 5; // safety cap

        while (iterations < MAX_ITERATIONS) {
          iterations++;

          // Call Ollama (non-streaming while in tool loop)
          const res = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3.2',
              stream: false,
              tools: TOOLS,
              messages: conversationMessages,
            }),
          });

          if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
          const data = await res.json();
          const assistantMsg = data.message;

          // No tool calls → final answer, stream it out
          if (!assistantMsg.tool_calls || assistantMsg.tool_calls.length === 0) {
            const text = assistantMsg.content ?? '';
            controller.enqueue(encoder.encode(text));
            break;
          }

          // Execute each tool call
          conversationMessages.push(assistantMsg);
          for (const tc of assistantMsg.tool_calls) {
            const toolName = tc.function.name;
            const toolArgs = tc.function.arguments ?? {};
            console.log(`[Agent] calling tool: ${toolName}`, toolArgs);

            const result = await callTool(toolName, toolArgs);
            console.log(`[Agent] tool result:`, result);

            conversationMessages.push({
              role: 'tool',
              content: result,
            });
          }
          // Loop again — model will now use the tool results to form its answer
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Agent API error:', err);
    return new Response(JSON.stringify({ error: 'Chat service failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
