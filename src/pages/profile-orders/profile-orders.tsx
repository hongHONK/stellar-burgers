import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getProfileFeeds,
  selectProfileOrders
} from '../../services/orders-feed-slice';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredients
} from '../../services/ingredients-slice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectProfileOrders);
  const { ingredients } = useSelector(selectIngredients);

  useEffect(() => {
    if (!orders.length) dispatch(getProfileFeeds());
    if (!ingredients.length) dispatch(getIngredients());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
