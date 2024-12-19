import React, {useDeferredValue, useEffect, useState} from "react";

const InputField = (props) => {

    const [query, setQuery] = useState({moment:0,value:props.value});
    const deferredQuery = useDeferredValue(query);

    console.log("=== deferredQuery",deferredQuery)

    useEffect(() => {

        console.log("=== deferredQuery",deferredQuery)

        if((deferredQuery.moment!==0) && props.id) {
            props.onChangeValue({...props, newValue: deferredQuery.value})
        }

        return () => {

        };
    }, [deferredQuery]);

  return (
      <input type="text" value={query.value} onChange={(e)=> {

          console.log('== UPDATE 1 GAME onChange= ', e.target.value)
          console.log("=== value",e.target.value)
          setQuery({
              moment:Date.now(),value:e.target.value
          })

      }}
      />

  )
}

export default InputField


// <input type="text" value={el.title} onChange={(e)=> {
//
//     console.log('== UPDATE 1 GAME onChange= ', e.target.value)
//
//     updateGameAdapter({
//         variables: {
//             updateId: el.id,
//             newData:{
//                 title:e.target.value,
//                 platform:["Android"]
//             }
//         }
//     })
//
// }}
// />
