import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import OrderContext from '../context/orders/OrderContext';
import { gql, useMutation } from '@apollo/client';

import * as Yup from 'yup';
import Swal from 'sweetalert2';

// Components
import Layout from '../components/Layout';
import ClientSelect from '../components/orders/ClientSelect';
import ProductSelect from '../components/orders/ProductSelect';
import AbstractOrder from '../components/orders/AbstractOrder';
import Total from '../components/orders/Total';

const GET_ORDERS = gql`
  query getOrdersSeller {
    getOrdersSeller {
      id
      order {
        id
        amount
        name
      }
      client {
        id
        name
        lastname
        email
        phone
      }
      seller
      total
      state
    }
  }
`;

const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`;

function NewProduct() {
  const router = useRouter();
  const [message, setMessage] = useState(null);

  // Utilizar context y extraer sus funciones y valores
  const orderContext = useContext(OrderContext);
  const { client, products, total } = orderContext;
  // Mutation para crear un nuevo pedido
  const [newOrder] = useMutation(NEW_ORDER, {
    update(cache, { data: { newOrder } }) {
      const { getOrdersSeller } = cache.readQuery({
        query: GET_ORDERS,
      });
      cache.writeQuery({
        query: GET_ORDERS,
        data: {
          getOrdersSeller: [...getOrdersSeller, newOrder],
        },
      });
    },
  });

  const validateOrder = () => {
    return !products.every((product) => product?.amount > 0) ||
      total === 0 ||
      client?.length === 0
      ? 'opacity-50 cursor-not-allowed'
      : '';
  };

  const addNewOrder = async () => {
    const { id } = client;
    // Extraer solo lo necesario de productos
    const order = products.map(({ stock, __typename, ...product }) => product);
    try {
      const { data } = await newOrder({
        variables: {
          input: {
            client: id,
            total,
            order,
          },
        },
      });

      // Redireccionar
      router.push('/orders');

      // Mostrar alerta
      Swal.fire('Creado!', 'Se agrego el pedido correctamente', 'success');
    } catch (error) {
      setMessage(error.message);
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  };

  const showMessage = () => {
    return (
      <div className='bg-white p-4 w-full my-3 max-w-sm text-center mx-auto font-bold'>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <Layout>
      {message && showMessage()}
      <h1 className='text-2xl text-gray-800 font-light'>Crear Nuevo Pedido</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <ClientSelect />
          <ProductSelect />
          <AbstractOrder />
          <Total />
          <button
            type='button'
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 rounded ${validateOrder()}`}
            onClick={() => addNewOrder()}
          >
            Registrar pedido
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default NewProduct;
