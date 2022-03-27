import {
  getFirstNameInput,
  getLastNameInput,
  getMessageInput,
} from '../support/app.po';

describe('demo form', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const message = 'Hello World!';
  const escapedMessage = 'Hello%20World!';

  it('should fill in the form with parameters from url', () => {
    cy.visit(
      `/form?formContent=%7B%22firstName%22:%22${firstName}%22,%22lastName%22:%22${lastName}%22,%22message%22:%22${message}%22%7D`
    );

    getFirstNameInput().should('have.value', firstName);
    getLastNameInput().should('have.value', lastName);
    getMessageInput().should('have.value', message);
  });

  it('should adjust the url to changes in the form', () => {
    const newFirstName = 'Josef';

    getFirstNameInput().clear().type(newFirstName);

    cy.url().should(
      'contain',
      `/form?formContent=%7B%22firstName%22:%22${newFirstName}%22,%22lastName%22:%22${lastName}%22,%22message%22:%22${escapedMessage}%22%7D`
    );
  });
});
