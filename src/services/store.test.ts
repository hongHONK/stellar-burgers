import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { reducer as ingredients } from './ingredients-slice/ingredients-slice';
import { reducer as burgerConstructor } from './constructor-slice/constructor-slice';
import { reducer as ordersFeed } from './orders-feed-slice/orders-feed-slice';
import { reducer as user } from './user-slice/user-slice';

describe('store', () => {
  it('should initialize with correct state', () => {
    const expectedState = {
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        items: {
          bun: null,
          ingredients: []
        },
        order: {
          orderRequest: false,
          orderModalData: null,
          orderError: null
        }
      },
      ordersFeed: {
        orders: [],
        profileOrders: [],
        feed: {
          total: 0,
          totalToday: 0
        },
        loading: false,
        error: null
      },
      user: {
        isAuthChecked: false,
        isAuthenticated: false,
        data: null,
        loginUserError: null,
        registerUserError: null,
        userRequest: false
      }
    };

    const store = configureStore({
      reducer: combineReducers({
        ingredients,
        burgerConstructor,
        ordersFeed,
        user
      })
    });

    expect(store.getState()).toEqual(expectedState);
  });
});
