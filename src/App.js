import { useDispatch } from "react-redux";
import { logInUser, updateAuthUser, updateUserFromDb } from "./redux";

import "./App.css";

import { BrowserRouter, Switch, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { createMuiTheme, ThemeProvider } from "@material-ui/core";

import useAuthListener from "./hooks/useAuthListener";
import UserContext from "./context/userContext";
import { useState, useEffect } from "react";
import { getUserById } from "./firebase/firebaseServices";



const SignUp = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DoubleAuthAttempt = lazy(() => import("./pages/DoubleAuthAttempt"));
const Profile = lazy(() => import("./pages/Profile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

const theme = createMuiTheme({
  palette: {},
});

function App() {
  //console.log("db", db);
  //console.log("auth", auth);
  //console.log("storage", storage);
  const dispatch = useDispatch();

  const { user } = useAuthListener();

  const [userFromDb, setUserFromDb] = useState(null);
  useEffect(() => {
    const loadLoggedInUser = async () => {
      if (user?.uid) {
        const userReturned = await getUserById(user.uid);
        setUserFromDb(userReturned);
        dispatch(updateAuthUser(user));
        dispatch(updateUserFromDb(userReturned));
      }
    };

    loadLoggedInUser();
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user }}>
        <BrowserRouter>
          <Suspense fallback={<p>Loading...</p>}>
            <Switch>
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route
                path="/"
                component={() => <Dashboard userFromDb={userFromDb} />}
                exact
              />
              <Route path="/double-auth-error" component={DoubleAuthAttempt} />
              <Route path="/profile" component={() => <Profile />} />
              <Route path="/user/:username" component={() => <UserProfile />} />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
