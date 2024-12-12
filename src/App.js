// npm start
import React, {Component, useEffect, useState} from "react";

//npm i react-uuid
import uuid from 'react-uuid'


import "./App.css";
import {ApolloClient, ApolloProvider, InMemoryCache, useMutation} from "@apollo/client";
import {CREATE_CLIENT} from "./graphql/mutations/clientMutations";
import {GET_CLIENTS} from "./graphql/queries/clientQueries";
import { gql, useQuery } from '@apollo/client';

const GET_DOGS = gql`

  query GetDogs {

    games {

      title

    }
  }
`;
const App1 = ()=>{

    const { loading, error, data } = useQuery(GET_DOGS);
    console.log("=== GET_DOGS1 ",data)
    useEffect(() => {

        console.log("=== GET_DOGS2 ",data)
        return () => {

        };
    }, [data]);

    const runApi = async  ({url = "", data = {}, mode="POST" }) => {
        console.log('=== data ',data)
        const response = await fetch(url, {
            method: mode, // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
            .then((response) => response.json())
            .then((data) => {

                console.log('=== data  ',data)
                return data

            })


        console.log('=== response  ',response)

        return response

    }

    const [clientName, setClientName] = useState('Client'+Date.now());
    const [clientEmail, setClientEmail] = useState("xx"+Date.now()+'email@email.com');
    const [clientPhone, setClientPhone] = useState("+1 222333555");

    const [addClient] = useMutation(CREATE_CLIENT, {
        variables: { name:clientName, email:clientEmail, phone:clientPhone },
        update(cache, { data: { addClient } }) {
            const ret0 = cache.readQuery({ query: GET_CLIENTS });
            console.log("=== ret0",ret0)
            const { clients } = ret0

            cache.writeQuery({
                query: GET_CLIENTS,
                data: { clients: [...clients, addClient] },
            });
        },
    });


    return (

        <div className="App">
            <div className="App-column">

                <div style={{width:'130px', height:'50px', display:'flex', flexDirection:'row', justifyContent:'center', backgroundColor:'red'}}>
                <button
                    onClick={()=>{

                        const ret2 = runApi(
                            {url: 'https://render3-mern-server.onrender.com/testfetch'}
                        )
                        console.log('== ret2 ',ret2)
                    }
                    }
                > TEST SERVER games</button>
                </div>

                <div style={{width:'130px', height:'50px', display:'flex', flexDirection:'row', justifyContent:'center', backgroundColor:'red'}}>
                <button
                    onClick={()=>{

                        const ret2 = runApi(
                            {url: 'https://render3-mern-server.onrender.com/testfetch'}
                            // {url: 'https://localhost:4000/status'}
                        )
                        console.log('== ret2 ',ret2)
                    }
                    }
                > TEST SERVER testfetch</button>
                </div>


                <div
                    style={{width:'130px', height:'50px',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        backgroundColor:'red'}}>

                    <button
                        onClick={()=>{

                            console.log(clientName)
                            console.log(clientEmail)
                            console.log(clientPhone)

                            addClient();
                            // addClient(name, email, phone);

                            // // const ret2 = runApi('http://localhost:3100/mognodb_settings',
                            // const ret2 = runApi(
                            //     {url: 'https://render2-mern.onrender.com/api/v1/books'},
                            // )
                            // console.log('== ret2 ',ret2)
                        }
                        }
                    > CREATE CLIENT </button>

                </div>

                <div
                    style={{width:'130px', height:'50px',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        backgroundColor:'red'}}>

                    <button
                        onClick={()=>{

                            // const ret2 = runApi('http://localhost:3100/mognodb_settings',
                            const ret2 = runApi(
                                {url: 'https://render2-mern.onrender.com/api/v1/books'},
                            )
                            console.log('== ret2 ',ret2)
                        }
                        }
                    > TEST mongoDB</button>

                </div>

                <div
                    style={{width:'130px', height:'50px',
                        display:'flex',
                        flexDirection:'row',
                        justifyContent:'center',
                        backgroundColor:'red'}}>

                    <button
                        onClick={()=>{

                            // const ret2 = runApi('http://localhost:3100/schema_settings',
                            const ret2 = runApi(
                                {url: 'https://render2-mern.onrender.com/api/v1/schema_settings'}
                            )
                            console.log('== ret2 ',ret2)
                        }
                        }
                    > TEST schema</button>

                </div>

                {/*==========================*/}
                {/*==========================*/}
                {/*==========================*/}


            </div>

        </div>
    );
}

export default App1;
