export function getBookListRow(index: number) {
  return cy.get(`[data-test="book-list-row"][id="${index}"]`);
}

export function getBookListExpandedRow(index: number) {
  return cy.get(`[data-test="book-list-expanded-row"][id="${index}"]`);
}

export function getBookSearchField() {
  return cy.get(`[data-test="book-search-field"]`);
}
