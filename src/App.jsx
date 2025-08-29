import { useState } from 'react'
import './App.css'

function App() {
  // a single task is a string, default empty
  const [taskField, setTaskField] = useState('')
  // tasks is array of strings, default empty
  const [tasksList, setTasksList] = useState([])
  
  // gets called on enter press on 'Add new task' input field
  const addTask = () => {
    // immutable spread operator, add taskField to taskList (useState variable), creating a new array
    setTasksList([...tasksList,taskField]) 
    setTaskField('') // reset input field
  }

  const deleteTask = (deleted) => {
    // create new array of elements that dont have removed elements
    // use filter to remove item via function parameter
    const withoutRemoved = tasksList.filter(item => item!==deleted) // if item currently being iterated isnt the same as parameter, add to new list
    setTasksList(withoutRemoved) // set new list as tasksList once deleted item has been removed.
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
          {/* create inline js function */}
          {
            // iterate through array items with map
            // (parameter) => (return value)
            tasksList.map(item => (
              // create new list item every time
              <li>
                {/* add item inside list */}
                {item}
                {/* also add a button beside each task */}
                <button
                // give button classname
                  className='delete-button'
                  // when clicking this button, call delete with task inside <li>
                  onClick={()=>deleteTask(item)}>
                  Delete task
                </button>
              </li>
            ))
          }
        </ul>
      </div>
  )
}

export default App
