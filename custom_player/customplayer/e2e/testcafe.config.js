/* eslint-disable @typescript-eslint/no-var-requires */
const createTestCafe = require("testcafe");
const BrowserStack = require("browserstack");
const path = require("path");

async function testConfig() {
  const testcafe = await createTestCafe("localhost", 1337, 1338);

  // try {
  const failed = await testcafe
    .createRunner()
    .src(["./e2e/tests"])
    // .browsers(["chrome --autoplay-policy=no-user-gesture-required"])
    .browsers(["browserstack:chrome@80.0:Windows 10", "browserstack:iPhone 8"])
    .run({
      quarantineMode: {
        successThreshold: 1,
        attemptLimit: 2,
      },
      assertionTimeout: 5000,
    });

  if (failed) throw Error(`Tests failed: ${failed}`);

  await testcafe.close();
}

const getWorkerStatus = (browserStackClient) =>
  new Promise((resolve, reject) => {
    browserStackClient.getApiStatus((error, workers) => {
      if (error) reject(error);
      else resolve(workers);
    });
  });

const browserStackConfig = () => {
  process.env.BROWSERSTACK_BUILD_ID = `Test ${new Date().toLocaleString()}`;
  process.env.BROWSERSTACK_BUILD_NAME = `Test ${new Date().toLocaleString()}`;
  process.env.BROWSERSTACK_CAPABILITIES_CONFIG_PATH = path.resolve(
    __dirname,
    "../browserStackConfig.json"
  );
};

const canRunWorksInBrowserStack = async () => {
  const client = BrowserStack.createClient({
    username: process.env.BROWSERSTACK_USERNAME,
    password: process.env.BROWSERSTACK_ACCESS_KEY,
  });
  const { sessions_limit, running_sessions } = await getWorkerStatus(client);

  return sessions_limit - running_sessions > 0;
};

const runTests = async () => {
  browserStackConfig();

  if (canRunWorksInBrowserStack()) {
    try {
      await testConfig();
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  } else {
    console.log("Not enough available browserstack workers to run tests.");
  }
};

runTests();
