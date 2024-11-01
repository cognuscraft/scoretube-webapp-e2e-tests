describe('Google Login and Logout Test', () => {
  const baseUrl = 'http://localhost:3000';
  const googleLoginUrl = 'https://accounts.google.com';

  const selectors = {
    loginButton: 'button[data-cy="header-login-btn-1"]',
    signInWithGoogleButton: 'button:contains("Sign in with Google")',
    googleEmailInput: 'input[type="email"]',
    googleEmailNextButton: '#identifierNext',
    googlePasswordInput: 'input[name="Passwd"]',
    googlePasswordNextButton: '#passwordNext',
    googleContinueButton: 'button:contains("Continue")',
    dashboardHeader: 'h1:contains("Painel de Análise de Vídeos")',
    userMenuToggle: 'label[data-cy="user-menu-toggle"]',
    logoutButton: 'div[data-cy="logout-button"]',
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  it('deve fazer login e logout corretamente via Google', () => {
    const email = Cypress.env('GOOGLE_EMAIL');
    const password = Cypress.env('GOOGLE_PASSWORD');

    cy.visit(baseUrl);
    cy.log('Página inicial acessada');

    cy.get(selectors.loginButton)
      .should('be.visible')
      .click({ force: true });
    cy.log('Botão de login clicado');

    cy.get(selectors.signInWithGoogleButton)
      .should('be.visible')
      .click();
    cy.log('Botão "Sign in with Google" clicado');

    cy.origin(
      googleLoginUrl,
      { args: { email, password, selectors } },
      ({ email, password, selectors }) => {
        Cypress.on('uncaught:exception', (err) => {
          if (
            err.message.includes('ResizeObserver loop completed with undelivered notifications') ||
            err.message.includes("Cannot read properties of null (reading 'postMessage')")
          ) {
            return false;
          }
        });

        cy.get(selectors.googleEmailInput)
          .should('be.visible')
          .type(email);
        cy.log('Email inserido');

        cy.get(selectors.googleEmailNextButton)
          .should('be.visible')
          .click();
        cy.log('Botão "Próxima" após o email clicado');

        cy.get(selectors.googlePasswordInput, { timeout: 10000 })
          .should('be.visible')
          .type(password, { log: false });
        cy.log('Senha inserida');

        cy.get(selectors.googlePasswordNextButton)
          .should('be.visible')
          .click();
        cy.log('Botão "Próxima" após a senha clicado');

        cy.get(selectors.googleContinueButton, { timeout: 10000 })
          .then(($btn) => {
            if ($btn.is(':visible')) {
              cy.wrap($btn).click();
              cy.log('Botão "Continue" clicado');
            } else {
              cy.log('Botão "Continue" não encontrado, prosseguindo');
            }
          });
      }
    );

    cy.get(selectors.dashboardHeader, { timeout: 20000 })
      .should('be.visible');
    cy.log('Acesso ao dashboard concluído com sucesso');

    cy.log('Iniciando logout');

    cy.get(selectors.userMenuToggle)
      .should('be.visible')
      .click();
    cy.log('Menu do usuário aberto');

    cy.get(selectors.logoutButton)
      .should('be.visible')
      .click();
    cy.log('Botão de logout clicado');

    cy.get(selectors.loginButton)
      .should('be.visible');
    cy.log('Usuário deslogado com sucesso');
  });
});
