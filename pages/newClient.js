import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const NEW_CLIENT = gql`
  mutation NewClient($input: ClientInput) {
    newClient(input: $input) {
      id
      name
      lastname
      company
      email
      phone
      seller
    }
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
const newClient = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);

  // Mutation para crear nuevos clientes

  const [newClient] = useMutation(NEW_CLIENT, {
    update(cache, { data: { newClient } }) {
      // Obtener el objeto de cache que deseamos actualizar
      const { getClientSeller } = cache.readQuery({
        query: GET_CLIENTS_USER,
      });

      // Reescribimos el cache (el cache nunca se debe modificar)
      cache.writeQuery({
        query: GET_CLIENTS_USER,
        data: {
          getClientSeller: [...getClientSeller, newClient],
        },
      });
    },
  });
  // Routing

  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      company: '',
      phone: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre del cliente es obligatorio!'),
      lastname: Yup.string().required(
        'El apellido del cliente es obligatorio!'
      ),
      company: Yup.string().required('La empresa del cliente es obligatoria!'),
      email: Yup.string()
        .email('El email no es valido')
        .required('El email del cliente es obligatorio'),
    }),
    onSubmit: async (data) => {
      const { name, lastname, company, email, phone } = data;
      try {
        const { data } = await newClient({
          variables: {
            input: {
              name,
              lastname,
              company,
              email,
              phone,
            },
          },
        });

        router.push('/');
        // Usuario creado correctamente
        Swal.fire('Creado!', 'Se agrego el cliente correctamente', 'success');
      } catch (error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  const { name, lastname, company, email, phone } = formik.values;

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
      <h1 className='text-2xl text-gray-800 font-light'>Nuevo Cliente</h1>
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
                placeholder='Nombre del cliente'
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
                htmlFor='lastname'
              >
                Apellido
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                id='lastname'
                type='lastname'
                placeholder='Apellido del cliente'
                value={lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastname && formik.errors.lastname && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.lastname}</p>
                </div>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='company'
              >
                Empresa
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                id='company'
                type='company'
                placeholder='Empresa del cliente'
                value={company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.company && formik.errors.company && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.company}</p>
                </div>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='email'
              >
                Email
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                id='email'
                type='email'
                placeholder='Email del cliente'
                value={email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              )}
            </div>
            <div className='mb-4'>
              <label
                className='block text-gray-700 text-sm font-bold mb-2'
                htmlFor='phone'
              >
                Telefono<span className='text-gray-400'> (opcional)</span>
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                id='phone'
                type='tel'
                placeholder='Telefono del cliente'
                value={phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <button
              type='submit'
              className='disabled bg-gray-800 w-full rounded mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
              disabled={!(formik.isValid && formik.dirty)}
            >
              Agregar cliente
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default newClient;
