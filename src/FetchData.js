import React, { useEffect, useState } from 'react'

function FetchData() {
    const [records, setRecords] = useState([])

    useEffect(() => {
        fetch("http://localhost:5224/api/players")
        .then(response => response.json())
        .then(data => setRecords(data))
        .catch(err => console.log(err))
    }, [])
  return (
    <div>
        
        <ul>
            {
                records.map((list, index)=> (
                    <li key={index}>{list.Id} | {list.Name}</li>
                ))

            }dsdd
        </ul>
    </div>
  )
}

export default FetchData