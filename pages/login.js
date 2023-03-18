import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';

const AUTH_USER = gql`
  mutation AuthUser($input: AuthInput) {
    authUser(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [message, setMessage] = useState(false);

  // Mutation para crear nuevos usuarios
  const [authUser] = useMutation(AUTH_USER);

  // Routing
  const router = useRouter();

  // Validacion del formulario
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('El email no es valido')
        .required('El email es obligatorio'),
      password: Yup.string()
        .required('El password es obligatorio')
        .min(6, 'El password debe ser de al menos 6 caracteres'),
    }),
    onSubmit: async (data) => {
      const { email, password } = data;
      try {
        const { data } = await authUser({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        // Usuario creado correctamente
        setMessage('Autenticando...');

        // Guardar el token en localstorage
        setTimeout(() => {
          const { token } = data.authUser;
          localStorage.setItem('token', token);
        }, 1000);

        setTimeout(() => {
          setMessage(null);
          // Redirigir usuario para iniciar sesión
          router.push('/');
        }, 2000);
      } catch (error) {
        setMessage(error.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    },
  });

  const { email, password } = formik.values;

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
        {message && showMessage()}
        <h1 className='flex-center text-white text-2xl'>Login</h1>
        <div className='flex justify-center mt-5'>
          <div className='w-full max-w-sm'>
            <form
              className='bg-white rounded shadow-md px-8 pt-6 pt-6 pb-4 mb-4'
              onSubmit={formik.handleSubmit}
            >
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
                  htmlFor='email'
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
                className='disabled bg-gray-800 rounded w-full mt-5 p-2 text-white uppercase hover:bg-gray-900'
                disabled={!(formik.isValid && formik.dirty)}
              >
                Iniciar sesion
              </button>
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
