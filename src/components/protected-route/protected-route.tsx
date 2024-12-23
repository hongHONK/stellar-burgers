import { FC } from 'react';
import { ProtectedRouteProps } from './type';

import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/user-slice/user-slice';

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth = false
}) => {
  const { isAuthenticated, isAuthChecked } = useSelector(selectUser);

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth) {
    if (!isAuthenticated) {
      return children;
    } else {
      return <Navigate to={location.state || '/profile'} />;
    }
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} state={location.pathname} />;
  }

  return children;
};
