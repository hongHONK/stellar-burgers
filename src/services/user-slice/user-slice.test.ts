import { configureStore, PayloadAction } from '@reduxjs/toolkit';
import {
  reducer,
  loginUser,
  registerUser,
  updateUser,
  getUser,
  logoutUser,
  selectUser
} from './user-slice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  const initialState = {
    isAuthChecked: false,
    isAuthenticated: false,
    data: null,
    loginUserError: null,
    registerUserError: null,
    userRequest: false
  };

  describe('Asynchronous reducers', () => {
    it('should handle loginUser while pending', () => {
      const action = { type: loginUser.pending.type };

      const state = reducer(initialState, action);

      expect(state.userRequest).toBe(true);
      expect(state.loginUserError).toBeNull();
    });

    it('should handle loginUser successful request', () => {
      const user: TUser = { name: 'Test User', email: 'test@example.com' };
      const action = {
        type: loginUser.fulfilled.type,
        payload: { success: true, user }
      };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(user);
    });

    it('should handle loginUser failed request', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Login failed' }
      };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.loginUserError).toBe('Login failed');
    });

    it('should handle registerUser while pending', () => {
      const action = { type: registerUser.pending.type };

      const state = reducer(initialState, action);

      expect(state.userRequest).toBe(true);
      expect(state.registerUserError).toBeNull();
    });

    it('should handle registerUser successful request', () => {
      const user: TUser = { name: 'New User', email: 'new@example.com' };
      const action = {
        type: registerUser.fulfilled.type,
        payload: { success: true, user }
      };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(user);
    });

    it('should handle registerUser failed request', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Registration failed' }
      };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.registerUserError).toBe('Registration failed');
    });

    it('should handle updateUser while pending', () => {
      const action = { type: updateUser.pending.type };

      const state = reducer(initialState, action);

      expect(state.userRequest).toBe(true);
    });

    it('should handle updateUser successful request', () => {
      const user: TUser = {
        name: 'Updated User',
        email: 'updated@example.com'
      };
      const action = { type: updateUser.fulfilled.type, payload: { user } };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.data).toEqual(user);
    });

    it('should handle updateUser failed request', () => {
      const action = { type: updateUser.rejected.type };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
    });

    it('should handle getUser while pending', () => {
      const action = { type: getUser.pending.type };

      const state = reducer(initialState, action);

      expect(state.userRequest).toBe(true);
    });

    it('should handle getUser successful request', () => {
      const user: TUser = {
        name: 'Fetched User',
        email: 'fetched@example.com'
      };
      const action = { type: getUser.fulfilled.type, payload: { user } };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(user);
    });

    it('should handle getUser failed request', () => {
      const action = { type: getUser.rejected.type };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle logoutUser while pending', () => {
      const action = { type: logoutUser.pending.type };

      const state = reducer(initialState, action);

      expect(state.userRequest).toBe(true);
    });

    it('should handle logoutUser successful request', () => {
      const action = { type: logoutUser.fulfilled.type };

      const state = reducer(
        {
          ...initialState,
          isAuthenticated: true,
          data: { name: 'User', email: 'user@example.com' }
        },
        action
      );

      expect(state.userRequest).toBe(false);
      expect(state.data).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isAuthChecked).toBe(false);
    });

    it('should handle logoutUser failed request', () => {
      const action = { type: logoutUser.rejected.type };

      const state = reducer({ ...initialState, userRequest: true }, action);

      expect(state.userRequest).toBe(false);
    });
  });

  describe('Selectors', () => {
    const preloadedState = {
      user: {
        isAuthChecked: true,
        isAuthenticated: true,
        data: { email: 'test@example.com', name: 'Test User' },
        loginUserError: null,
        registerUserError: null,
        userRequest: false
      }
    };

    const store = configureStore({
      reducer: { user: reducer },
      preloadedState
    });

    it('should handle select of user state', () => {
      const selectedUser = selectUser(store.getState());

      expect(selectedUser).toEqual(preloadedState.user);
    });
  });
});
