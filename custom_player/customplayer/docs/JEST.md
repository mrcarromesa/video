# Jest

- Seguir a documentação em https://jestjs.io/docs/tutorial-react

- Instalar as dependências:

```shell
yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
```

- Criar o arquivo `conf/setupTests.ts`: 

```ts
import "@testing-library/jest-dom/extend-expect";
```

- Criar o arquivo `conf/jest.config.js` na raiz do projeto:

```js
module.exports = {
  rootDir: "../..",
  preset: "ts-jest",
  verbose: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/hooks/*.{ts,tsx}",
    "!<rootDir>/node_modules/",
    "!**/node_modules/**",
    "!**/dist/**",
  ],
  coverageDirectory: "__tests__/coverage",
  coverageProvider: "v8",
  coverageReporters: ["text-summary", "lcov"],

  setupFiles: [],

  setupFilesAfterEnv: ["<rootDir>/__tests__/conf/setupTests.ts"],

  testMatch: ["**/*.spec.ts", "**/*.spec.tsx"],
  moduleNameMapper: {
    "^src/(.*)": "<rootDir>/src/$1",
  },

  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$":
      "<rootDir>/node_modules/react-scripts/config/jest/babelTransform.js",
    "^.+\\.css$":
      "<rootDir>/node_modules/react-scripts/config/jest/cssTransform.js",
    "^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)":
      "<rootDir>/node_modules/react-scripts/config/jest/fileTransform.js",
  },
};

```

### Libs

- Necessário para a prop `testEnvironment`

```shell
yarn add -D jest-environment-jsdom 
```

- Necessário para o `transform` para que o jest entenda a Syntax JSX: 

```shell
yarn add -D react-scripts
```

- Necessário para o jest entender arquivos `ts`:

```shell
yarn add -D ts-jest
```

- Para testar os hooks podemos utilizar a dependência:

```shell
yarn add @testing-library/react-hooks -D
```

### Scripts

- Para quando executarmos os testes seja aplicada as configurações ajustar no package.json:

```json
 "scripts": {
    // ... MORE ...
    "test": "jest --config ./__tests__/conf/jest.config.js --watch",
    "test:coverage": "jest --config ./__tests__/conf/jest.config.js --coverage"
  },
```

---
