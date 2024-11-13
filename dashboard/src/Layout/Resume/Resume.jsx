import React from 'react'
import { useParams } from 'react-router-dom'

function Resume() {
    const params = useParams()
    console.log(params)
  return (
    <div>
    {
        params.id
    }
    </div>
  )
}

export default Resume
