
            return res.status(500).json({error: err.message})
        }
        if (result.rowCount === 0) { // sql query result on wrong id is "DELETE 0 \n\n Query returned successfully in 27 msec.", successful is same but DELETE 1,
                                     // result.rowcount is the number of rows affected by query so if deletion doesnt go through the error makes sense
            return res.status(404).json({error: 'task not found'}) // returns error to request sender
        }
    return res.status(200).json({id:id}) // successful delete request, this returns {"id": "9"} for example 
    })
})