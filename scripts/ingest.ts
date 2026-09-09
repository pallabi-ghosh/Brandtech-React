import path from "path";
import { readFileSync } from "fs";
import { LocalIndex } from "vectra";
import ollama from "ollama";

const FAQ_DATA = path.join(process.cwd(), "scripts/faq_data.json");
const INDEX_DIR = path.join(process.cwd(), "rag_index");

interface FAQItem {
  section: string;
  q: string;
  a: string;
}

async function getEmbedding(text: string): Promise<number[]> {
  const res = await ollama.embed({
    model: "nomic-embed-text",
    input: text,
  });
  return res.embeddings[0];
}

async function ingest() {
  console.log("\n=== Brandtech RAG Ingestion ===\n");

  // Step 1: Load FAQ data
  console.log("Step 1: Loading FAQ data...");
  const faqs: FAQItem[] = JSON.parse(readFileSync(FAQ_DATA, "utf-8"));
  console.log(`  Loaded ${faqs.length} Q&A pairs`);

  // Step 2: Build chunks — each chunk = "Q: ... A: ..."
  console.log("\nStep 2: Building chunks...");
  const chunks = faqs.map((item) => ({
    text: `Q: ${item.q} A: ${item.a}`,
    section: item.section,
    question: item.q,
  }));
  console.log(`  Built ${chunks.length} chunks`);
  console.log(`  Sample: ${chunks[0].text.slice(0, 80)}...`);

  // Step 3: Create or open the vector index
  console.log("\nStep 3: Setting up vector index at ./rag_index ...");
  const index = new LocalIndex(INDEX_DIR);
  if (!(await index.isIndexCreated())) {
    await index.createIndex();
    console.log("  New index created.");
  } else {
    console.log("  Existing index found, re-using.");
  }

  // Step 4: Embed each chunk and store it
  console.log("\nStep 4: Embedding and storing chunks (this takes a few minutes)...");
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`  [${i + 1}/${chunks.length}] Embedding: "${chunk.question.slice(0, 50)}"...\r`);
    const vector = await getEmbedding(chunk.text);
    await index.insertItem({
      vector,
      metadata: {
        text: chunk.text,
        section: chunk.section,
        question: chunk.question,
      },
    });
  }

  console.log(`\n\n  Done! ${chunks.length} chunks embedded and stored.`);
  console.log("\n=== Ingestion complete. Run the dev server to test RAG queries. ===\n");
}

ingest().catch((err) => {
  console.error("\nIngestion failed:", err.message);
  process.exit(1);
});
