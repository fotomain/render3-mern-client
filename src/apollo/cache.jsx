import { makeVar, InMemoryCache } from "@apollo/client";

// const cartDataInit = localStorage.getItem('games_cart');
const cartDataInit = JSON.stringify([])

export const setCartData = makeVar(JSON.parse(cartDataInit));

// st1-cartItems
export const cartItemsVar = makeVar([]);
export const cacheGames = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                cartItems: {
                    read() {
                        return cartItemsVar(); // st2-cartItems
                    }
                }
            }
        },
        Game: {
            fields: { // Field policy map for the Product type
                isInCart: { // Field policy for the isInCart field

                    read(_, data) { // The read function for the isInCart field

                        const cartNow = localStorage.getItem('games_cart');
                        console.log("=== cartNow from games_cart",cartNow)

                        const id=data.readField("id")
                        const indexInCart = cartNow.indexOf(id)
                        console.log("=== read data id",id)

                        if(-1===indexInCart)
                            return false
                        else
                            return true
                        // return localStorage.getItem('games_cart').includes(
                        //     id
                        // );
                    }
                }
            }
        }
    }
})
