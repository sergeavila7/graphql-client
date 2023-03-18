import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const GET_USER = gql`
  query getUser {
    getUser {
      id
      name
      lastname
    }
  }
`;
const Header = () => {
  const router = useRouter();

  const { data, loading, error, client } = useQuery(GET_USER);

  if (loading) return 'Cargando...';

  if (!data?.getUser) {
    client.clearStore();
    router.push('/login');
    return <p>Loading...</p>;
  }

  const { name, lastname } = data.getUser;

  const logOut = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className='sm:flex  sm:justify-between mb-6'>
      <p className='mr-2 mb-5 lg:mb-0'>
        Hola:{' '}
        <strong>
          {name} {lastname}
        </strong>
      </p>
      <button
        onClick={() => logOut()}
        type='button'
        className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded p-2 text-white shadow-md hover:bg-blue-900'
      >
        Cerrar Sesion
      </button>
    </div>
  );
};

export default Header;
