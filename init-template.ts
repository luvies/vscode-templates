#!/usr/bin/env deno run --allow-read --allow-write --allow-run
import { dirname, fromFileUrl, join } from "./deps.ts";
import { exists, parseArgs, ScriptRunFn } from "./utils.ts";

function exitHelp(code?: number): never {
  console.log("init-template [template]");
  console.log(
    "\tA script that will initialise a VSCode template in the current directory",
  );
  console.log();
  console.log("Arguments:");
  console.log("\ttemplate\t- The template to initialise");
  console.log("\t--help -h\t- Prints this help text");
  Deno.exit(code);
}

interface Args {
  _: string[];
  h: boolean;
  help: boolean;
  "--": string[];
}

const args = parseArgs<Args>(
  Deno.args,
  {
    "--": true,
    boolean: ["help", "h"],
    string: [],
  },
);

if (!args || args._.length === 0 || args.h || args.help) {
  exitHelp();
}

const template = args._[0];
const templateArgs = args["--"];

const baseDir = dirname(fromFileUrl(import.meta.url));
const baseTemplateDir = join(baseDir, template);
const templateDir = join(baseTemplateDir, "template");
const bannedNames = new Set([".vscode"]);
const targetDir = Deno.cwd();
const scripts = {
  check: "check.ts",
  setup: "setup.ts",
};

const runScript = async (script: string, failedMsg: string) => {
  const scriptPath = join(baseTemplateDir, script);
  if (await exists(scriptPath, "file")) {
    const mod: { default: ScriptRunFn } = await import(scriptPath);

    if (!(await mod.default(templateArgs))) {
      console.error(failedMsg);
      Deno.exit(1);
    }
  }
};

if (
  bannedNames.has(template) ||
  !(await exists(baseTemplateDir, "dir"))
) {
  console.error(`Template ${template} does not exist`);
  Deno.exit(1);
}

await runScript(scripts.check, "Template check failed, aborting...");

console.log("Copying template files...");

const items: string[] = [];

for await (const dirEntry of Deno.readDir(templateDir)) {
  items.push(join(templateDir, dirEntry.name));
}

const copyProc = Deno.run({
  cmd: [
    "cp",
    "-r",
    ...items,
    targetDir,
  ],
});
if (!(await copyProc.status()).success) {
  console.error("Failed to copy over template files");
  Deno.exit(1);
}

await runScript(scripts.setup, "Template setup failed, aborting...");

console.log("Template setup complete");
