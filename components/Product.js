import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Router from 'next/router';
import Swal from 'sweetalert2';

// Components
import EditIcon from '../assets/icons/EditIcon';
import RemoveIcon from '../assets/icons/RemoveIcon';

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      stock
      price
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const Product = ({ product }) => {
  const { id, name, stock, price } = product;
  // Mutation para eliminar productos
  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    update(cache) {
      const { getProducts } = cache.readQuery({
        query: GET_PRODUCTS,
      });

      // Reescribir el cache
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: getProducts.filter(
            (productCurrent) => productCurrent.id !== id
          ),
        },
      });
    },
  });

  const confirmDeleteProduct = () => {
    Swal.fire({
      title: 'Deseas eliminar este producto?',
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
          const { data } = await deleteProduct({
            variables: {
              id,
            },
          });
          // Mostrar alerta
          Swal.fire('Eliminado!', data.deleteProduct, 'success');
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  const editProduct = () => {
    Router.push({
      pathname: '/editProduct/[id]',
      query: { id },
    });
  };
  return (
    <tr key={id}>
      <td className='border px-4 py-2'>{name}</td>
      <td className='border px-4 py-2'>{stock}</td>
      <td className='border px-4 py-2'>$ {price}</td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex-center bg-red-400 hover:bg-red-500 text-white text-xs uppercase font-bold rounded py-2 px-4 w-full'
          onClick={() => confirmDeleteProduct()}
        >
          <p className='mr-2'>Eliminar</p>
          <RemoveIcon />
        </button>
      </td>
      <td className='border px-4 py-2'>
        <button
          type='button'
          className='flex-center bg-emerald-400 hover:bg-emerald-500 text-white text-xs uppercase font-bold rounded py-2 px-4 w-full'
          onClick={() => editProduct()}
        >
          <p className='mr-2'>Editar</p>
          <EditIcon />
        </button>
      </td>
    </tr>
  );
};

export default Product;
