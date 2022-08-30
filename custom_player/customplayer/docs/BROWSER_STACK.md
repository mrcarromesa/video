# BROWSER Stack

- Primeiro de tudo criar uma conta no browserstack.com
- Depois escolher qual lib ou framework que será utilizado para os tests, nesse caso será utilizado o TestCafe: [https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/testcafe#installation](https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/testcafe#installation)

- Adicionar as envs:
    
```bash
export BROWSERSTACK_USERNAME="_USER_NAME_"
```

```bash
export BROWSERSTACK_ACCESS_KEY="_KEY_"
```
    

- BrowserStack NPM: [https://www.npmjs.com/package/browserstack](https://www.npmjs.com/package/browserstack)

- Para verificar se ainda tem works suficientes do browser stack podemos utilizar a seguinte lib:

```bash
yarn add -D browserstack
```

e realizar a verificação dessa forma conforme em `e2e/testcafe.config.js`:

```js
const BrowserStack = require("browserstack");

function getWorkerStatus(browserStackClient) {
  return new Promise((resolve, reject) => {
    browserStackClient.getApiStatus((error, workers) => {
      if (error) reject(error);
      else resolve(workers);
    });
  });
}

  const { sessions_limit, running_sessions } = await getWorkerStatus(client);
  if (sessions_limit - running_sessions > 0) {
    testConfig();
  } else {
    console.log("Not enough available browserstack workers to run tests.");
  }
```

- Para que os tests ocorram na mesma session utilizar a var de ambiente conforme [https://www.browserstack.com/docs/automate/selenium/significance-of-build-names#nodejs](https://www.browserstack.com/docs/automate/selenium/significance-of-build-names#nodejs):

```bash
export BROWSERSTACK_BUILD_ID="VALOR_AQUI"
```

[https://github.com/DevExpress/testcafe-browser-provider-browserstack](https://github.com/DevExpress/testcafe-browser-provider-browserstack)

Um exemplo mais completo de executar um work com o browserstack:

```js
// file: `e2e/testcafe.config.js`

// eslint-disable-next-line @typescript-eslint/no-var-requires
const createTestCafe = require("testcafe");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const BrowserStack = require("browserstack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

async function testConfig() {
  const testcafe = await createTestCafe("localhost", 1337, 1338);

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

  console.log(`Tests failed: ${failed}`);
  if (failed) throw Error(`Tests failed: ${failed}`);
  
  await testcafe.close();
  
}

const getWorkerStatus = (browserStackClient) => new Promise((resolve, reject) => {
    browserStackClient.getApiStatus((error, workers) => {
      if (error) reject(error);
      else resolve(workers);
    });
  })

const browserStackConfig = () => {
  process.env.BROWSERSTACK_BUILD_ID = `TestA ${new Date().toLocaleString()}`;
  process.env.BROWSERSTACK_CAPABILITIES_CONFIG_PATH = path.resolve(
    __dirname,
    "../browserStackConfig.json"
  );
  process.env.BROWSERSTACK_BUILD_NAME = `Test ${new Date().toLocaleString()}`;
};

const canRunWorksInBrowserStack = () => {
  const client = BrowserStack.createClient({
    username: process.env.BROWSERSTACK_USERNAME,
    password: process.env.BROWSERSTACK_ACCESS_KEY,
  });
  const { sessions_limit, running_sessions } = await getWorkerStatus(client);

  return sessions_limit - running_sessions > 0;
}

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
```

- Como é possível ver algumas configurações adicionais são necessárias para rodar o browserstack corretamente, como no caso desse trecho:

```bash
const browserStackConfig = () => {
  process.env.BROWSERSTACK_BUILD_ID = `TestA ${new Date().toLocaleString()}`;
  process.env.BROWSERSTACK_CAPABILITIES_CONFIG_PATH = path.resolve(
    __dirname,
    "../browserStackConfig.json"
  );
  process.env.BROWSERSTACK_BUILD_NAME = `Test ${new Date().toLocaleString()}`;
};
```

- O arquivo `browserStackConfig.json` pode ser criado no raiz do projeto com o conteúdo parecido com esse:

```bash
{
  "build": "Test",
  "project": "customplayer",
  "name": "customplayer",
  "browserstack.debug": true,
  "browserstack.console": "verbose",
  "browserstack.networkLogs": true,
  
  "browserstack.idleTimeout": "120"
}
```

- Criar os tests na pasta `e2e/tests`
- No arquivo `package.json` adicionar o seguinte:

```bash
"e2e:conf": "node ./e2e/testcafe.config.js"
```

Por fim no terminal executar o comando:

```bash
yarn e2e:conf
```

- Nesse caso é importante que o `storybook` esteja sendo executado antes!

---

## Testar em diveros browsers suportados pelo browser stack

Depois de baixar o binário do BrowserStack [https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/testcafe#set-up-the-browserstacklocal-connection](https://www.browserstack.com/docs/automate/selenium/getting-started/nodejs/testcafe#set-up-the-browserstacklocal-connection), executar o comando:

```bash
./BrowserStackLocal --key _YOUR_KEY_
```

- Será gerado um link no terminal, só acessá-lo e poderá testar sua aplicação em qualquer browser suportado pelo BrowserStack,
- Para tal acesse o dashboard do seu browserstack em https://live.browserstack.com/
- Daí escolher o browser do qual deseja testar a aplicação e copiar sua url local e realizar os devidos tests!!!