import React from 'react'
import AdminGroupForm from './Components/Admin'
import { Route, Routes } from 'react-router-dom';
import User from './Components/User'
function App() {
  return (
    <div>
    <Routes>
         <Route path='/' element={  <AdminGroupForm />} />
         <Route path='/user' element={<User/>} />
       </Routes> 
    </div>
  )
}

export default App