// npm start
import React, {useEffect, useState} from "react";

import uuid from "uuid";

//npm i uuid



import "./App.css";

import {CREATE_CLIENT} from "./graphql/mutations/clientMutations";
import {GET_CLIENTS} from "./graphql/queries/clientQueries";
import { gql, useMutation, useQuery } from '@apollo/client';


const CREATE_GAME_GQL = gql`

mutation createGameMutation($game: ameInput!){
  createGame(game: $game) {
    id,
    title,
    platform,         
  }
}

`;
const READ_GAMES_GQL = gql`

  query readGamesQuerry {

    games {

      id
      title
      platform

    }
  }
`;
const App1 = ()=>{

    const [createGameAdapter, createGameInfo] = useMutation(CREATE_GAME_GQL);

    const getGamesResponse = useQuery(READ_GAMES_GQL);

    useEffect(() => {

        console.log("=== CREATE_GAME createGameInfo.error ",createGameInfo.error)
        return () => {

        };
    }, [createGameInfo.error]);

    useEffect(() => {

        console.log("=== CREATE_GAME createGameInfo.data ",createGameInfo.data)
        return () => {

        };
    }, [createGameInfo.data]);

    useEffect(() => {

        console.log("=== GET_GAMES 111 getGamesResponse.data ",getGamesResponse.data)
        return () => {

        };
    }, [getGamesResponse.data]);

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

                        createGameAdapter({ variables: {
                                "game": {
                                    "title": "New game "+Date.now(),
                                    "platform": ["iOS","platform-"+Date.now()],
                                    "id": uuid.v4(),
                                    
                                    // "id": "111-222-333",
                                },
                        }})

                        console.log("=== GET_GAMES 222 getGamesResponse.data ",getGamesResponse.data)

                    }}
                > TEST CREATE GAME </button>
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
