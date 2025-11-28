'use client'
import { useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import SearchModel from './SearchModel'
import { Button } from '@/components/ui/button'

const AdminMobileSearch = () => {
    const [open, setOpen] = useState(false);
  return (
    <div>
        <Button type='button' variant='ghost' size='icon' className='cursor-pointer md:hidden' onClick={() => setOpen(true)}>
            <IoIosSearch/>
        </Button>
        <SearchModel open={open} setOpen={setOpen}/>
    </div>
  )
}

export default AdminMobileSearch