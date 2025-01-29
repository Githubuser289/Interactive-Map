import React, { useState } from "react";
import Login from "./Components/Login";
import MainScreen from "./Components/MainScreen";

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const checkLoginData = (username, password) => {
    // *********************
    // to be developed later
    // *********************
    if (username === "a" && password === "a") {
      return true;
    }
    return false;
  };

  return (
    <div>
      {!isLoggedIn ? (
        <Login
          onLogin={(username, password) => {
            if (checkLoginData(username, password)) {
              setIsLoggedIn(true);
            } else {
              alert("Username sau parola incorectă!");
            }
          }}
        />
      ) : (
        <MainScreen />
      )}
    </div>
  );
}

export default App;
