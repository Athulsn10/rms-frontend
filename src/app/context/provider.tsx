import React, { useState, PropsWithChildren  } from 'react';
import MyContext from './context';

const MyProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [showQr, setshowQr] = useState(false);

  return (
    <MyContext.Provider value={{ showQr, setshowQr }}>
      {children}
    </MyContext.Provider>
  );
};

export default MyProvider;
