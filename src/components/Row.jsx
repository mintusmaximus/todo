export default function Row({item,deleteTask}) {
    return (
        <li>
           {item.description} { /*item prop is {item:{id:, description:}}, take the description of each item into li text*/ }
           {/* create a button that calls deletetask with id of the specific task */}
            <button className='delete-button' onClick={() => 
                deleteTask(item.id)}>Delete</button> 
        </li>
    )
}
