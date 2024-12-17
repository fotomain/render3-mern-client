import { makeVar, InMemoryCache } from "@apollo/client";

const cartDataInit = localStorage.getItem('games_cart');
export const setCartData = makeVar(JSON.parse(cartDataInit));
export const cacheGames = new InMemoryCache({
    typePolicies: {
        Game: {
            fields: { // Field policy map for the Product type
                isInCart: { // Field policy for the isInCart field

                    read(_, data) { // The read function for the isInCart field

                        const cartNow = localStorage.getItem('games_cart');
                        console.log("=== cartNow from games_cart",cartNow)

                        const id=data.readField("id")
                        console.log("=== read data id",id)

                        if(cartNow)
                            {}
                        else
                            return false
                        // return localStorage.getItem('games_cart').includes(
                        //     id
                        // );
                    }
                }
            }
        }
    }
})
