import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersFeedState = {
  orders: TOrder[];
  profileOrders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  loading: boolean;
  error: string | null;
};

const initialState: TOrdersFeedState = {
  orders: [],
  profileOrders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk(
  'ordersFeed/getAllOrders',
  async () => {
    const responce = await getFeedsApi();
    return responce;
  }
);

export const getProfileFeeds = createAsyncThunk(
  'ordersFeed/getProfileOrders',
  async () => {
    const response = await getOrdersApi();
    return response;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'ordersFeed/getByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response;
  }
);

const ordersFeedSlice = createSlice({
  name: 'ordersFeed',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '';
      })
      .addCase(getProfileFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfileFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.profileOrders = action.payload;
      })
      .addCase(getProfileFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        if (
          !state.orders.find(
            (item) => item.number === action.payload.orders[0].number
          )
        )
          state.orders.push(action.payload.orders[0]);
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '';
      });
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectProfileOrders: (state) => state.profileOrders,
    selectFeed: (state) => state.feed
  }
});

export const { reducer } = ordersFeedSlice;
export const { selectOrders, selectProfileOrders, selectFeed } =
  ordersFeedSlice.selectors;
