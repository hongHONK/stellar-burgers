import React from 'react';

export type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};
