describe('Login User', () => {
  it('Successful Login', () => {
    cy.server();
    cy.route('POST', '/session/users').as('loginUser');
    cy.route('/users').as('getUser');

    cy.visit('/');

    cy.wait('@getUser').its('status').should('eq', 401);

    cy.get('input[name=email]').type('demo@hotelmanager.co');
    cy.get('input[name=password]').type('hotelmanager');
    cy.get('form').submit();

    cy.wait('@loginUser').its('status').should('eq', 200);
    cy.getCookie('userJWT').should('exist');

    cy.wait('@getUser').its('status').should('eq', 200);
  });
});
