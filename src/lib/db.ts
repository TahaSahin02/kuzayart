import { neon } from "@neondatabase/serverless";

let _client: ReturnType<typeof neon> | null = null;

function getDb() {
  if (!_client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not set");
    _client = neon(url);
  }
  return _client;
}

// Typed wrapper — always returns Record<string, unknown>[]
export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  const result = await getDb()(strings, ...values);
  return result as Record<string, unknown>[];
}
