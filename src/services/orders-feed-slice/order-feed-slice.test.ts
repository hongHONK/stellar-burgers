import { configureStore } from '@reduxjs/toolkit';
import {
  reducer,
  getFeeds,
  getProfileFeeds,
  getOrderByNumber,
  selectOrders,
  selectProfileOrders,
  selectFeed
} from './orders-feed-slice';
import { TOrder } from '@utils-types';

describe('ordersFeedSlice', () => {
  const mockOrders: TOrder[] = [
    {
      _id: '123456',
      ingredients: ['60d3b41abdacab0026a733c6', '60d3b41abdacab0026a733c7'],
      status: 'done',
      name: 'Космический бургер',
      createdAt: '2023-05-15T12:00:00.000Z',
      updatedAt: '2023-05-15T12:05:00.000Z',
      number: 12345
    },
    {
      _id: '789012',
      ingredients: [
        '60d3b41abdacab0026a733c8',
        '60d3b41abdacab0026a733c9',
        '60d3b41abdacab0026a733ca'
      ],
      status: 'pending',
      name: 'Межгалактический сэндвич',
      createdAt: '2023-05-15T13:00:00.000Z',
      updatedAt: '2023-05-15T13:01:00.000Z',
      number: 12346
    }
  ];

  describe('Asynchronous reducers', () => {
    const initialState = {
      orders: [],
      profileOrders: [],
      feed: {
        total: 0,
        totalToday: 0
      },
      loading: false,
      error: null
    };

    it('should handle getFeeds while pending', () => {
      const action = { type: getFeeds.pending.type };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getFeeds successful request', () => {
      const action = {
        type: getFeeds.fulfilled.type,
        payload: { orders: mockOrders, total: 100, totalToday: 10 }
      };

      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toEqual(mockOrders);
      expect(state.feed.total).toBe(100);
      expect(state.feed.totalToday).toBe(10);
    });

    it('should handle getFeeds failed request', () => {
      const action = {
        type: getFeeds.rejected.type,
        error: { message: 'Failed to fetch orders feed' }
      };

      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch orders feed');
    });

    it('should handle getProfileFeeds while pending', () => {
      const action = { type: getProfileFeeds.pending.type };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getProfileFeeds successful request', () => {
      const action = {
        type: getProfileFeeds.fulfilled.type,
        payload: mockOrders
      };

      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.profileOrders).toEqual(mockOrders);
    });

    it('should handle getProfileFeeds failed request', () => {
      const action = {
        type: getProfileFeeds.rejected.type,
        error: { message: 'Failed to fetch profile orders' }
      };

      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);

      expect(state.error).toBe('Failed to fetch profile orders');
    });

    it('should handle getOrderByNumber while pending', () => {
      const action = { type: getOrderByNumber.pending.type };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle getOrderByNumber successful request', () => {
      const mockOrder: TOrder = mockOrders[0];
      const action = {
        type: getOrderByNumber.fulfilled.type,
        payload: { orders: [mockOrder] }
      };

      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.orders).toContainEqual(mockOrder);
    });

    it('should handle getOrderByNumber failed request', () => {
      const action = {
        type: getOrderByNumber.rejected.type,
        error: { message: 'Failed to fetch order by number' }
      };

      const state = reducer({ ...initialState, loading: true }, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch order by number');
    });
  });

  describe('Selectors', () => {
    const preloadedState = {
      orders: [mockOrders[0]],
      profileOrders: [mockOrders[1]],
      feed: {
        total: 100,
        totalToday: 10
      },
      loading: false,
      error: null
    };

    it('should handle select of orders feed state', () => {
      const store = configureStore({
        reducer: { ordersFeed: reducer },
        preloadedState: { ordersFeed: preloadedState }
      });

      expect(selectOrders(store.getState())).toEqual(preloadedState.orders);
      expect(selectProfileOrders(store.getState())).toEqual(
        preloadedState.profileOrders
      );
      expect(selectFeed(store.getState())).toEqual(preloadedState.feed);
    });
  });
});
