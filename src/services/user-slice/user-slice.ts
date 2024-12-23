import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../../utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserSlice = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  data: TUser | null;
  loginUserError: string | null;
  registerUserError: string | null;
  userRequest: boolean;
};

const initialState: TUserSlice = {
  isAuthChecked: false,
  isAuthenticated: false,
  data: null,
  loginUserError: null,
  registerUserError: null,
  userRequest: false
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    if (response.success) {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    return response;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response;
  }
);

export const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await getUserApi();
  return response;
});

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();
  if (response.success) {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
  return response;
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.userRequest = true;
        state.loginUserError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userRequest = false;
        state.isAuthenticated = action.payload.success;
        state.data = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.userRequest = false;
        state.loginUserError = action.error.message || '';
      })
      .addCase(registerUser.pending, (state) => {
        state.userRequest = true;
        state.registerUserError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.isAuthenticated = action.payload.success;
        state.userRequest = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerUserError = action.error.message || '';
        state.userRequest = false;
      })
      .addCase(updateUser.pending, (state) => {
        state.userRequest = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload.user;
        state.userRequest = false;
      })
      .addCase(updateUser.rejected, (state) => {
        state.userRequest = false;
      })
      .addCase(getUser.pending, (state) => {
        state.userRequest = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.userRequest = false;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.data = action.payload.user;
      })
      .addCase(getUser.rejected, (state) => {
        state.userRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.pending, (state) => {
        state.userRequest = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userRequest = false;
        state.data = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.userRequest = false;
      });
  },
  selectors: { selectUser: (state) => state }
});

export const { reducer } = userSlice;
export const {} = userSlice.actions;
export const { selectUser } = userSlice.selectors;
