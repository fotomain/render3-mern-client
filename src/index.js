import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
// import reportWebVitals from './reportWebVitals';

export const productionWork=true
const apolloCache1 = new InMemoryCache()

const apolloCache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                games: {
                    merge(existing, incoming) {
                        console.log("=== incoming111 games ",incoming)
                        return incoming;
                    },
                },
            },
        },
    },
});


// const apolloClient = new ApolloClient({
//     // uri: 'https://render2-mern.onrender.com/api/v1/graphql',
//     // uri: 'https://render2-mern.onrender.com/graphql',
//     // uri: 'http://localhost:4000/graphql',
//     uri: (productionWork)?'https://render3-mern-client.netlify.app/graphql':'http://localhost:4000/graphql',
//     cache: apolloCache,
//     defaultOptions: {
//         watchQuery: { fetchPolicy: "cache-and-network" },
//     },
// });

const apolloClientGames = new ApolloClient({
    uri: (productionWork)?'https://render3-mern-client.netlify.app/graphql':'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
});

console.log("=== apolloClientGames",apolloClientGames)

ReactDOM.render(
  <React.StrictMode>

      <ApolloProvider client={apolloClientGames}>
            <App />
      </ApolloProvider>

  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
