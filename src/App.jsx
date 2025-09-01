import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import Row from './components/Row'

const url = "http://localhost:3001"

function App() {
  // a single task is a string, default empty
  const [taskField, setTaskField] = useState('')
  // tasks is array of strings, default empty
  const [tasksList, setTasksList] = useState([])
  
  // useEffect is a React Hook that lets you synchronize a component with an external system.
  // https://react.dev/learn/synchronizing-with-effects
  // https://react.dev/reference/react/useEffect
  useEffect(() => {
    // send a get request to /, which returns a json object of tasks and ids
    axios.get(url)
      // callback function for response from get
      .then(response => {
        // response is a json array of:
        //[
        // {
        //     "id": 1,
        //     "description": "Complete the project documentation"
        // },
        // set json response data to tasklist array
        // console.log(response.data) shows:
        // Array(14) [ {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, … ]
        //0: Object { id: 1, description: "Complete the project documentation" }
        setTasksList(response.data)
      })
      .catch(error => { // catch potential errors
        alert(error.response.data ? error.response.message : error) // throw error response message if it exists, else throw empty error
      })
  })

  // gets called on enter press on 'Add new task' input field
  const addTask = () => {
    // create json format for a new task item
    const newTask = { description: taskField }
    axios.post(url+"/create", {task: newTask})
      .then(response => {
        setTasksList([...tasksList,response.data])
        setTaskField("")
      })
      // if caught error, send response error data if exists, else error
      .catch(error => {
        alert(error.response ? error.response.data : error)
      })

    /*
    // immutable spread operator, add taskField to taskList (useState variable), creating a new array
    setTasksList([...tasksList,taskField]) 
    setTaskField('') // reset input field
    */
    }

  const deleteTask = (deleted) => {
    axios.delete(url + "/delete/" + deleted)
      .then(response => {
        setTasksList(tasksList.filter(item => item.id !== deleted))
      })
      .catch(error => {
        alert(error.response ? error.response.data : error)
      })

    // create new array of elements that dont have removed elements
    // use filter to remove item via function parameter
    /*
    const withoutRemoved = tasksList.filter(item => item!==deleted) // if item currently being iterated isnt the same as parameter, add to new list
    setTasksList(withoutRemoved) // set new list as tasksList once deleted item has been removed.
    */
  }

  return (
      <div id="container">
        <h3>Todos</h3>
        <form>
          <input 
            placeholder='Add new task'
            value={taskField} // input field gets its value constantly from usestate
            onChange={e => setTaskField(e.target.value)} // when change to input field happens, get value and set to task field state variable
            onKeyDown={e => { // when any key is pressed
              if (e.key === 'Enter') { // check if its enter
                e.preventDefault() // dont refresh
                addTask() // add to taskList
              }
            }}
          />
        </form>

        {/* create unordered list */}
        <ul>
          {
            tasksList.map(item => (
              // create new row react components on each item in tasklist
              <Row item={item} key={item.id} deleteTask={deleteTask} />
            ))
          }
        </ul>
      </div>
  )
}

export default App
