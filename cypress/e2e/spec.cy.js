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
    cy.logStep('Página inicial acessada');

    cy.get(selectors.loginButton)
      .should('be.visible')
      .click({ force: true });
    cy.logStep('Botão de login clicado');

    cy.get(selectors.signInWithGoogleButton)
      .should('be.visible')
      .click();
    cy.logStep('Botão "Sign in with Google" clicado');

    cy.origin(
      googleLoginUrl,
      { args: { email, password, selectors } },
      ({ email, password, selectors }) => {
        function logStep(step) {
          cy.log(step);
          console.log(step);
        }

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
        logStep('Email inserido');

        cy.get(selectors.googleEmailNextButton)
          .should('be.visible')
          .click();
        logStep('Botão "Próxima" após o email clicado');

        cy.get(selectors.googlePasswordInput, { timeout: 10000 })
          .should('be.visible')
          .type(password, { log: false });
        logStep('Senha inserida');

        cy.get(selectors.googlePasswordNextButton)
          .should('be.visible')
          .click();
        logStep('Botão "Próxima" após a senha clicada');

        cy.get(selectors.googleContinueButton, { timeout: 10000 })
          .then(($btn) => {
            if ($btn.is(':visible')) {
              cy.wrap($btn).click();
              logStep('Botão "Continue" clicado');
            } else {
              logStep('Botão "Continue" não encontrado, prosseguindo');
            }
          });
      }
    );

    cy.get(selectors.dashboardHeader, { timeout: 20000 })
      .should('be.visible');
    cy.logStep('Acesso ao dashboard concluído com sucesso');

    cy.logStep('Iniciando logout');

    cy.get(selectors.userMenuToggle)
      .should('be.visible')
      .click();
    cy.logStep('Menu do usuário aberto');

    cy.get(selectors.logoutButton)
      .should('be.visible')
      .click();
    cy.logStep('Botão de logout clicado');

    cy.get(selectors.loginButton)
      .should('be.visible');
    cy.logStep('Usuário deslogado com sucesso');
  });
});
