# Cypress

- Getting Start https://docs.cypress.io/guides/getting-started/installing-cypress#What-you-ll-learn

- Instalação:

```shell
yarn add cypress --dev
```

- Agora é necessário configurar o `cypress` para isso execute o comando:

```shell
yarn run cypres open
```

- será aberta uma nova janela,
- escolha a primeira opção para gerar os arquivos de configuração
- será gerado o arquivo `cypress.config.ts` e uma pasta `cypress`

- Após isso será possível criar um teste para o cypress, mais informações em: https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test#Add-a-test-file

- Um exemplo de um test pode ser encontrado em `./cypress/e2e/playVideo.cy.ts`

- Para rodar os testes só executar o comando:

```shell
yarn run cypress run
```

- Para rodar um test especifico poderá executar o comando:

```shell
yarn run cypress run --spec "caminho/do/arquivo"
```

---

## Comandos customizados

- Para criar um comando customizado de uma olhada nessa doc: https://docs.cypress.io/guides/tooling/typescript-support#Install-TypeScript

- Primeiro criar um arquivo `cypress/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "dom"],
    "types": ["cypress", "node"]
  },
  "include": ["**/*.ts"]
}
```

- No arquivo `./cypress/support/index.ts` adicionar o seguinte:

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      idCy(value: string): Chainable<JQuery<HTMLElement>>; // <- O comando personalizado
    }
  }
}
```

- No caso o `idCy` seria o evento personalizado, vc poderá adicionar quantos forem necessários só seguindo o exemplo

- Por fim podemos implementar a função no arquivo `./cypress/support/commands.ts`:

```ts
Cypress.Commands.add("idCy", (value) => cy.get(`#${value}]`));
```

- E por fim podemos utiliza-la conforme exemplo em `./cypress/e2e/playVideo.cy.ts`:

```ts
it("passes", (done) => {
  cy.idCy("playVideo").click();
  cy.get("#va").should("have.prop", "paused", false);
  done();
});
```