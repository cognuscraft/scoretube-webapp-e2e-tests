describe('Google Login and Logout Test', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it('should successfully access the dashboard after login and then logout correctly', () => {
    const email = Cypress.env('GOOGLE_EMAIL');
    const password = Cypress.env('GOOGLE_PASSWORD');

    // Visitar a página inicial
    cy.visit('http://localhost:3000')
      .log('Visited home page');
    console.log('Visited home page');

    // Testar o botão com a classe 'token-string'
    cy.get('div.hidden.lg\\:block button[data-cy="login-button"]')
      .should('be.visible')
      .click({ force: true })
      .log('Clicked login button with token-string class');



    // Identificar e clicar no botão de login
    cy.contains('button', 'Sign in with Google')
      .should('be.visible')
      .click()
      .log('Clicked login button');

    // Unificar o fluxo de e-mail e senha dentro de um único `cy.origin`
    cy.origin('https://accounts.google.com', { args: { email: String(email), password: String(password) } }, ({ email, password }) => {

      // Ignorar o erro "ResizeObserver loop completed with undelivered notifications"
      Cypress.on('uncaught:exception', (err) => {
        if (
          err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
          err.message.includes("Cannot read properties of null (reading 'postMessage')")
        ) {
          return false; // Ignora os erros específicos
        }
      });

      // Seleciona o campo de e-mail e insere o e-mail como string
      cy.get('input[type="email"]')
        .should('be.visible')
        .click()
        .type(email)
        .log('Entered email');

      // Clica no botão "Próximo"
      cy.get('button[type="button"]').contains('Próxima')
        .should('be.visible')
        .click()
        .log('Clicked Next button')

      // Seleciona o primeiro campo de senha e insere a senha como string
      cy.get('input[type="password"]').first()
        .should('be.visible')
        .click()
        .type(password)
        .log('Entered password');

      // Clica no botão "Próximo" para a senha, caso apareça
      cy.get('button[type="button"]').contains('Próxima')
        .should('be.visible')
        .click()
        .log('Clicked Next button after password')

      cy.get('button[type="button"]').contains('Continue')
        .should('be.visible')
        .click()
        .log('Clicked Continue Button')
      // Navega para o dashboard após a autenticação
      cy.wait(30000)
        .visit('http://localhost:3000')
    });



    cy.get('div.hidden.lg\\:block button[data-cy="login-button"]')
      .should('be.visible')
      .click({ force: true })
      .log('Clicked login button with token-string class');


    cy.get('button[type="submit"]')
      .should('be.visible')
      .click({ force: true })
      .log('Button clicked')


    // Verificar se o texto "Painel de Análise de Vídeos" está presente
    cy.contains('Painel de Análise de Vídeos');
    cy.log('Found "Painel de Análise de Vídeos" text')
    cy.log('Acesso ao dashboard concluido com sucesso')

    cy.log('Iniciando o logout')

    cy.get('label[data-cy="user-menu-toggle"]')
      .should('be.visible')
      .click()
    cy.log("Clicked dropdown button")

    cy.get('div[data-cy="logout-button"]')
      .should('be.visible')
      .click()
    cy.log("Clicked logout button")

    cy.get('div.hidden.lg\\:block button[data-cy="login-button"]')
      .should('be.visible')
      .click({ force: true })
      .log('Clicked login button with token-string class');
  });
});
