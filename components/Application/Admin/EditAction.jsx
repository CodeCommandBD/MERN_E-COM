import { ListItemIcon, MenuItem } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link'
import React from 'react'

const EditAction = ({href}) => {
  return (
    <MenuItem key='edit'>
        <Link href={href}>
            <ListItemIcon>
                <EditIcon></EditIcon>
            </ListItemIcon>
            Edit
        </Link>
    </MenuItem>
  )
}

export default EditAction
