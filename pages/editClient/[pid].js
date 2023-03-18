import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation, useQuery } from '@apollo/client';
import Swal from 'sweetalert2';

const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    getClient(id: $id) {
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

const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: ClientInput) {
    updateClient(id: $id, input: $input) {
      name
      email
    }
  }
`;

const EditClient = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);

  // Obtener el ID
  const {
    query: { pid },
  } = router;
  // Consultar para obtener datos del cliente
  const { data, loading, error } = useQuery(GET_CLIENT, {
    variables: { id: pid },
  });

  // Actualizar cliente
  const [updateClient] = useMutation(UPDATE_CLIENT);

  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre del cliente es obligatorio!'),
    lastname: Yup.string().required('El apellido del cliente es obligatorio!'),
    company: Yup.string().required('La empresa del cliente es obligatoria!'),
    email: Yup.string()
      .email('El email no es valido')
      .required('El email del cliente es obligatorio'),
  });

  if (loading) return 'Cargando...';
  if (!data) {
    return 'Accion no permitida';
  }
  const { getClient } = data;

  // Modifica el cliente en la BD
  const updateInfoClient = async (values) => {
    const { name, lastname, company, email, phone } = values;

    try {
      const { data } = await updateClient({
        variables: {
          id: pid,
          input: {
            name,
            lastname,
            company,
            email,
            phone,
          },
        },
      });
      //  Mostrar alerta
      Swal.fire(
        'Actualizado!',
        'El cliente se actualizo correctamente',
        'success'
      );
      // Redireccionar
      router.push('/');
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
      <h1 className='text-2xl text-gray-800 font-light'>Editar Cliente</h1>
      <div className='flex justify-center mt-5'>
        <div className='w-full max-w-lg'>
          <Formik
            validationSchema={validationSchema}
            enableReinitialize
            initialValues={getClient}
            onSubmit={(values) => {
              updateInfoClient(values);
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
                      placeholder='Nombre del cliente'
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
                      htmlFor='lastname'
                    >
                      Apellido
                    </label>
                    <input
                      className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-cyan-600'
                      id='lastname'
                      type='lastname'
                      placeholder='Apellido del cliente'
                      value={props.values.lastname}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.lastname && props.errors.lastname && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.lastname}</p>
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
                      value={props.values.company}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.company && props.errors.company && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.company}</p>
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
                      value={props.values.email}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                    {props.touched.email && props.errors.email && (
                      <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                        <p className='font-bold'>Error</p>
                        <p>{props.errors.email}</p>
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
                      value={props.values.phone}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  <button
                    type='submit'
                    className='disabled bg-gray-800 w-full rounded mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900'
                    disabled={!(props.isValid && props.dirty)}
                  >
                    Guardar cambios
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

export default EditClient;
