import morgan from "morgan";
import chalk from "chalk";

export const httpLogger = morgan((tokens, req, res) => {
  const status = Number(tokens.status(req, res));

  const statusColor =
    status >= 500 ? chalk.red :
    status >= 400 ? chalk.yellow :
    chalk.green;

  return [
    chalk.gray("➜"),
    chalk.cyan(tokens.method(req, res)),
    chalk.white(tokens.url(req, res)),
    statusColor(status),
    chalk.gray(`${tokens["response-time"](req, res)} ms`)
  ].join(" ");
});
