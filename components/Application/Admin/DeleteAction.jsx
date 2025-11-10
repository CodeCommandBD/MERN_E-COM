import { ListItemIcon, MenuItem } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react'

const DeleteAction = ({ handleDelete, row, deleteType  }) => {
  return (
    <MenuItem key='delete' onClick={()=> handleDelete([row.original._id], deleteType)}>
      <ListItemIcon>
        <DeleteIcon></DeleteIcon>
      </ListItemIcon>
      Delete

    </MenuItem>
  )
}

export default DeleteAction
