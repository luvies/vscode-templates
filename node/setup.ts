import { ScriptRunFn } from "../utils.ts";
import { parseNodeArgs } from "./utils.ts";

const pgkJson = "package.json";

const devPackages = [
  // Dev
  "typescript",
  "tslib",
  "@types/node",

  // Linting
  "@luvies/config",
  "eslint",
  "@typescript-eslint/parser",
  "@typescript-eslint/eslint-plugin",
  "eslint-plugin-prettier",
  "eslint-config-prettier",
  "eslint-plugin-sort-imports-es6-autofix",
];

const lintCommands = {
  lint: "./node_modules/@luvies/config/scripts/lint.sh lint src",
  fix: "./node_modules/@luvies/config/scripts/lint.sh fix src",
};

const basePkgJson = (
  name: string,
  desc?: string,
  version?: string,
  author?: string,
  repo?: string,
) => ({
  "name": name,
  "version": version ?? "0.0.1",
  "description": desc ?? "<desc>",
  "main": "dist/index.js",
  "license": "MIT",
  "author": author ?? "<author>",
  "repository": repo ?? "luvies/lazy",
  "publishConfig": {
    "access": "public",
  },
});

const run: ScriptRunFn = async (args) => {
  const parsedArgs = parseNodeArgs(args);

  if (parsedArgs.name) {
    console.log(`Creating ${pgkJson}...`);
    await Deno.writeTextFile(
      pgkJson,
      JSON.stringify(
        basePkgJson(
          parsedArgs.name,
          parsedArgs.desc,
          parsedArgs.version,
          parsedArgs.author,
          parsedArgs.repo,
        ),
        undefined,
        2,
      ),
    );
  }

  console.log("Adding package scripts...");
  const pkg = JSON.parse(await Deno.readTextFile(pgkJson));
  pkg.scripts = lintCommands;
  await Deno.writeTextFile(pgkJson, JSON.stringify(pkg, undefined, 2));

  console.log("Adding dev packages to package.json...");
  const process = Deno.run({
    cmd: [
      "yarn",
      "add",
      "--dev",
      ...devPackages,
    ],
  });

  const res = await process.status();
  if (!res.success) {
    console.error("Failed to add packages");
    return false;
  }

  return true;
};

export default run;
