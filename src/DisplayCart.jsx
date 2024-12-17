
import {useReactiveVar} from "@apollo/client";
import {setCartData} from "./apollo/cache";
import {useEffect} from "react";

const DisplayCart = () => {

    const cartData = useReactiveVar(setCartData);

    useEffect(() => {

        // if(cartData.length>0) {
            console.log("=== localStorage games_cart ", cartData)
            localStorage.setItem('games_cart', JSON.stringify(cartData));
        // }
        return () => {

        };
    }, [cartData]);


    return cartData ? (
        <div>
            <h3 style={{color:'blue'}} >{`cartData ${JSON.stringify(cartData)}!`}</h3>
            <p style={{color:'blue'}} >This component is displaying cartData!</p>
        </div>
    ) : null;
}

export default DisplayCart;

