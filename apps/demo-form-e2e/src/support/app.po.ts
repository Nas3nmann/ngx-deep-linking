export function getFirstNameInput() {
    return cy.get('[data-test="first-name-input"]')
}

export function getLastNameInput() {
    return cy.get('[data-test="last-name-input"]')
}

export function getMessageInput() {
    return cy.get('[data-test="message-input"]')
}