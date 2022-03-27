import {
  getBookListRow,
  getBookListExpandedRow,
  getBookSearchField,
} from '../support/app.po';

describe('book list demo', () => {
  it('should open expand the row given by the deep link from url', () => {
    cy.visit('library/berlin/books/1');

    getBookListExpandedRow(1).should('be.visible');
  });

  it('should update the path param in the url on book selection', () => {
    getBookListRow(2).click();
    getBookListExpandedRow(2).should('be.visible');

    cy.url().should('contain', '/books/2');
  });

  it('should update the query param in the url from search string', () => {
    cy.url().should('not.contain', '?searchString');

    getBookSearchField().type('Jones');

    cy.url().should('contain', '?searchString=Jones');
  });
});
