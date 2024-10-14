describe('Google Login Test Simulation', () => {
  
    beforeEach(() => {
      cy.setCookie('next-auth.session-token', 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..d_rDVO63sz2ayR_L.IPW7zO--pny1CLyOlmApbBZxJozdGuOvDiD5PQAGnWA6lw99Si0s05cDgM5VFcdmLvf8rTdtHKAf_JB0WaMpHrW2vSETScKi9-Y6-2MHsPWdyaL36BX84SyCSGLUTy1CzgOdilNvQbYBVgZcEHyQp_IP3tK38XPcnFhbXBcIHPJwdTg0W9QzhWNFwD143mtu6VCfoHZ_X7XCbZ2Ipdfj1WyGOMNp-Iz7ujrEitF1hVkucJ-3bbTIvTv7F5zCXg-xRmDO43t2_xGZGHB0Gcs5XqJ0pfMJLuwbkcqknyQeTDj_oB3RnxREQCHN0zkY2L17niw_ytvP1s10BrqjjbDFIpNQd284c1ChaYE2TwHs6w.7KhRiVXf4LTW45RdI6W_VQ');
    });
  
    it('should successfully access the dashboard after login simulation', () => {
      cy.visit('/dashboard');
  
      cy.url().should('include', '/dashboard');
  
      cy.contains('Painel de Análise de Vídeos');
    });
  
    it('should redirect to login if not authenticated', () => {
      cy.clearCookie('next-auth.session-token');
  
      cy.visit('/dashboard');
  
      cy.url().should('include', '/api/auth/signin');
    });
  });
  