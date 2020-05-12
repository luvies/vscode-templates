import { assertAllExist, DirItem, ScriptRunFn } from "../utils.ts";

const requiredFiles: DirItem[] = [
  {
    name: "package.json",
    type: "file",
  },
];

const run: ScriptRunFn = async () => {
  return assertAllExist(requiredFiles);
};

export default run;
