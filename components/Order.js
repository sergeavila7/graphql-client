import React, { useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

// ICONS
import EmailIcon from '../assets/icons/EmailIcon';
import PhoneIcon from '../assets/icons/PhoneIcon';
import RemoveIcon from '../assets/icons/RemoveIcon';

const GET_ORDERS = gql`
  query getOrdersSeller {
    getOrdersSeller {
      id
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: OrderInput) {
    updateOrder(id: $id, input: $input) {
      state
    }
  }
`;
const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

const Order = ({ order }) => {
  const {
    id,
    total,
    client: { name, lastname, phone, email },
    state,
  } = order;

  // Mutation para cambiar el estado de un pedido
  const [updateOrder] = useMutation(UPDATE_ORDER, DELETE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      const { getOrdersSeller } = cache.readQuery({
        query: GET_ORDERS,
      });
      cache.writeQuery({
        query: GET_ORDERS,
        data: {
          getOrdersSeller: getOrdersSeller.filter((order) => order.id !== id),
        },
      });
    },
  });

  const [statusOrder, setStatusOrder] = useState(state);
  const [style, setStyle] = useState();

  useEffect(() => {
    if (statusOrder) {
      setStatusOrder(statusOrder);
    }
    styleOrder();
  }, [statusOrder]);

  const styleOrder = () => {
    if (statusOrder === 'PENDIENTE') {
      setStyle('border-yellow-400  hover:border-yellow-500');
    } else if (statusOrder === 'COMPLETADO') {
      setStyle('border-green-400  hover:border-green-500');
    } else {
      setStyle('border-red-400  hover:border-red-500');
    }
  };

  const changeOrderState = async (newState) => {
    try {
      const data = await updateOrder({
        variables: {
          id,
          input: {
            state: newState,
            client: order.client.id,
          },
        },
      });
      setStatusOrder(data.data.updateOrder.state);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDeleteOrder = () => {
    Swal.fire({
      title: 'Deseas eliminar el pedido?',
      text: 'Esta accion no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelarButtonText: 'No, cancelar!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          //Eliminar por ID
          const { data } = await deleteOrder({
            variables: {
              id,
            },
          });
          // Mostrar alerta
          Swal.fire('Eliminado!', data.deleteOrder, 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div
      className={`${style} border-t-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}
    >
      <div className='font-bold text-gray-800'>
        Cliente: {name} {lastname}
        {email && (
          <div className='flex mt-2'>
            <i className='mr-2'>
              <EmailIcon />
            </i>
            <p>{email}</p>
          </div>
        )}
        {phone && (
          <div className='flex mt-2'>
            <i className='mr-2'>
              <PhoneIcon />
            </i>
            <p>{phone}</p>
          </div>
        )}
        <h2 className='text-gray-800 font-bold mt-5'>Estado Pedido:</h2>
        <select
          className='mt-2 appearance-none bg-blue-600 hover:bg-blue-700 border border-blue-600 text-white p-2 rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold '
          value={statusOrder}
          name='status'
          onChange={(e) => changeOrderState(e.target.value)}
        >
          <option value='COMPLETADO'>COMPLETADO</option>
          <option value='PENDIENTE'>PENDIENTE</option>
          <option value='CANCELADO'>CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className='text-gray-800 font-bold mt-8'>Resumen del Pedido</h2>
        {order.order.map((article) => (
          <div key={article.id} className='mt-4'>
            <p className='text-sm text-gray-600'>Producto: {article.name}</p>
            <p className='text-sm text-gray-600'>Cantidad: {article.amount}</p>
          </div>
        ))}
        <p className='text-gray-800 mt-3 font-bold'>
          Total a pagar: <span> ${total}</span>
        </p>
        <button
          className='flex-center mt-4 mr-4 bg-red-400 hover:bg-red-500 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold'
          onClick={() => confirmDeleteOrder()}
        >
          <p className='mr-2'>Eliminar pedido</p>
          <RemoveIcon />
        </button>
      </div>
    </div>
  );
};

export default Order;
