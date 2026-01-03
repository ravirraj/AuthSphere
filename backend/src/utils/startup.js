import chalk from "chalk";

export function logStartup(port) {
  console.log(
    chalk.green.bold("\n✔ Server started successfully"),
    `\n${chalk.gray("➜")} Mode: ${chalk.cyan(process.env.NODE_ENV || "development")}`,
    `\n${chalk.gray("➜")} Port: ${chalk.cyan(port)}\n`
  );
}
