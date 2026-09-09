import { NextRequest } from 'next/server';
import path from 'path';
import { LocalIndex } from 'vectra';
import ollama from 'ollama';

const INDEX_DIR = path.join(process.cwd(), 'rag_index');

async function retrieveContext(query: string): Promise<string> {
  try {
    const index = new LocalIndex(INDEX_DIR);
    const embRes = await ollama.embed({ model: 'nomic-embed-text', input: query });
    const vector = embRes.embeddings[0];
    const results = await index.queryItems(vector, query, 4, {});
    if (!results.length) return '';
    return results.map((r: any) => r.item.metadata.text).join('\n\n');
  } catch (e) {
    console.error('RAG retrieval failed:', e);
    return '';
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const userQuery = messages.at(-1)?.content ?? '';

    const context = await retrieveContext(userQuery);

    const systemPrompt = `You are a helpful shopping assistant for the Brandtech fashion store.
Answer the customer's question using the FAQ knowledge below.
If the answer isn't in the FAQ, use your general knowledge but stay relevant to fashion/shopping.
Be concise and friendly.

${context ? `Relevant FAQ:\n${context}` : ''}`;

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3.2',
        stream: true,
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          for (const line of chunk.split('\n').filter(Boolean)) {
            try {
              const json = JSON.parse(line);
              const text = json.message?.content ?? '';
              if (text) controller.enqueue(encoder.encode(text));
            } catch {}
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return new Response(JSON.stringify({ error: 'Chat service failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
