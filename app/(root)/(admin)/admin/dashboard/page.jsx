import React from 'react'
import CountOverView from './CountOverView'
import QuickAdd from './QuickAdd'

const AdminDashBoard = () => {
  return (
    <div className='p-2'>
      <CountOverView />
      <QuickAdd />
    </div>
  )
}

export default AdminDashBoard

