import { assertAllExist, DirItem, ScriptRunFn } from "../utils.ts";
import { parseNodeArgs } from "./utils.ts";

const requiredFiles: DirItem[] = [
  {
    name: "package.json",
    type: "file",
  },
];

const run: ScriptRunFn = async (args) => {
  const parsedArgs = parseNodeArgs(args);

  if (parsedArgs.name) {
    return true;
  } else {
    return assertAllExist(requiredFiles);
  }
};

export default run;
