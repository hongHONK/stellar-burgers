import { configureStore } from '@reduxjs/toolkit';
import {
  reducer as burgerConstructor,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetOrderModalData,
  orderBurger,
  selectConstructorItems,
  selectConstructorOrderState
} from './constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import * as api from '../../utils/burger-api';

describe('burgerConstructorSlice', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Synchronous reducers', () => {
    const initialConstructorState = {
      items: {
        bun: null,
        ingredients: [
          {
            id: '60d3b41abdacab0026a733c7',
            _id: '60d3b41abdacab0026a733c7',
            name: 'Соус Спайси',
            type: 'ingredient',
            proteins: 30,
            fat: 20,
            carbohydrates: 40,
            calories: 30,
            price: 90,
            image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-02-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
          },
          {
            id: '60d3b41abdacab0026a733c8',
            _id: '60d3b41abdacab0026a733c8',
            name: 'Соус Фирменный Space Sauce',
            type: 'ingredient',
            proteins: 50,
            fat: 22,
            carbohydrates: 11,
            calories: 14,
            price: 80,
            image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
            image_large:
              'https://code.s3.yandex.net/react/code/sauce-04-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/sauce-04-mobile.png'
          },
          {
            id: '60d3b41abdacab0026a733c9',
            _id: '60d3b41abdacab0026a733c9',
            name: 'Мясо бессмертных моллюсков',
            type: 'ingredient',
            proteins: 433,
            fat: 244,
            carbohydrates: 33,
            calories: 420,
            price: 1337,
            image: 'https://code.s3.yandex.net/react/code/meat-02.png',
            image_large:
              'https://code.s3.yandex.net/react/code/meat-02-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/meat-02-mobile.png'
          }
        ]
      },
      order: {
        orderRequest: false,
        orderModalData: {
          _id: '6347a6ac7f3b01001c3de5f2',
          status: 'done',
          name: 'Космический бургер',
          createdAt: '2023-06-15T12:30:45.789Z',
          updatedAt: '2023-06-15T12:35:22.456Z',
          number: 42069,
          ingredients: [
            '60d3b41abdacab0026a733c6',
            '60d3b41abdacab0026a733c7',
            '60d3b41abdacab0026a733cd',
            '60d3b41abdacab0026a733c9',
            '60d3b41abdacab0026a733c6'
          ]
        },
        orderError: null
      }
    };

    it('should handle addIngredient for bun', () => {
      const bun: TIngredient = {
        _id: '60d3b41abdacab0026a733c6',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
      };

      const newState = burgerConstructor(
        initialConstructorState,
        addIngredient(bun)
      );

      const { items } = newState;

      expect(items.bun).toEqual({
        id: expect.any(String),
        ...bun
      });
      expect(items.ingredients).toHaveLength(3);
    });

    it('should handle addIngredient for ingredient', () => {
      const ingredient: TIngredient = {
        _id: '60d3b41abdacab0026a733c7',
        name: 'Соус Спайси',
        type: 'ingredient',
        proteins: 30,
        fat: 20,
        carbohydrates: 40,
        calories: 30,
        price: 90,
        image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
      };

      const newState = burgerConstructor(
        initialConstructorState,
        addIngredient(ingredient)
      );

      const { items } = newState;

      expect(items.bun).toBeNull;
      expect(items.ingredients).toHaveLength(4);
      expect(items.ingredients).toContainEqual({
        id: expect.any(String),
        ...ingredient
      });
    });

    it('should handle removeIngredient', () => {
      const ingredient: TConstructorIngredient =
        initialConstructorState.items.ingredients[0];

      const newState = burgerConstructor(
        initialConstructorState,
        removeIngredient(ingredient)
      );

      const { items } = newState;

      expect(items.ingredients).toHaveLength(2);
      expect(items.ingredients).not.toContainEqual(ingredient);
    });

    it('should handle moveIngredientUp', () => {
      const ingredient: TConstructorIngredient =
        initialConstructorState.items.ingredients[1];

      const newState = burgerConstructor(
        initialConstructorState,
        moveIngredientUp(ingredient)
      );

      const { items } = newState;

      expect(items.ingredients).toEqual([
        initialConstructorState.items.ingredients[1],
        initialConstructorState.items.ingredients[0],
        initialConstructorState.items.ingredients[2]
      ]);
    });

    it('should handle moveIngredientDown', () => {
      const ingredient: TConstructorIngredient =
        initialConstructorState.items.ingredients[1];

      const newState = burgerConstructor(
        initialConstructorState,
        moveIngredientDown(ingredient)
      );

      const { items } = newState;
      expect(items.ingredients).toEqual([
        initialConstructorState.items.ingredients[0],
        initialConstructorState.items.ingredients[2],
        initialConstructorState.items.ingredients[1]
      ]);
    });

    it('should handle resetOrderModalData', () => {
      const newState = burgerConstructor(
        initialConstructorState,
        resetOrderModalData()
      );

      const { order } = newState;

      expect(order.orderModalData).toBeNull();
    });
  });

  describe('Asynchronous reducers', () => {
    it('should handle orderBurger successful request', async () => {
      const newOrderResponse = {
        success: true,
        order: {
          _id: '60d3b41abdacab0026a733c6',
          ingredients: [
            '60d3b41abdacab0026a733c7',
            '60d3b41abdacab0026a733c8',
            '60d3b41abdacab0026a733c9'
          ],
          status: 'done',
          name: 'Космический бургер',
          createdAt: '2023-06-15T12:30:45.789Z',
          updatedAt: '2023-06-15T12:35:22.456Z',
          number: 42069
        },
        name: 'Космический бургер'
      };

      jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(newOrderResponse);

      const store = configureStore({ reducer: { burgerConstructor } });

      await store.dispatch(orderBurger(['60d3b41abdacab0026a733c7']));

      const { order } = store.getState().burgerConstructor;

      expect(order.orderModalData).toEqual(newOrderResponse.order);
      expect(order.orderError).toBeNull();
      expect(order.orderRequest).toBeFalsy();
    });

    it('should handle orderBurger failed request', async () => {
      const newOrderResponse = new Error('Network Error');

      jest.spyOn(api, 'orderBurgerApi').mockRejectedValue(newOrderResponse);

      const store = configureStore({ reducer: { burgerConstructor } });

      await store.dispatch(orderBurger(['60d3b41abdacab0026a733c7']));

      const { order } = store.getState().burgerConstructor;

      expect(order.orderModalData).toBeNull();
      expect(order.orderError).toEqual('Network Error');
      expect(order.orderRequest).toBeFalsy();
    });
  });

  describe('Selectors', () => {
    const items = {
      bun: {
        id: '60d3b41abdacab0026a733c6',
        _id: '60d3b41abdacab0026a733c6',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
      },
      ingredients: [
        {
          id: '60d3b41abdacab0026a733c7',
          _id: '60d3b41abdacab0026a733c7',
          name: 'Соус Спайси',
          type: 'ingredient',
          proteins: 30,
          fat: 20,
          carbohydrates: 40,
          calories: 30,
          price: 90,
          image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
          image_large:
            'https://code.s3.yandex.net/react/code/sauce-02-large.png',
          image_mobile:
            'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
        }
      ]
    };

    const order = {
      orderModalData: {
        _id: '60d3b41abdacab0026a733c6',
        ingredients: ['60d3b41abdacab0026a733c7'],
        status: 'done',
        name: 'Космический бургер',
        createdAt: '2023-06-15T12:30:45.789Z',
        updatedAt: '2023-06-15T12:35:22.456Z',
        number: 42069
      },
      orderError: null,
      orderRequest: false
    };

    const store = configureStore({
      reducer: { burgerConstructor },
      preloadedState: { burgerConstructor: { items, order } }
    });

    it('should handle select of constructor items state', () => {
      const ingredients = selectConstructorItems(store.getState());
      expect(ingredients).toEqual(items);
    });

    it('should handle select of constructor order state', () => {
      const orderState = selectConstructorOrderState(store.getState());
      expect(orderState).toEqual(order);
    });
  });
});
