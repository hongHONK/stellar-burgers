import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser, selectUser } from '../../services/user-slice';
import { Navigate } from 'react-router-dom';
import { Preloader } from '@ui';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const { registerUserError, isAuthenticated, userRequest } =
    useSelector(selectUser);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (userName && email && password)
      dispatch(
        registerUser({ name: userName, email: email, password: password })
      );
  };

  if (isAuthenticated) {
    return <Navigate to={'/profile'} />;
  }

  if (userRequest) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={registerUserError || ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
