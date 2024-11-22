import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getProfileFeeds,
  selectProfileOrders
} from '../../services/orders-feed-slice';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);

  useEffect(() => {
    if (!orders.length) dispatch(getProfileFeeds());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
