import React, { createContext, useEffect, useState } from "react";
import MainRouter from "./MainRouter";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { read } from "./user/api-user";
import auth from "./auth/auth-helper";

export const CurrentUserContext = createContext(null);

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    (async () => {
      const jwt = auth.isAuthenticated();

      if (jwt) {
        let user = await read({ userId: jwt.user._id }, { t: jwt.token }, null);
        setCurrentUser(user);
      }
    })();
  }, []);
  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser }}>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </CurrentUserContext.Provider>
  );
};

export default App;
