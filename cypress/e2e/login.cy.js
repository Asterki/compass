describe('Page loads', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000')
  })

  it('loaded components', () => {
    cy.visit('http://localhost:3000')
    cy.title().should('include', 'Register Now')
  })
})