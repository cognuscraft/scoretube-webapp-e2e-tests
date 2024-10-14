describe('Login Test', () => {
    it('should successfully log in with valid credentials', () => {
      cy.visit('/api/auth/signin');
      cy.get('input[name="email"]').type('email@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/dashboard');
    });
  
    it('should show error message with invalid credentials', () => {
      cy.visit('/api/auth/signin');
      cy.get('input[name="email"]').type('wrongemail@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
    });
  });
  