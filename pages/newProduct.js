import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import { gql, useMutation } from '@apollo/client';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
const NEW_PRODUCT = gql`
  mutation NewProduct($input: ProductInput) {
    newProduct(input: $input) {
      id
      name
      stock
      price
    }
  }
`;
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
function NewProduct() {
  const router = useRouter();
  const [message, setMessage] = useState(null);
  const [newProduct] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { newProduct } }) {
      // Obtener el objeto de cache que deseamos actualizar
      const { getProducts } = cache.readQuery({
        query: GET_PRODUCTS,
      });

      // Reescribimos el cache (el cache nunca se debe modificar)
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [...getProducts, newProduct],
        },
      });
    },
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      stock: '',
      price: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre del producto es obligatorio!'),
      stock: Yup.number()
        .required('La cantidad de productos es obligatoria!')
        .integer('Solo se aceptan numeros enteros')
        .positive('No se aceptan numeros negativos'),
      price: Yup.number()
        .required('El precio del producto es obligatorio!')
        .positive('No se aceptan numeros negativos'),
    }),

    onSubmit: async (data) => {
      const { name, stock, price } = data;
      try {
        const { data } = await newProduct({
          variables: {
            input: {
              name,
              stock,
              price,
            },
          },
        });
        // Usuario creado correctamente
        Swal.fire('Creado!', 'Se agrego el producto correctamente', 'success');
        router.push('/products');
        console.log(data);
      } catch (error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  const { name, stock, price } = formik.values;

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
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo Producto</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <form
            className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
            onSubmit={formik.handleSubmit}
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
                value={name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.name}</p>
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
                value={stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.stock && formik.errors.stock && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.stock}</p>
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
                value={price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.price}</p>
                </div>
              )}
            </div>

            <button
              type='submit'
              className='disabled bg-gray-800 w-full rounded mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
              disabled={!(formik.isValid && formik.dirty)}
            >
              Agregar producto
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default NewProduct;
