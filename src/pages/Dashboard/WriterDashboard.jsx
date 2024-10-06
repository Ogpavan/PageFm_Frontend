import React from 'react'
import { Link } from 'react-router-dom'

function WriterDashboard() {
  return (
    <div>WriterDashboard
      <Link to="/admin">Add books</Link>
    </div>
  )
}

export default WriterDashboard