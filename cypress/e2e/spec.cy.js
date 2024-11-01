describe('Google Login and Logout Test', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it('should successfully access the dashboard after login and then logout correctly', () => {
    const email = Cypress.env('GOOGLE_EMAIL');
    const password = Cypress.env('GOOGLE_PASSWORD');

    // ACESSAR A PÁGINA E AVANÇAR PARA O LOGIN
    cy.visit('http://localhost:3000')
      .log('Visited home page');

    cy.get('button[data-cy="header-login-btn-1"]')
      .should('be.visible')
      .click({ force: true })
      .log('Clicked login button with token-string class');

    cy.contains('button', 'Sign in with Google')
      .should('be.visible')
      .click()
      .log('Clicked login button');

    //SAIR DO AMBIENTE SCORETUBE E IR PARA O AMBIENTE GOOGLE
    cy.origin('https://accounts.google.com', { args: { email: String(email), password: String(password) } }, ({ email, password }) => {

      Cypress.on('uncaught:exception', (err) => {
        if (
          err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
          err.message.includes("Cannot read properties of null (reading 'postMessage')")
        ) {
          return false;
        }
      });

      //FAZER O LOGIN PELO GOOGLE
      cy.get('input[type="email"]')
        .should('be.visible')
        .click()
        .type(email)
        .log('Entered email');

      cy.get('button[type="button"]').contains('Próxima')
        .should('be.visible')
        .click()
        .log('Clicked Next button')

      cy.get('input[type="password"]').first()
        .should('be.visible')
        .click()
        .type(password)
        .log('Entered password');

      cy.get('button[type="button"]').contains('Próxima')
        .should('be.visible')
        .click()
        .log('Clicked Next button after password')

      cy.get('button[type="button"]').contains('Continue')
        .should('be.visible')
        .click()
        .log('Clicked Continue Button')
    });

    //VERIFICAR SE ESTÁ NO DASHBOARD
    cy.contains('Painel de Análise de Vídeos')
      .log('Found "Painel de Análise de Vídeos" text')
      .log('Acesso ao dashboard concluido com sucesso');

    //FAZER O LOGOUT
    cy.log('Iniciando o logout')

    cy.get('label[data-cy="user-menu-toggle"]')
      .should('be.visible')
      .click()
      .log("Clicked dropdown button")

    cy.get('div[data-cy="logout-button"]')
      .should('be.visible')
      .click()
      .log("Clicked logout button")

    //VERIFICAR SE DESLOGOU MESMO
    cy.get('button[data-cy="header-login-btn-1"]')
      .should('be.visible')
      .click({ force: true })
      .log('Clicked login button with token-string class');
  });
});
