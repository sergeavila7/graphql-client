import React, { useState, useEffect, useContext } from 'react';
import OrderContext from '../context/orders/OrderContext';

const AbstractProduct = ({ product }) => {
  const orderContext = useContext(OrderContext);
  const { amountProducts, updateTotal, products } = orderContext;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    updateProduct();
    updateTotal();
  }, [amount]);

  const updateProduct = () => {
    const newProduct = { ...product, amount: Number(amount) };
    amountProducts(newProduct);
  };

  const { name, price } = product;

  return (
    <div className='md:flex md:justify-between md:items-center mt-5'>
      <div className='md:w-2/4 mb-2 md:mb-0'>
        <p className='text-sm'>{name}</p>
        <p className='text-sm'>$ {price}</p>
      </div>
      <input
        type='number'
        placeholder='Cantidad'
        className='shadow apperance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </div>
  );
};

export default AbstractProduct;
