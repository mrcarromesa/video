# TestCafe

- Instalação e getting Started

https://testcafe.io/documentation/402635/getting-started

- Caso utilizar o jest e o typescript é necessário fazer o downgrade ou adicionar a dependência antiga do @types/jest:

```shell
yarn add -D @types/jest@28.1.2
```

----

## Criando os testes

- Um exemplo de como criar os testes está na pasta `e2e/tests`

## Executando os testes


- Importante o `storybook` deverá está sendo executado previamente

- Para executar os testes em um browser especifico como o chrome execute o seguinte comando:

```shell
yarn testcafe chrome ./e2e/tests
```

- Para executar os testes em todos os browsers instalados localemente utilizar o comando:

```shell
yarn testcafe all firefox ./e2e/tests
```

---

## Configurar o testcafe

- Para configurar o testcafe sem utilizar o CLI:

- https://testcafe.io/documentation/402641/reference/testcafe-api/runner

- Um exemplo em `./e2e/testcafe.config.js`

- No arquivo `package.json` adicionar no scripts:

```json
"e2e:conf": "node ./e2e/testcafe.config.js"
```

- Configuração via arquivo:

https://testcafe.io/documentation/402638/reference/configuration-file#src

- Um exemplo:


```js
// testcaferc.js

module.exports = {
  skipJsErrors: true,
  // hostname: os.hostname(),
  // other settings
  browsers: ["browserstack:chrome@79.0:Windows 10", "firefox"],
  src: ["./e2e/tests"]
}
```

- E então no `package.json` em `scripts` adicionar:

```json
"e2e": "testcafe --config-file e2e/testcaferc.js"
```


---

## Selector

- No caso de um selector que é um elemento video precisamos de mais algumas coisas no testcafe conforme exemplo em `./e2e/tests/`:

```ts
Selector("video", {
    timeout: 30000,
  }).addCustomDOMProperties({
    paused: (el) => (el as unknown as HTMLVideoElement).paused,
  });
```

- `timeout`: https://testcafe.io/documentation/402756/reference/test-api/selector/constructor#optionstimeout
  - o tempo para o testcafe obter um component por padrão é de 3000ms para não correr um risco de dar timeout em alguns casos é interessante aumentar esse valor

- `addCustomDOMProperties`: https://testcafe.io/documentation/402759/reference/test-api/selector/addcustomdomproperties
  - Por padrão no `Selector` não vem algumas props do elemento por isso precisamos adiciona-las manualmente