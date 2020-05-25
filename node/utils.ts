import { parseArgs } from "../utils.ts";

export interface NodeArgs {
  _: string[];
  h?: boolean;
  help?: boolean;
  name?: string;
  desc?: string;
  version?: string;
  author?: string;
  repo?: string;
}

export function parseNodeArgs(args: string[]): NodeArgs {
  const parsed = parseArgs<NodeArgs>(
    args,
    {
      boolean: ["h", "help"],
      string: ["name", "desc", "version", "author", "repo"],
    },
  );

  if (!parsed || parsed.h || parsed.help) {
    console.log("init-template node -- <args>");
    console.log("\tInitialises a node template");
    console.log();
    console.log("Arguments:");
    console.log("\t--help -h\t- Prints this help message");
    console.log("\t--name\t\t- The name of the package");
    console.log(
      "\t\t\t  If this is not given, then a package.json will have to already exist",
    );
    console.log();
    console.log("The following arguments only apply if --name was given");
    console.log(
      "\t--desc\t\t- The description of the package (default: <desc>)",
    );
    console.log("\t--version\t- The version of the package (default: 0.0.1)");
    console.log("\t--author\t- The author of the package (default: <author>)");
    console.log("\t--repo\t\t- The repo of the package (default: <repo>)");
    Deno.exit(parsed ? 0 : 1);
  }

  return parsed;
}
