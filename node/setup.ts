import { ScriptRunFn } from "../utils.ts";

const lintPackages = [
  "eslint",
  "@typescript-eslint/parser",
  "@typescript-eslint/eslint-plugin",
  "eslint-plugin-prettier",
  "eslint-config-prettier",
  "eslint-plugin-sort-imports-es6-autofix",
];

const lintCommands = [
  "./node_modules/@luvies/config/scripts/lint.sh lint $dirs",
  "./node_modules/@luvies/config/scripts/lint.sh fix $dirs",
];

const run: ScriptRunFn = async () => {
  console.log("Adding lint packages to package.json...");
  const process = Deno.run({
    cmd: [
      "yarn",
      "add",
      "--dev",
      ...lintPackages,
    ],
  });

  const res = await process.status();
  if (!res.success) {
    console.error("Failed to added packages");
    return false;
  }

  console.log(
    "Added packages, use the following commands in the package.json scripts:",
  );
  console.log(lintCommands.join("\n"));

  return true;
};

export default run;
