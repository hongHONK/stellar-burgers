import { FC } from 'react';
import { ProtectedRouteProps } from './type';

import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/user-slice';

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAuthChecked } = useSelector(selectUser);

  const location = useLocation();

  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isLoginPage || isRegisterPage) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} />;
  }

  return children;
};
