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


## User event

- Ao invés de utilizar o `fireEVent` é melhor utilizar o `@testing-library/user-event`, para eventos de click, edição, mouse...

- Um exemplo de utilização para testar evento do mouse:

```tsx
import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useMyHook from '.';


test('should test1', async () => {
  const user = userEvent.setup({ delay: null });
  const { result } = renderHook(() => useMyHook());
  const { getByTestId } = render(
    <button type='button' data-testid='el'>
      el
    </button>,
  );
  const el = getByTestId('el');

  expect(result.current.isGrabbing).toBeFalsy();

  // mousedown
  await user.pointer({
    target: elMock,
    keys: '[MouseLeft>]',
  });

  expect(result.current.isGrabbing).toBeTruthy();
});

test('should test2', async () => {
  const user = userEvent.setup({ delay: null });
  const { result } = renderHook(() => useMyHook());
  const { user, getByTestId } = render(
    <button type='button' data-testid='element'>
      element
    </button>,
  );
  const elMock = getByTestId('element');

  // mousedown
  await user.pointer({
    target: elMock,
    keys: '[MouseLeft>]',
  });

  expect(result.current.isGrabbing).toBeTruthy();

  // mouseup
  await user.pointer({
    target: elMock,
    keys: '[/MouseLeft>]',
  });

  expect(result.current.isGrabbing).toBeFalsy();
});

```

---

### jest.useFakeTimers

- Quando precisamos testar components que utilizam setTimeout podemos fazer dessa forma:

- Componet:

```tsx
// arquivo component

import React, { useState } from "react";
const Demo = () => {
  const [isDisplayed, setIsDisplayed] = useState(true);
  const toggleHandler = () => setTimeout(()=>setIsDisplayed(prev => !prev), 500)
  return (
    <React.Fragment>
    <div>
      {isDisplayed && <p>Hello World!</p>}
    </div>
    <button onClick={toggleHandler}>toggle</button>
    </React.Fragment>
  );
}
export default Demo;
```

- Test:

```tsx
// arquivo test

test("Pressing the button hides the text (fake timers)", async () => {
  const user = userEvent.setup({ delay: null }); // pulo do gato
  jest.useFakeTimers();
  render(<Demo />);
  const button = screen.getByRole("button");
  await user.click(button);
  act(() => {
    jest.runAllTimers(); // pulo do gato
  });
  const text = screen.queryByText("Hello World!");
  expect(text).not.toBeInTheDocument();
  jest.useRealTimers();
});
```

---

## useEffect Async

- https://github.com/testing-library/react-testing-library/issues/667#issuecomment-628273598

- Para realizar testes de useEffect que tem async podemos fazer dessa forma:

- Component:

```tsx
import React, { useState, useEffect } from "react"

export default ({ name }) => {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        async function load() {
            await loadFromApi()
            setLoaded(true)
        }
        load()
    }, [])

    return loaded ? <div>loaded</div> : <div>loading...</div>
}

const loadFromApi = () => new Promise(resolve => setTimeout(resolve, 0))
```

- Test:

```tsx
import '@testing-library/jest-dom/extend-expect'
import React from 'react'
import {render, screen} from '@testing-library/react'
import Hello from '../hello'

test('React Testing Library works!', async () => {
  render(<Hello name="Jill" />)
  // UTILIZAR o await
  expect(await screen.findByText(/loaded/i)).toBeInTheDocument()
})
```