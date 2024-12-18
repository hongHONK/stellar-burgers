import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  selectIngredients
} from '../../services/ingredients-slice/ingredients-slice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ingredients } = useSelector(selectIngredients);

  const ingredientData = ingredients.find(
    (item) => item._id === id?.toString()
  );

  useEffect(() => {
    if (!ingredients.length) dispatch(getIngredients());
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
