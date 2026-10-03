import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readCollection<T>(name: string): T[] {
  ensureDataDir();
  const file = filePath(name);
  if (!fs.existsSync(file)) {
    return [];
  }
  const raw = fs.readFileSync(file, "utf-8");
  if (!raw.trim()) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeCollection<T>(name: string, data: T[]) {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Tiny JSON-file "database" for this prototype. Good enough for a single-process
 * demo; not safe under concurrent writes (no locking) and not meant for real traffic.
 */
export const db = {
  read: readCollection,
  write: writeCollection,
  append<T>(name: string, item: T): T {
    const items = readCollection<T>(name);
    items.push(item);
    writeCollection(name, items);
    return item;
  },
  update<T extends { id: string }>(
    name: string,
    id: string,
    patch: Partial<T>,
  ): T | null {
    const items = readCollection<T>(name);
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...patch };
    writeCollection(name, items);
    return items[idx];
  },
  remove<T extends { id: string }>(name: string, id: string): boolean {
    const items = readCollection<T>(name);
    const next = items.filter((i) => i.id !== id);
    writeCollection(name, next);
    return next.length !== items.length;
  },
  find<T extends { id: string }>(name: string, id: string): T | null {
    const items = readCollection<T>(name);
    return items.find((i) => i.id === id) ?? null;
  },
  findBy<T>(name: string, predicate: (item: T) => boolean): T | null {
    const items = readCollection<T>(name);
    return items.find(predicate) ?? null;
  },
  removeBy<T>(name: string, predicate: (item: T) => boolean): boolean {
    const items = readCollection<T>(name);
    const next = items.filter((i) => !predicate(i));
    writeCollection(name, next);
    return next.length !== items.length;
  },
};
