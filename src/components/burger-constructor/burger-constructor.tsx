import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  orderBurger,
  resetOrderModalData,
  selectConstructorItems,
  selectConstructorOrderState
} from '../../services/constructor-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser } from '../../services/user-slice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector(selectUser);
  const constructorItems = useSelector(selectConstructorItems);
  const { orderRequest, orderModalData } = useSelector(
    selectConstructorOrderState
  );

  const onOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;

    const ingredientsData = constructorItems.ingredients.map(
      (item) => item._id
    );
    const bunData = constructorItems.bun._id;
    const orderData = ingredientsData.concat(bunData, bunData);

    dispatch(orderBurger(orderData));
  };
  const closeOrderModal = () => {
    dispatch(resetOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
