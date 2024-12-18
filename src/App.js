// npm start
import React, {useEffect, useState} from "react";

import {v4 as uuid4} from "uuid";

//npm i uuid

import "./App.css";



import {gql, useMutation, useQuery, useReactiveVar} from '@apollo/client';
import DisplayCart from "./DisplayCart";
import {cartItemsVar, setCartData} from "./apollo/cache";

const GET_GAMES_AND_AUTHORS = gql`

  query readGamesAndAuthors {

    games {
      id
      title
      platform
    }
    
    authors {
      id
      name
      verified
    }
    
    
  }

  `;

export const GET_CART_ITEMS = gql`
      query GetCartItems {
        cartItems @client
      }
    `;


//st1-operation-define query + go to server to deleteGame definition and call
const UPDATE_GAME_GQL = gql`

mutation EditMutation($updateId: ID!,$newData: UpdateGameInput) {
  updateGame(id: $updateId, edits: $newData) {
    title,
    platform
  }
}

`;

const DELETE_GAME_GQL = gql`

mutation deleteGameMutation($idDelete: ID!){
  deleteGame(id: $idDelete) {
    id
  }
}
`;

const CREATE_GAME_GQL = gql`

mutation createGameMutation($game: CreateGameInput!){
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
      isInCart  @client 
      
    }
  }
`;
const App1 = ()=>{

    const [state, setState] = useState({
        last_guid:'',
    });

    //st2-operation-define mutation
    const [updateGameAdapter, updateGameInfo] = useMutation(UPDATE_GAME_GQL,{
        update(cacheLocal,dataForUpdate) {
            console.log("=== cacheLocal ", cacheLocal)
            console.log("=== dataForUpdate.data ", dataForUpdate.data)

            cacheLocal.writeQuery({
                query: READ_GAMES_GQL,
                data: { games: dataForUpdate.data.updateGame },
            });

            console.log("=== updateGame OK")

        }
    })

    const [deleteGameAdapter, deleteGameInfo] = useMutation(DELETE_GAME_GQL,{
            update(cacheLocal,dataForUpdate) {
                console.log("=== cacheLocal ", cacheLocal)
                console.log("=== dataForUpdate.data ", dataForUpdate.data)

                        cacheLocal.writeQuery({
                            query: READ_GAMES_GQL,
                            data: { games: dataForUpdate.data },
                        });

                console.log("=== deleteGame OK ")

            }
        })

    const [createGameAdapter, createGameInfo] = useMutation(CREATE_GAME_GQL,
        {
            update(cacheLocal,dataForUpdate){
                console.log("=== cacheLocal ",cacheLocal)
                console.log("=== dataForUpdate.data ",dataForUpdate.data)

                    var dataInCache=[]
                    const allDataNow =  cacheLocal.readQuery({ query: READ_GAMES_GQL });
                    console.log("=== allDataNow ",allDataNow)
                        if( null!==allDataNow )
                            dataInCache =  allDataNow.games

                        cacheLocal.writeQuery({
                            query: READ_GAMES_GQL,
                            data: { games: [...dataInCache, dataForUpdate.data.createGame] },
                        });

                console.log("=== createGame OK ")
                // freshData
            }
        });

    const readGamesResponse = useQuery(READ_GAMES_GQL);
    if(readGamesResponse.error)
        console.log("===  readGamesResponse.error ",readGamesResponse.error)
    const readGamesAndAuthorsResponse = useQuery(GET_GAMES_AND_AUTHORS);
    if(readGamesAndAuthorsResponse.error)
        console.log("===  readGamesAndAuthorsResponse.error ",readGamesAndAuthorsResponse.error)

    useEffect(() => {

        console.log("=== last_guid ",state.last_guid)
        return () => {

        };
    }, [state.last_guid]);

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

        console.log("=== GET_GAMES 111 readGamesResponse.data ",readGamesResponse.data)
        return () => {

        };
    }, [readGamesResponse.data]);

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

    const cartData = useReactiveVar(setCartData);

    // st4-cartItems
    const readCartItemsResponse = useQuery(GET_CART_ITEMS);
    console.log("=== readCartItemsResponse ",readCartItemsResponse?.data?.cartItems)
    // ====== sss+
    return (

        <div className="App">
            <div className="App-column">

                <div id="last_guid" style={{backgroundColor:'yellowgreen'}}>last_guid {state.last_guid}</div>
                <div id="last_guid" style={{backgroundColor:'yellowgreen'}}>readCartItemsResponse {JSON.stringify(readCartItemsResponse.data)}</div>

                <DisplayCart/>

                <div style={{width:'130px', height:'50px', display:'flex', flexDirection:'row', justifyContent:'center', backgroundColor:'red'}}>
                <button
                    onClick={()=>{

                        const _guid=uuid4()
                        setState((prevState)=> { return {...prevState,
                            last_guid:_guid
                        }})

                        const variablesParameters =
                            {
                                "game": {
                                    "title": "New game "+Date.now(),
                                    "platform": ["iOS","platform-"+Date.now()],
                                    "id": _guid,
                                    // "id": "",
                                    // "id": "client-"+uuid4(),
                                    // "id": "111-222-333",
                                },
                            }
                        console.log("=== variablesParameters  ",variablesParameters)
                        createGameAdapter({ variables: variablesParameters})

                        console.log("=== GET_GAMES 222 readGamesResponse.data ",readGamesResponse.data)

                    }}
                >
                    CREATE GAME
                </button>
                </div>

                {readGamesResponse?.data?.games && readGamesResponse.data.games.map((el,ii)=>{
                    return <div style={{color:'blue'}} key={el.id}>

                        <div style={{flexDirection:'row'}} >

                            <div>{el.id}</div>
                            <div>{JSON.stringify(el.platform)}</div>

                            <input type="text" value={el.title} onChange={(e)=> {
                                console.log('== UPDATE 1 GAME onChange= ', e.target.value)

                                updateGameAdapter({
                                    variables: {
                                        updateId: el.id,
                                        newData:{
                                            title:e.target.value,
                                            platform:["Android"]
                                        }
                                    }
                                })

                            }}
                            />
                            {/*{el.title}*/}
                            <button
                                onClick={()=>{
                                    console.log('== DELETE 1 GAME ',el.id)
                                    deleteGameAdapter({ variables: {idDelete:el.id}})
                                }
                                }
                            >
                                DELETE
                            </button>

                            {/*{el.isInCart?<div>X</div>*/}
                            {readCartItemsResponse?.data?.cartItems && -1!==readCartItemsResponse?.data?.cartItems?.indexOf(el.id)
                                ?<button
                                    style={{backgroundColor:'lightpink'}}
                                    onClick={()=>{
                                        console.log('== Delete from Cart ',el.id)
                                        const indexInCart = cartData.indexOf(el.id)
                                        console.log("=== indexInCart",indexInCart)
                                        if(-1!==indexInCart) {
                                            var newData1 = cartData.filter(arrEl => el.id !== arrEl.id )
                                            const indexDelete1 = newData1.indexOf(el.id)
                                                if(-1<indexDelete1)
                                                {
                                                    newData1.splice(indexDelete1,1)
                                                }
                                            setCartData([...newData1])

                                            // st3-cartItems
                                            var newData2 = cartItemsVar()
                                            console.log("=== newData2 before",newData2)
                                            const indexDelete2 = newData2.indexOf(el.id)
                                                if(-1<indexDelete2)
                                                {
                                                    newData2.splice(indexDelete2,1)
                                                }
                                            console.log("=== newData2 filtered",newData2)
                                            cartItemsVar([...newData2])
                                        }
                                    }
                                    }
                                >
                                    X from Cart
                                </button>

                                :
                                <button
                                    style={{backgroundColor:'lightgreen'}}
                                    onClick={()=>{
                                        console.log('== Add to Cart ',el.id)
                                        const indexInCart = cartData.indexOf(el.id)
                                        console.log("=== indexInCart",indexInCart)
                                        if(-1===indexInCart) {
                                            setCartData([...cartData,el.id])
                                            // st3-cartItems
                                            cartItemsVar([...cartItemsVar(),el.id])
                                        }
                                    }
                                    }
                                >
                                    Add to Cart
                                </button>
                            }
                        </div>

                    </div>
                })}

                <div style={{width:'130px', height:'50px', display:'flex', flexDirection:'row', justifyContent:'center', backgroundColor:'red'}}>
                    <button
                        onClick={()=>{
                            console.log('== readGamesAndAuthorsResponse.data ',readGamesAndAuthorsResponse.data)
                        }}
                    >
                        READ Games and Authors
                    </button>
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
                >
                    TEST SERVER testfetch
                </button>
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
                    >
                        TEST mongoDB
                    </button>

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
                    >
                        TEST schema
                    </button>

                </div>

                {/*==========================*/}
                {/*==========================*/}
                {/*==========================*/}


            </div>

        </div>
    );
}

export default App1;
