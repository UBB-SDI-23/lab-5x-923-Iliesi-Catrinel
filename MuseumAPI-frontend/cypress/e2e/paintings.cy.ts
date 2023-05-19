describe("Paintings", () => {
  describe("on viewing list of paintings", () => {
      it("should display the paintings from the database", () => {
          cy.intercept("GET", "**/api/paintings/**", {
              fixture: "paintings.json",
          });

          cy.visit("http://localhost:5173/paintings");
          cy.get('[data-testid="test-all-paintings-container"]').should("exist");
      });
  });
});

export {};