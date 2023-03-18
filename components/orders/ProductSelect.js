import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/orders/OrderContext';
const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      stock
      price
    }
  }
`;
const ProductSelect = () => {
  const [products, setProducts] = useState([]);
  // Context
  const orderContext = useContext(OrderContext);
  const { addProduct, updateTotal } = orderContext;
  // Consultat la BD
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  useEffect(() => {
    if (products === null) {
      setProducts([]);
      updateTotal();
    } else {
      addProduct(products);
      updateTotal();
    }
  }, [products]);

  if (loading) return 'Cargando..';

  const { getProducts } = data;

  const selectProducts = (products) => {
    setProducts(products);
  };

  return (
    <div>
      <p className='mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>
        1.- Selecciona o busca los productos
      </p>
      <Select
        className='mt-3'
        isMulti={true}
        options={getProducts}
        onChange={(products) => selectProducts(products)}
        getOptionValue={(product) => product.id}
        getOptionLabel={(product) =>
          `${product.name} - ${product.stock} Disponibles`
        }
        placeholder='Busque o seleccione los productos'
        noOptionsMessage={() => 'No hay resultados'}
      />
    </div>
  );
};

export default ProductSelect;
