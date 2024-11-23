import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { reducer as ingredients } from './ingredients-slice';
import { reducer as burgerConstructor } from './constructor-slice';
import { reducer as ordersFeed } from './orders-feed-slice';
import { reducer as user } from './user-slice';

// console.log(constructor);

const rootReducer = combineReducers({
  ingredients,
  burgerConstructor,
  ordersFeed,
  user
}); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
