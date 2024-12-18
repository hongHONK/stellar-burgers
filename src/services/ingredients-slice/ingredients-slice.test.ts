import { configureStore } from '@reduxjs/toolkit';
import {
  reducer as ingredients,
  getIngredients,
  selectIngredients,
  reducer
} from './ingredients-slice';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  describe('Asynchronous reducers', () => {
    it('should handle getIngredients while pending', () => {
      const action = { type: getIngredients.pending.type };

      const state = ingredients(initialState, action);

      expect(state).toEqual({
        ...initialState,
        loading: true
      });
    });

    it('should handle getIngredients successful request', () => {
      const getIngredientsResponse = [
        {
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
          image_mobile:
            'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
        },
        {
          _id: '60d3b41abdacab0026a733cc',
          name: 'Соус Spicy-X',
          type: 'sauce',
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
      ];

      const action = {
        type: getIngredients.fulfilled.type,
        payload: getIngredientsResponse
      };

      const state = ingredients(initialState, action);

      expect(state).toEqual({
        ...initialState,
        ingredients: getIngredientsResponse
      });
    });

    it('should handle getIngredients failed request', () => {
      const action = {
        type: getIngredients.rejected.type,
        error: { message: 'Error fetching ingredients' }
      };

      const state = ingredients(initialState, action);

      expect(state).toEqual({
        ...initialState,
        error: 'Error fetching ingredients'
      });
    });
  });

  describe('Selectors', () => {
    const preloadedState = {
      ingredients: {
        ingredients: [
          {
            _id: '60d3b41abdacab0026a733c6',
            name: 'Краторная булка N-200i',
            type: 'bun',
            proteins: 80,
            fat: 24,
            carbohydrates: 53,
            calories: 420,
            price: 1255,
            image: 'https://code.s3.yandex.net/react/code/bun-02.png',
            image_large:
              'https://code.s3.yandex.net/react/code/bun-02-large.png',
            image_mobile:
              'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
          },
          {
            _id: '60d3b41abdacab0026a733cc',
            name: 'Соус Spicy-X',
            type: 'sauce',
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
        ],
        loading: false,
        error: null
      }
    };

    const store = configureStore({ reducer: { ingredients }, preloadedState });

    it('should handle select of igredients state', () => {
      const selectedIngredients = selectIngredients(store.getState());

      expect(selectedIngredients).toEqual(preloadedState.ingredients);
    });
  });
});
