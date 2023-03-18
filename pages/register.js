import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useMutation, gql } from '@apollo/client';

const SIGN_UP = gql`
  mutation NewUser($input: UserInput) {
    newUser(input: $input) {
      id
      name
      lastname
      email
      create
    }
  }
`;

const Register = () => {
  const [message, setMessage] = useState(false);

  // Mutation para crear nuevos usuarios
  const [newUser, loading, error] = useMutation(SIGN_UP);

  // Routing
  const router = useRouter();

  // Validacion del formulario
  const formik = useFormik({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es obligatorio'),
      lastname: Yup.string().required('El apellido es obligatorio'),
      email: Yup.string()
        .email('El email no es valido')
        .required('El email es obligatorio'),
      password: Yup.string()
        .required('El password es obligatorio')
        .min(6, 'El password debe ser de al menos 6 caracteres'),
    }),
    onSubmit: async (data) => {
      const { name, lastname, email, password } = data;
      try {
        const { data } = await newUser({
          variables: {
            input: {
              name,
              lastname,
              email,
              password,
            },
          },
        });
        // Usuario creado correctamente
        setMessage(`Se creo correctamente el Usuario: ${data.newUser.name}`);
        setTimeout(() => {
          setMessage(null);
          // Redirigir usuario para iniciar sesión
          router.push('/login');
        }, 3000);
      } catch (error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  const { name, lastname, email, password } = formik.values;

  const showMessage = () => {
    return (
      <div className='bg-white p-4 w-full my-3 max-w-sm text-center mx-auto font-bold'>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <>
      <Layout>
        _{message && showMessage()}
        <h1 className='flex-center text-white text-2xl'>Crear nueva cuenta</h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form
              className='bg-white rounded shadow-md px-8 pt-6 pt-6 pb-4 mb-4'
              onSubmit={formik.handleSubmit}
            >
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='name'
                >
                  Apellidos
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                  id='name'
                  type='text'
                  placeholder='Nombre usuario'
                  value={name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.name && formik.errors.name && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.name}</p>
                </div>
              )}
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='lastName'
                >
                  Apellidos
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                  id='lastname'
                  type='text'
                  placeholder='Apellido usuario'
                  value={lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.lastname && formik.errors.lastname && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.lastname}</p>
                </div>
              )}
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
                  placeholder='Email usuario'
                  value={email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.email}</p>
                </div>
              )}
              <div className='mb-4'>
                <label
                  className='block text-gray-700 text-sm font-bold mb-2'
                  htmlFor='password'
                >
                  Password
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                  id='password'
                  type='password'
                  placeholder='Password usuario'
                  value={password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                  <p className='font-bold'>Error</p>
                  <p>{formik.errors.password}</p>
                </div>
              )}
              <button
                type='submit'
                className='bg-gray-800 rounded w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                disabled={!(formik.isValid && formik.dirty)}
              >
                Crear cuenta
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Register;
