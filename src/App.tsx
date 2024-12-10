import React, {useEffect, useState} from 'react';
import './styles/App.css';
import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import {User} from "./model/user/User";
import {ChakraProvider, Spinner} from "@chakra-ui/react";
import {Header} from "./components/Header";
import {Footer} from "./components/Footer";
import {MainPage} from "./pages/user/MainPage";
import {SignInPage} from "./pages/auth/SignInPage";
import {SignUpPage} from "./pages/auth/SignUpPage";
import {SignOutPage} from "./pages/auth/SignOutPage";
import {GroupPage} from "./pages/group/GroupPage";
import {GroupListPage} from "./pages/group/GroupListPage";
import {GroupCreationPage} from "./pages/group/GroupCreationPage";
import {UserHabitPage} from "./pages/user/UserHabitPage";
import {GroupPersonalHabitPage} from "./pages/group/group-habits/GroupPersonalHabitPage";
import {UserHabitCreationPage} from "./pages/user/UserHabitCreationPage";
import {GroupHabitCreationPage} from "./pages/group/group-habits/GroupHabitCreationPage";
import {GroupCommonHabitPage} from "./pages/group/group-habits/GroupCommonHabitPage";


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
          path: "/user-habit/:habitId",
          element: <UserHabitPage currentUser={currentUser} />,
        },
        {
          path: "/group/:groupId/group-common-habit/:habitId",
          element: <GroupCommonHabitPage currentUser={currentUser} />,
        },
        {
          path: "/group/:groupId/group-personal-habit/:habitId",
          element: <GroupPersonalHabitPage currentUser={currentUser} />,
        },
        {
          path: "/user-habit-creation",
          element: <UserHabitCreationPage currentUser={currentUser} />,
        },
        {
          path: "/group/:groupId/group-habit-creation",
          element: <GroupHabitCreationPage currentUser={currentUser} />,
        }
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
