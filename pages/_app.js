import { ApolloProvider } from '@apollo/client';
import OrderState from '../context/orders/OrderState';

import client from '../config/apollo';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <OrderState>
        <Component {...pageProps} />;
      </OrderState>
    </ApolloProvider>
  );
}

export default MyApp;
