import React from 'react';
import {
  SELECT_CLIENT,
  SELECT_PRODUCT,
  AMOUNT_PRODUCTS,
  UPDATE_TOTAL,
} from '../../types/index';

export default (state, action) => {
  switch (action.type) {
    case SELECT_CLIENT:
      return {
        ...state,
        client: action.payload,
      };
    case SELECT_PRODUCT:
      return {
        ...state,
        products: action.payload,
      };
    case AMOUNT_PRODUCTS:
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id
            ? (product = action.payload)
            : product
        ),
      };
    case UPDATE_TOTAL:
      return {
        ...state,
        total: state.products.reduce(
          (newTotal, article) => (newTotal += article.price * article.amount),
          0
        ),
      };
    default:
      return state;
  }
};
