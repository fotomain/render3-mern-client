import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";
import {cacheGames} from "./apollo/cache";
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



const apolloClientGames = new ApolloClient({
    uri: (productionWork)?'https://render3-mern-server.onrender.com/graphql':'http://localhost:4000/graphql',
    cache: cacheGames
});

console.log("=== productionWork",productionWork)
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
