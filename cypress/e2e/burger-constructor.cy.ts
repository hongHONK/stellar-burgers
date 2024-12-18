describe('Проверяем работу конструктора', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'testToken');
    });

    cy.intercept('GET', `/api/auth/user`, {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('GET', `/api/ingredients`, {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.wait('@getUser');
    cy.wait('@getIngredients');
  });

  it('При посещении страницы конструктора должен отображаться список игредиентов и конструктор', () => {
    cy.get('[data-cy=ingredients-list]').should('be.visible');
    cy.get('[data-cy=burger-constructor]').should('be.visible');
  });

  it('Проверяем добавление булок и ингредиентов в конструктор', () => {
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('[data-cy=constructor-top-bun-643d69a5c3f7b9001cfa093c]').should(
      'be.visible'
    );

    cy.get(
      '[data-cy=burger-constructor-element-643d69a5c3f7b9001cfa0941]'
    ).should('be.visible');

    cy.get('[data-cy=constructor-bottom-bun-643d69a5c3f7b9001cfa093c]').should(
      'be.visible'
    );
  });

  it('Проверяем работу модальных окон', () => {
    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').find('a').click();

    cy.get('[data-cy=modal]').should('be.visible');

    cy.get('[data-cy=modal-close-button]').click();

    cy.get('[data-cy=modal]').should('not.exist');

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]').find('a').click();

    cy.get('[data-cy=modal]').should('be.visible');

    cy.get('[data-cy=modal-overlay]').click({ force: true });

    cy.get('[data-cy=modal]').should('not.exist');
  });

  it('Проверяем работу процесса создания заказа', () => {
    const orderButton = cy.get('[data-cy=order-button]');

    orderButton.should('be.visible');

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa093c]')
      .find('button')
      .contains('Добавить')
      .click();

    cy.get('[data-cy=ingredient-643d69a5c3f7b9001cfa0941]')
      .find('button')
      .contains('Добавить')
      .click();

    orderButton.click();

    cy.intercept('POST', '/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.wait('@createOrder');

    const orderModal = cy.get('[data-cy=modal]');

    orderModal.should('be.visible');
    orderModal.find('[data-cy=order-number]').contains('111111');

    cy.get('[data-cy=modal-close-button]').click();

    orderModal.should('not.exist');

    cy.get('[data-cy=constructor-top-bun-643d69a5c3f7b9001cfa093c]').should(
      'not.exist'
    );

    cy.get(
      '[data-cy=burger-constructor-element-643d69a5c3f7b9001cfa0941]'
    ).should('not.exist');

    cy.get('[data-cy=constructor-bottom-bun-643d69a5c3f7b9001cfa093c]').should(
      'not.exist'
    );
  });
});
