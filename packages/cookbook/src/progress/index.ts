import chalk from "chalk";
import * as CliProgress from "cli-progress";

const _progress = new CliProgress.Bar({
  format: `[${chalk.hex("#0B346E")(`{bar}`)}] {percentage}%`,
  barCompleteChar: "=",
  barIncompleteChar: " ",
});

export const openProgress = (speed = 3200) => {
  console.log("");
  _progress.start(1000, 0);
  const timeStart = Date.now();
  let progress = 0;
  let intervalFrequency = 1000 / 60;
  const staticPercentage = 0.64;
  let timeWaste = 0;
  let time = 0;

  const intervalId = setInterval(() => {
    time += intervalFrequency;
    progress = 1 - Math.exp((-1 * time) / speed);
    if (!timeWaste && progress > staticPercentage) {
      const timeEnd = Date.now();
      timeWaste = (timeEnd - timeStart) / 1000;
    }
    _progress.update(Math.floor(progress * 1000));
  }, intervalFrequency);

  return async () => {
    clearInterval(intervalId);
    const p = Math.ceil(progress * 1000);
    for (let index = 0; index < 32; index++) {
      await Bun.sleep(1000 / 60);
      _progress.update(Math.ceil(p + ((1000 - p) / 32) * index));
    }
    _progress.update(1000);
    _progress.stop();
    console.log("");
  };
};
