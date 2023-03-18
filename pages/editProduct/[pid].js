import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';
import { Formik } from 'formik';
import * as Yup from 'yup';

const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      name
      stock
      price
      create
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput) {
    updateProduct(id: $id, input: $input) {
      id
      name
      stock
      create
      price
    }
  }
`;

const EditProduct = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  // Obtener el ID
  const {
    query: { pid },
  } = router;

  // Consultar para obtener datos del producto
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: { id: pid },
  });

  // Actualizar producto
  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre del producto es obligatorio!'),
    stock: Yup.number()
      .required('La cantidad de productos es obligatoria!')
      .integer('Solo se aceptan numeros enteros')
      .positive('No se aceptan numeros negativos'),
    price: Yup.number()
      .required('El precio del producto es obligatorio!')
      .positive('No se aceptan numeros negativos'),
  });

  if (loading) return 'Cargando...';
  if (!data) {
    return 'Accion no permitida';
  }
  const { getProduct } = data;

  //   Modifica el producto en la BD
  const updateInfoProduct = async (values) => {
    const { name, stock, created, price } = values;

    try {
      const { data } = await updateProduct({
        variables: {
          id: pid,
          input: {
            name,
            stock,
            created,
            price,
          },
        },
      });
      //  Mostrar alerta
      Swal.fire(
        'Actualizado!',
        'El producto se actualizo correctamente',
        'success'
      );
      // Redireccionar
      router.push('/products');
    } catch (error) {
      console.log(error);
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

      <h1 className='text-2xl text-gray-800 font-light'>Edita producto</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={getProduct}
            onSubmit={(values) => {
              updateInfoProduct(values);
            }}
          >
            {(props) => {
              return (
                <form
                  className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                  onSubmit={props.handleSubmit}
                >
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='name'
                    >
                      Nombre
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                      id='name'
                      type='name'
                      placeholder='Nombre producto'
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.name && props.errors.name && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.name}</p>
                      </div>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='stock'
                    >
                      Cantidad
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                      id='stock'
                      type='number'
                      placeholder='Cantidad disponible'
                      value={props.values.stock}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.stock && props.errors.stock && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.stock}</p>
                      </div>
                    )}
                  </div>
                  <div className='mb-4'>
                    <label
                      className='block text-gray-700 text-sm font-bold mb-2'
                      htmlFor='price'
                    >
                      Precio
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                      id='price'
                      type='number'
                      placeholder='Precio producto'
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.price && props.errors.price && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.price}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type='submit'
                    className='disabled bg-gray-800 w-full rounded mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                    disabled={!(props.isValid && props.dirty)}
                  >
                    Agregar producto
                  </button>
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditProduct;
