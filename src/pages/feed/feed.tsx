import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getFeeds,
  selectOrders
} from '../../services/orders-feed-slice/orders-feed-slice';
import {
  getIngredients,
  selectIngredients
} from '../../services/ingredients-slice/ingredients-slice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const orders: TOrder[] = useSelector(selectOrders);
  const { ingredients } = useSelector(selectIngredients);

  useEffect(() => {
    if (!orders.length) dispatch(getFeeds());
    if (!ingredients.length) dispatch(getIngredients());
  }, []);

  if (!orders.length || !ingredients.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeeds());
      }}
    />
  );
};
