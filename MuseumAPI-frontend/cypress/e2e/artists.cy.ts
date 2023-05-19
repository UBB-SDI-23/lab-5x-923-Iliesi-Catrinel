describe("Artists", () => {
  describe("on viewing list of artists", () => {
      it("should display the artists from the database", () => {
          cy.intercept("GET", "**/api/artists/**", {
              fixture: "artists.json",
          });

          cy.visit("http://localhost:5173/artists");
          cy.get('[data-testid="test-all-artists-container"]').should("exist");
      });
  });
});

export {};