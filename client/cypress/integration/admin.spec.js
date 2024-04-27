describe("Test admin", () => {
  beforeEach(() => {

    cy.fixture('donors').then((donors) => {
      localStorage.setItem('newDonors', JSON.stringify(donors));
    });

    cy.visit("/login");

    cy.get(':nth-child(1) > .form-control').select('admin');
    cy.get(':nth-child(2) > .form-control').select('Hospital 1');
    cy.get(':nth-child(3) > .form-control').type(Cypress.config('adminUsernameHospital1'));
    cy.get(':nth-child(4) > .form-control').type(Cypress.config('adminPasswordHospital1'));
    cy.get('.btn').click();

    cy.url().should('include', '/admin/hosp1admin');
    cy.get('.text-ellipsis').should('contain', 'Admin hosp1admin');
    cy.get('.mr-auto > .nav-item > .nav-link').should('contain', 'Admin');
  })

  it("create a new donor", () => {
    cy.get('[text="Create Donor"] > .btn-toolbar').click();

    cy.url().should('include', '/donor/edit/new');

    let newDonors = localStorage.getItem('newDonors');
    // console.log(newDonors);
    cy.get(':nth-child(1) > .form-control').type("Kshitij");
    cy.get(':nth-child(2) > .form-control').type("Yelpale");
    cy.get(':nth-child(3) > .form-control').type("E031, Friedrich-Wilhelm-von-Steuben-Str. 90");
    cy.get(':nth-child(4) > .form-control').type(27);
    cy.get('.ng-input > input').type("AB +").then((selects) => {
      let select = selects[0]; // we want just first one
      cy.wrap(select) // allows us to click using cypress
        .click() // click on the first ng-select
        .get("ng-dropdown-panel") // get the opened drop-down panel
        .get(".ng-option") // Get all the options in drop-down
        .contains("AB +") // Filter for just this text
        .then((item) => {
          cy.wrap(item).click(); // Click on the option
        });
    });
    cy.get(':nth-child(6) > .form-control').type("017669434050");
    cy.get(':nth-child(7) > .form-control').type("017669434050");
    cy.get('.btn-primary').click();
    cy.get('.alert').contains("New donor's credentials:");
    cy.get('.btn').click();
    cy.url().should('include', '/admin/hosp1admin');
  });
});
