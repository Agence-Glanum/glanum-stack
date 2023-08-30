describe("auth tests", () => {
  it("should allow you to access sign in page", () => {
    cy.visitAndCheck("/sign-in")
  })

  it("should allow you to access sign up page", () => {
    cy.visitAndCheck("/sign-up")
  })
})
