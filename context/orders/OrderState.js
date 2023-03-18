import React, { useReducer } from 'react';
import OrderContext from './OrderContext';
import {
  SELECT_CLIENT,
  SELECT_PRODUCT,
  AMOUNT_PRODUCTS,
  UPDATE_TOTAL,
} from '../../types/index';
import OrderReducer from './OrderReducer';

const OrderState = ({ children }) => {
  // State de Pedidos
  const initialState = {
    client: {},
    products: [],
    total: 0,
  };

  const [state, dispatch] = useReducer(OrderReducer, initialState);

  // Modifica el cliente
  const addClient = (client) => {
    dispatch({
      type: SELECT_CLIENT,
      payload: client,
    });
  };
  // Modifica el producto
  const addProduct = (productsSelect) => {
    let newState;
    if (state.products.length > 0) {
      newState = productsSelect.map((product) => {
        const newObject = state.products.find(
          (productState) => productState.id === product.id
        );
        return { ...product, ...newObject };
      });
    } else {
      newState = productsSelect;
    }
    dispatch({
      type: SELECT_PRODUCT,
      payload: newState,
    });
  };

  // Modifica la cantidad de productos
  const amountProducts = (newProduct) => {
    dispatch({
      type: AMOUNT_PRODUCTS,
      payload: newProduct,
    });
  };

  const updateTotal = () => {
    dispatch({ type: UPDATE_TOTAL });
  };

  return (
    <OrderContext.Provider
      value={{
        products: state.products,
        total: state.total,
        client: state.client,
        addClient,
        addProduct,
        amountProducts,
        updateTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderState;
