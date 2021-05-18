describe('Navigation', () => {
	context('720p resolution', () => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});
		describe('When you click home', () => {
			it('Should visit home page', () => {
				cy.visit('http://localhost:3000/');
			});
			describe('nav', () => {
				it('Should navigate to About page', () => {
					cy.get('.cy-login').contains('Login').click();
					cy.url().should('include', '/login');
				});
			});
		});
	});

	context('iphone-5 resolution', () => {
		beforeEach(() => {
			cy.viewport('iphone-5');
		});
		describe('When you click home', () => {
			it('Should visit home page', () => {
				cy.visit('http://localhost:3000/');
			});
			describe('nav', () => {
				it('Should navigate to About page', () => {
					cy.get('.cy-login').contains('Login').click();
					cy.url().should('include', '/login');
				});
			});
		});
	});
});
