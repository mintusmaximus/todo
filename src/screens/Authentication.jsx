import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../context/useUser'; // using 'user' context



/**
 * AuthenticationMode is a enumeration type, determining if signin or signup should be displayed.
 */
export const AuthenticationMode = Object.freeze( //Object.freeze makes this immutable, and now is a constant
    {
        SignIn: 'Login',
        SignUp: 'SignUp'
    }
)



// prop is either signin or signup, passed by router when going to either endpoint
/**
 * Authentication component gets used for both signIn and signUp, taking in AuthenticationMode as a prop
 */
export default function Authentication({authenticationMode}) { // this gets called from main.jsx:       path: "/signin", element: <Authentication authenticationMode={AuthenticationMode.SignIn} />
    const { user, setUser, signUp, signIn } = useUser() // taking values from context, these are exported from userProvider:
    /*
    * Sets {user, setUser, signUp, signIn} to context
    * user is react usestate for {email: ", password: "}
    * setUser is the usestate setter, that checks if user already exists in sessionstorage, default is {email: ", password: "}
    * signUp posts the /user/signup endpoint
    * signIn posts the /user/signin endpoint 
    */

    const navigate = useNavigate() // creating a navigator, which navigates around based on user interaction/actions

    // when HTML form submits
    const handleSubmit = async (e) => {
        // prevent form from doing anything
        e.preventDefault()

        //shorthand if for if we are signing up or signing in, dependent on prop state
        const signFunction = authenticationMode === AuthenticationMode.SignUp ? signUp : signIn
        
        // if authmode is on signup, after that go to signin, else go straight to /
        signFunction().then(respone => {
            navigate(authenticationMode === Authentication.SignUp ? '/signin' : '/')
        })

        // alert of possible errors
        .catch(error => {
            alert(error)
        })
    }


  return (
    <div>
        <h3>
            {authenticationMode === AuthenticationMode.SignIn ? 'Sign In' : 'Sign Up'} {/*Shorthand if statement for writing either signin or signup on h3 element dependent on which mode auth is being used in */}
        </h3>

        <form onSubmit={handleSubmit}>
            <label>Email</label>
                <input 
                    placeholder='Email'
                    type='email' // ensure valid email entries
                    value={user.email} // set the value of the field form usestate
                    onChange={e => setUser({...user, email: e.target.value})} // set user email email to usestate on each change 
                />

            <label>Password</label>
                <input 
                    placeholder='Password'
                    type='password' // this censors the input
                    value={user.password} // update value every single time from usestate
                    onChange={e => setUser({...user, password: e.target.value})} // set the usestate on each input
                />

                <button type="submit">{authenticationMode === AuthenticationMode.SignIn ? 'Login' : 'Submit'}</button> {/*shorthand if for showing either submit or login on the button text.*/}
                
                {/* Link is a <a href=> element wrapper, as the name says, its a link */}
                <Link to={authenticationMode === AuthenticationMode.SignIn ? '/signup' : '/signin'}> {/* create a link to either endpoint, dependent on enum matching the current prop*/}
                    {authenticationMode === AuthenticationMode.SignIn ? "No account? Sign up" : "Already signed up? Sign in"} {/* change link text accordingly*/}
                </Link>
        </form>
    </div>
  )
}

