import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser, selectUser } from '../../services/user-slice/user-slice';
import { Preloader } from '@ui';

export const Login: FC = () => {
  const dispatch = useDispatch();

  const { loginUserError, userRequest, isAuthenticated } =
    useSelector(selectUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email: email, password: password }));
  };

  if (userRequest) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={loginUserError || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
