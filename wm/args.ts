import yargs from "yargs";
import { hideBin } from "yargs/helpers";

interface IArgs {
  consoleLogging: boolean;
  fileLogging: string | undefined;
}

const argv = yargs(hideBin(process.argv))
  .boolean("console-logging")
  .default("console-logging", false)
  .option("console-logging", {
    describe: "Enable console log output",
  })
  .nargs("file-logging", 1)
  .option("file-logging", {
    describe: "Enable logging output to a file",
  })
  .usage(
    `electron-wm window manager

Usage: $0 [options]`
  )
  .help().argv as IArgs;

console.log(argv);

/** Gets information about command line args. */
export function getArgs(): typeof argv {
  return argv;
}