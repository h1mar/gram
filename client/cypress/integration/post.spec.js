describe('Post', () => {
	context('720p resolution', () => {
		beforeEach(() => {
			cy.viewport(1280, 720);
		});
		describe('When you click a post', () => {
			it('Should visit post', () => {
				cy.visit('http://localhost:3000/');
			});
			describe('nav', () => {
				it('Should navigate to About page', () => {
					cy.get('.cy-post').first().click();
					cy.url().should('include', '/post/');
				});
			});
		});
	});
});
