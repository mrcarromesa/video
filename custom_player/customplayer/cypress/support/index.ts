/* eslint-disable @typescript-eslint/no-namespace */
export {};

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
