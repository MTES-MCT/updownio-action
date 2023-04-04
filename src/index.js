const fs = require("fs");
const core = require("@actions/core");

const checks = require("./checks");

async function run() {
  try {
    const url = core.getInput("url").replace(/^(https?:\/\/[^/#]+).*$/g, "$1");
    const apiKey = core.getInput("apiKey");
    core.setSecret(apiKey);
    const output = core.getInput("output");
    core.info(`Fetching checks on ${url} ...`);
    const results = await checks(url, apiKey);
    fs.writeFileSync(output, JSON.stringify(results));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
