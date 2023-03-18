import React from 'react';
import Swal from 'sweetalert2';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
// Icons
import RemoveIcon from '../assets/icons/RemoveIcon';
import EditIcon from '../assets/icons/EditIcon';

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;
const GET_CLIENTS_USER = gql`
  query getClientSeller {
    getClientSeller {
      id
      name
      lastname
      email
      company
    }
  }
`;
const Client = ({ client }) => {
  // Mutation para eliminar cliente
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      const { getClientSeller } = cache.readQuery({
        query: GET_CLIENTS_USER,
      });

      // Reescribir el cache
      cache.writeQuery({
        query: GET_CLIENTS_USER,
        data: {
          getClientSeller: getClientSeller.filter(
            (clientCurrent) => clientCurrent.id !== id
          ),
        },
      });
    },
  });

  const { name, lastname, company, email, id } = client;

  const confirmDeleteClient = () => {
    Swal.fire({
      title: 'Deseas eliminar a este cliente?',
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
          const { data } = await deleteClient({
            variables: {
              id,
            },
          });
          // Mostrar alerta
          Swal.fire('Eliminado!', data.deleteClient, 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editClient = () => {
    Router.push({
      pathname: '/editClient/[id]',
      query: { id },
    });
  };

  return (
    <tr key={id}>
      <td className='border px-4 py-2'>
        {name} {lastname}
      </td>
      <td className='border px-4 py-2'>{company}</td>
      <td className='border px-4 py-2'>{email}</td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex-center bg-red-400 hover:bg-red-500 text-white text-xs uppercase font-bold rounded py-2 px-4 w-full'
          onClick={() => confirmDeleteClient()}
        >
          <p className='mr-2'>Eliminar</p>
          <RemoveIcon />
        </button>
      </td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex-center bg-emerald-400 hover:bg-emerald-500 text-white text-xs uppercase font-bold rounded py-2 px-4 w-full'
          onClick={() => editClient()}
        >
          <p className='mr-2'>Editar</p>
          <EditIcon />
        </button>
      </td>
    </tr>
  );
};

export default Client;
