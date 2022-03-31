import React from 'react';

const BaseContext = React.createContext({});

export function BaseContextProvider(props) {

  // Debug
  // console.log("BaseContextProvider: Initalizing")

  return (
    <BaseContext.Provider value={{}}>
      {props.children}
    </BaseContext.Provider>
  );
}

export const useBaseContext = () => React.useContext(BaseContext);