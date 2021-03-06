import { ArgParsingOptions, Args, join, parse } from "./deps.ts";

export type ScriptRunFn = (args: string[]) => Promise<boolean>;

export interface DirItem {
  name: string;
  type: "file" | "dir" | "symlink";
}

const dirItemTypePad = 7;

export function parseArgs<T extends Args>(
  args: string[],
  opts?: ArgParsingOptions,
): T | undefined {
  let unknownOptions: string[] = [];
  const parsed = parse(
    args,
    {
      ...opts,
      unknown: (arg) => {
        if (arg.startsWith("-")) {
          unknownOptions.push(arg);
        }
      },
    },
  ) as T;

  if (unknownOptions.length > 0) {
    console.error(`Unknown options: ${unknownOptions.join(", ")}`);
    return undefined;
  }

  return parsed;
}

export async function exists(
  path: string,
  type: "file" | "dir" | "symlink",
): Promise<boolean> {
  try {
    const item = await Deno.lstat(path);
    return (type === "file" && item.isFile) ||
      (type === "dir" && item.isDirectory) ||
      (type === "symlink" && item.isSymlink);
  } catch {
    return false;
  }
}

export async function assertAllExist(
  items: DirItem[],
  dir?: string,
): Promise<boolean> {
  dir = dir ?? Deno.cwd();

  const missing: DirItem[] = [];
  for (const item of items) {
    const path = join(dir, item.name);

    if (!(await exists(path, item.type))) {
      missing.push(item);
    }
  }

  if (missing.length > 0) {
    console.error(
      "The following files were missing from the current directory:",
    );

    for (const miss of missing) {
      console.log(`[${miss.type.padStart(dirItemTypePad)}] ${miss.name}`);
    }

    return false;
  } else {
    return true;
  }
}
