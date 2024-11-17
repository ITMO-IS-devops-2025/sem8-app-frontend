import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {User} from "./model/user/User";
import {ChakraProvider, Spinner} from "@chakra-ui/react";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {MainPage} from "./pages/MainPage";
import {SignInPage} from "./pages/SignInPage";
import {SignUpPage} from "./pages/SignUpPage";
import {SignOutPage} from "./pages/SignOutPage";
import {GroupPage} from "./pages/GroupPage";
import {GroupListPage} from "./pages/GroupListPage";
import {GroupCreationPage} from "./pages/GroupCreationPage";
import {HabitPage} from "./pages/HabitPage";
import {HabitCreationPage} from "./pages/HabitCreationPage";

function App() {
  // let [loading, setLoading] = useState(true)
  let [currentUser, setCurrentUser] = useState<User>()
  // работа с токенами
  // useEffect(() => receiveAndUpdateCurrentUser(
  //     (user) => setCurrentUser(user),
  //     () => setLoading(false)
  // ), []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root currentUser={currentUser}/>,
      children: [
        {
          index: true,
          element: <MainPage currentUser={currentUser}/>
        },
        {
          path: "/signIn",
          element: <SignInPage currentUser={currentUser} setCurrentUser={setCurrentUser}/>,
        },
        {
          path: "/signUp",
          element: <SignUpPage currentUser={currentUser} setCurrentUser={setCurrentUser}/>,
        },
        {
          path: "/signOut",
          element: <SignOutPage currentUser={currentUser} setCurrentUser={setCurrentUser}/>,
        },
        {
          path: "/group/:groupId",
          element: <GroupPage currentUser={currentUser} />,
        },
        {
          path: "/groups",
          element: <GroupListPage currentUser={currentUser} />,
        },
        {
          path: "/group-creation",
          element: <GroupCreationPage currentUser={currentUser} />,
        },
        {
          path: "/habit/:habitId",
          element: <HabitPage currentUser={currentUser} />,
        },
        {
          path: "/habit-creation",
          element: <HabitCreationPage currentUser={currentUser} />,
        },
      ]
    },
  ]);

  // if (loading) return <div>Loading...
  //   <Spinner color='pink' /></div>
  return <RouterProvider router={router}/>
}

function Root(props: { currentUser: User | undefined }) {
  return <div>
    <ChakraProvider>
      {Header({currentUser: props.currentUser})}
      <main>
        <Outlet/>
      </main>
      {Footer()}
    </ChakraProvider>

  </div>
}

export default App;
