import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = {
  items: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  order: {
    orderRequest: boolean;
    orderModalData: TOrder | null;
    orderError: string | null;
  };
};

const initialState: TConstructorState = {
  items: {
    bun: null,
    ingredients: []
  },
  order: {
    orderRequest: false,
    orderModalData: null,
    orderError: null
  }
};

export const orderBurger = createAsyncThunk(
  'burgerConstructor/orderBurger',
  async (data: string[]) => {
    const response = await orderBurgerApi(data);
    return response;
  }
);

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        const isBun = action.payload.type === 'bun';
        if (isBun) {
          state.items.bun = action.payload;
          return;
        }
        state.items.ingredients.push(action.payload);
      },
      prepare: (item: TIngredient) => {
        const id = uuidv4();
        return {
          payload: { ...item, id }
        };
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.items.ingredients = state.items.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveIngredientUp: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const element = state.items.ingredients.find(
        (item) => item.id === action.payload.id
      );
      if (element) {
        const index = state.items.ingredients.indexOf(element);

        [state.items.ingredients[index - 1], state.items.ingredients[index]] = [
          state.items.ingredients[index],
          state.items.ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown: (state, action) => {
      const element = state.items.ingredients.find(
        (item) => item.id === action.payload.id
      );
      if (element) {
        const index = state.items.ingredients.indexOf(element);

        [state.items.ingredients[index], state.items.ingredients[index + 1]] = [
          state.items.ingredients[index + 1],
          state.items.ingredients[index]
        ];
      }
    },
    resetOrderModalData: (state) => {
      state.order.orderModalData = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.order.orderRequest = true;
        state.order.orderModalData = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.order.orderRequest = false;
        state.order.orderModalData = action.payload.order;
        state.items.bun = null;
        state.items.ingredients = [];
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.order.orderRequest = false;
        state.order.orderError = action.error.message || '';
      });
  },
  selectors: {
    selectConstructorItems: (store) => store.items,
    selectConstructorOrderState: (store) => store.order
  }
});

export const { reducer } = burgerConstructorSlice;
export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  resetOrderModalData
} = burgerConstructorSlice.actions;
export const { selectConstructorItems, selectConstructorOrderState } =
  burgerConstructorSlice.selectors;
