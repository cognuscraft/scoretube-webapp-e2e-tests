describe('Google Login and Logout Test Simulation', () => {
  it('should successfully access the dashboard after login and then logout correctly', () => {
    const email = 'teste.scoretube@gmail.com';
    const password = Cypress.env('GOOGLE_PASSWORD');

    // Visitar a página inicial
    cy.visit('/');
    cy.log('Visited home page');

    // Clicar no botão de login
    cy.get('#login-button').click();
    cy.log('Clicked login button');

    // Verificar se a URL é a página de login
    cy.url().should('include', '/api/auth/signin');
    cy.log('URL includes /api/auth/signin');

    // Clicar no botão de "Sign in with Google"
    cy.contains('Sign in with Google').click();
    cy.log('Clicked "Sign in with Google" button');


//O problema é aqui... O cypress não consegue "mudar de aba", e o login pelo google é aberto em uma nova aba para selecionar em qual conta logar.


    // Realizar o login na origem do Google
    cy.origin('https://accounts.google.com', { args: { email, password } }, ({ email, password }) => {
      cy.url().should('include', 'https://accounts.google.com');
      cy.log('On Google login page');

      // Verifica se o email já está listado
      cy.get('body').then(($body) => {
        if ($body.find(`div[aria-label="${email}"]`).length > 0) {
          // Se o email estiver presente, clica nele
          cy.get(`div[aria-label="${email}"]`).click();
          cy.log(`Selected existing email: ${email}`);
        } else {
          // Caso contrário, tenta encontrar "Usar outra conta" e clica nele
          cy.contains('Usar outra conta', { timeout: 10000 }).should('be.visible').click();
          cy.log('Clicked "Usar outra conta"');

          // Insere o email manualmente
          cy.get('input[type="email"]', { timeout: 15000 }).should('be.visible').type(`${email}{enter}`);
          cy.log('Entered email');
        }
      });

      // Digita a senha
      cy.get('input[type="password"]', { timeout: 15000 })
        .should('be.visible')
        .type(`${password}{enter}`);
      cy.log('Entered password');
    });

    // Verificar se a URL redireciona para o dashboard
    cy.url().should('include', '/dashboard');
    cy.log('URL includes /dashboard');

    // Verificar se o dashboard é visível
    cy.get('[data-cy="dashboard"]').should('be.visible');
    cy.log('Dashboard is visible');

    // Verificar se o texto "Painel de Análise de Vídeos" está presente
    cy.contains('Painel de Análise de Vídeos');
    cy.log('Found "Painel de Análise de Vídeos" text');

    // Abrir o menu do usuário
    cy.get('[data-cy="user-menu-toggle"]').then($toggle => {
      cy.log(`Found ${$toggle.length} user menu toggles`);
      expect($toggle).to.have.length(1);
    }).click();
    cy.log('Clicked user menu toggle');

    // Clicar no botão de logout
    cy.get('[data-cy="logout-button"]').then($logout => {
      cy.log(`Found ${$logout.length} logout buttons`);
      expect($logout).to.have.length(1);
    }).click();
    cy.log('Clicked logout button');

    // Verificar se foi redirecionado para a página inicial
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.log('URL is equal to base URL');

    // Verificar se o botão de login está visível novamente
    cy.get('[data-cy="login-button"]').should('be.visible');
    cy.log('Login button is visible again');
  });
});
