import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './screens/App.jsx'
import Authentication,  { AuthenticationMode } from './screens/Authentication.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProvider from './context/UserProvider.jsx'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter } from 'react-router-dom'
import NotFound from './screens/NotFound.jsx'

// react router method for updating the url and creating a browser history https://reactrouter.com/api/data-routers/createBrowserRouter
// browserRouter manages the app path via history.push/replaceState, takes in array of routes as param
const router = createBrowserRouter (
  [
    {
      errorElement: <NotFound /> // render every non existing endpoint to this page
    },
    {
      path: "/signin", // signin path renders the auth module with signin prop
      element: <Authentication authenticationMode={AuthenticationMode.SignIn} />
    },
    {
      path: "/signup", // same but signup prop
      element: <Authentication authenticationMode={AuthenticationMode.SignUp} />
    },
    {
      //protectedroute is the parent route, everything inside is the child route
      //parentroute gets rendered FIRST, so going to '/' actually goes to protectedroute
      //which checks if user exists, if not, it goes to '/signin', so it protects user from seeing stuff without login
      element: <ProtectedRoute />, // ProtectedRoute has if-statement for valid user context, else it returns to signin, passing user context check calls <Outlet />
      children: [
        {
          path: "/", // this is the child route of parent route: ProtectedRoute
          element: <App />, // this is the component that gets rendered for child route
        }
      ]
    }
  ]
)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> {/*user defined react object, TODO LEARN WHAT THIS DOES LATER*/}
      {/* the router object gets passed to a routerprovider, which mounts the path-component object into the react tree */}
      {/* this gives the app navigation and history */}
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
