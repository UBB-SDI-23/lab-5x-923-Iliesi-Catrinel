describe("Museums", () => {
  describe("on viewing list of museums", () => {
      it("should display the museums from the database", () => {
          cy.intercept("GET", "**/api/museums/**", {
              fixture: "museums.json",
          });

          cy.visit("http://localhost:5173/museums");
          cy.get('[data-testid="test-all-museums-container"]').should("exist");
      });
  });
});

export {};