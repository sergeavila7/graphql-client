import React, { useContext } from 'react';
import OrderContext from '../../context/orders/OrderContext';

// Components
import AbstractProduct from '../AbstractProduct';

const AbstractOrder = () => {
  // Context
  const orderContext = useContext(OrderContext);
  const { products } = orderContext;
  return (
    <>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        3.- Selecciona las cantidades del producto
      </p>
      {products.length > 0 ? (
        <>
          {products.map((product) => (
            <AbstractProduct key={product.id} product={product} />
          ))}
        </>
      ) : (
        <p className='mt-5 text-sm'>Aún no hay productos</p>
      )}
    </>
  );
};

export default AbstractOrder;
