describe('Google Login and Logout Test', () => {
  const baseUrl = 'https://staging.scoretube.app/';
  const googleLoginUrl = 'https://accounts.google.com';
  const stripeCheckoutUrl = 'https://checkout.stripe.com';

  const selectors = {
    loginButton: 'button[data-cy="header-login-btn-1"]',
    signInWithGoogleButton: 'button:contains("Sign in with Google")',
    googleEmailInput: 'input[type="email"]',
    googleEmailNextButton: '#identifierNext',
    googlePasswordInput: 'input[name="Passwd"]',
    googlePasswordNextButton: '#passwordNext',
    googleContinueButton: 'button:contains("Continue")',
    dashboardHeader: 'h1:contains("Video Analytics Dashboard")',
    userMenuToggle: 'label[data-cy="user-menu-toggle"]',
    logoutButton: 'div[data-cy="logout-button"]',
    sidebarCreditsBtn: 'a[data-cy="add-credits-btn"]',
    subscriptionCheckoutBtn: 'button[data-cy="subscription-checkout-btn"]',
    oneTimeCheckoutBtn: 'button[data-cy="one-time-checkout-btn"]',
    rangeSlider: 'input[data-cy="subscription-plans-price-range"]',
    stripeCardNumberInput: 'input[id="cardNumber"]',
    stripeCardExpiresInput: 'input[id="cardExpiry"]',
    stripeCardCVCInput: 'input[id="cardCvc"]',
    stripeCardNameInput: 'input[id="billingName"]',
    stripeCardCountryInput: 'select[id="billingCountry"]',
    stripeButtonSubmitPayment: 'button[data-testid="hosted-payment-submit-button"]',
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);
  });

  function logStep(step) {
    cy.log(step);
    console.log(step);
  }

  it('deve fazer login e logout corretamente via Google', () => {
    const email = Cypress.env('GOOGLE_EMAIL');
    const password = Cypress.env('GOOGLE_PASSWORD');
    const cardNumber = Cypress.env('STRIPE_CARD_INFORMATION');
    const cardExpires = Cypress.env('STRIPE_CARD_EXPIRES');
    const cardCVC = Cypress.env('STRIPE_CARD_CVC');
    const cardName = Cypress.env('STRIPE_CARD_NAME');

    cy.visit(baseUrl);
    logStep('Página inicial acessada');

    cy.get(selectors.loginButton)
      .should('be.visible')
      .click({ force: true });
    logStep('Botão de login clicado');

    cy.get(selectors.signInWithGoogleButton)
      .should('be.visible')
      .click();
    logStep('Botão "Sign in with Google" clicado');

    cy.origin(
      googleLoginUrl,
      { args: { email, password, selectors } },
      ({ email, password, selectors }) => {
        const logStep = (step) => {
          cy.log(step);
          console.log(step);
        };

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
      }
    );

    cy.get(selectors.dashboardHeader, { timeout: 20000 })
      .should('be.visible');
    logStep('Acesso ao dashboard concluído com sucesso');

    cy.get(selectors.sidebarCreditsBtn)
      .should('be.visible')
      .click();
    logStep('Clicado no botão de créditos no menu lateral da sidebar');

    cy.get(selectors.oneTimeCheckoutBtn)
      .should('be.visible')
      .invoke('removeAttr', 'target')
      .click();
    logStep('Clicado no botão de comprar créditos');

    cy.origin(
      stripeCheckoutUrl,
      {
        args: {
          cardNumber,
          cardExpires,
          cardCVC,
          cardName,
          selectors,
        },
      },
      ({ cardNumber, cardExpires, cardCVC, cardName, selectors }) => {
        const logStep = (step) => {
          cy.log(step);
          console.log(step);
        };

        cy.get(selectors.stripeCardNumberInput)
          .should('be.visible')
          .type(cardNumber);
        logStep('Número do cartão inserido');

        cy.get(selectors.stripeCardExpiresInput)
          .should('be.visible')
          .type(cardExpires);
        logStep('Data de expiração do cartão inserida');

        cy.get(selectors.stripeCardCVCInput)
          .should('be.visible')
          .type(cardCVC);
        logStep('CVC do cartão inserido');

        cy.get(selectors.stripeCardNameInput)
          .should('be.visible')
          .type(cardName);
        logStep('Nome do titular do cartão inserido');

        cy.get(selectors.stripeButtonSubmitPayment)
          .should('be.visible')
          .click();
        logStep('Clicado no botão de comprar no stripe');
      }
    );

    cy.url({ timeout: 40000 }).should('include', 'staging.scoretube.app');

    cy.get(selectors.userMenuToggle)
      .should('be.visible')
      .click();
    logStep('Menu do usuário aberto');

    cy.get(selectors.logoutButton)
      .should('be.visible')
      .click();
    logStep('Botão de logout clicado');

    cy.get(selectors.loginButton)
      .should('be.visible');
    logStep('Usuário deslogado com sucesso');
  });
});