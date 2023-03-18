import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  return (
    <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5 sm:min-h-screen p-5'>
      <div>
        <p className='text-white text-2xl font-bold	'>CRM Clients</p>
      </div>
      <nav className='mt-5 text-white list-none'>
        <li className={router.pathname !== '/' ? 'p-2' : 'p-2 bg-blue-800'}>
          <Link href='/'>Clientes</Link>
        </li>
        <li
          className={router.pathname !== '/orders' ? 'p-2' : 'p-2 bg-blue-800'}
        >
          <Link href='/orders'>Pedidos</Link>
        </li>
        <li
          className={
            router.pathname !== '/products' ? 'p-2' : 'p-2 bg-blue-800'
          }
        >
          <Link href='/products'>Productos</Link>
        </li>
      </nav>
      <div className='sm:mt-10'>
        <p className='text-white text-xl font-bold	'>Más opciones</p>
      </div>
      <nav className='mt-5 text-white list-none'>
        <li
          className={
            router.pathname !== '/bestSellers' ? 'p-2' : 'p-2 bg-blue-800'
          }
        >
          <Link href='/bestSellers'>Mejores Vendedores</Link>
        </li>
        <li
          className={
            router.pathname !== '/bestClients' ? 'p-2' : 'p-2 bg-blue-800'
          }
        >
          <Link href='/bestClients'>Mejores Clientes</Link>
        </li>
      </nav>
    </aside>
  );
};

export default Sidebar;
