import React from 'react'
import { BsCart2 } from 'react-icons/bs'

const Cart = () => {
    return (
        <div>
            <button type='button' className='cursor-pointer hover:text-primary transition-colors'>
                <BsCart2 size={24} className=''/>
            </button>
        </div>
    )
}

export default Cart