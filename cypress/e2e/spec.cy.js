describe('Google Login and Logout Test', () => {
  it('should successfully access the dashboard after login and then logout correctly', () => {
    const email = Cypress.env('GOOGLE_EMAIL');
    const password = Cypress.env('GOOGLE_PASSWORD');

    // Visitar a página inicial
    cy.visit('http://localhost:3000/api/auth/signin?callbackUrl=%2Fdashboard')
      .log('Visited home page');

    // Identificar e clicar no botão de login
    cy.contains('button', 'Sign in with Google')
      .click()
      .wait(2000)
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
        .click()
        .type(email)
        .log('Entered email');

      // Clica no botão "Próximo"
      cy.get('button[type="button"]').contains('Próxima').click()
        .log('Clicked Next button')
        .wait(2000);

      // Seleciona o primeiro campo de senha e insere a senha como string
      cy.get('input[type="password"]').first()
        .click()
        .type(password)
        .log('Entered password');

      // Clica no botão "Próximo" para a senha, caso apareça
      cy.get('button[type="button"]').contains('Próxima').click()
        .log('Clicked Next button after password')
        .wait(2000);

      cy.get('button[type="button"]').contains('Continue').click()
        .log('Clicked Continue Button')
        .wait(2000);
      // Navega para o dashboard após a autenticação
      cy.visit('http://localhost:3000')
    });



    cy.get('button[class="btn-to-chrome btn bg-zinc-800 text-gray-50 hover:bg-zinc-700 border-none hover:text-gray-50 flex"]').contains('Get Scoretube').click({ force: true })
      .wait(2000)
      .log('Button clicked')

    cy.get('button[type="submit"]').click({ force: true })
      .wait(2000)
      .log('Button clicked')


    // Verificar se o texto "Painel de Análise de Vídeos" está presente
    cy.contains('Painel de Análise de Vídeos');
    cy.log('Found "Painel de Análise de Vídeos" text')
      .wait(2000);
    cy.log('Acesso ao dashboard concluido com sucesso')

    cy.log('Iniciando o logout')

    cy.get('label[data-cy="user-menu-toggle"]').click()
    cy.log("Clicked dropdown button")

    cy.get('div[data-cy="logout-button"]').click()
    cy.log("Clicked logout button")
      .wait(2000);


    cy.get('button[data-cy="login-button"]').first().click({ force: true })
      .wait(2000)
      .log('Login Button founded and clicked again')

  });


});
