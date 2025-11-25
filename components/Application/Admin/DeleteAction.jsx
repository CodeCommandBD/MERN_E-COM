import { ListItemIcon, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

const DeleteAction = ({ handleDelete, row, deleteType, label = "Delete" }) => {
  return (
    <MenuItem
      key="delete"
      onClick={() => handleDelete([row.original._id], deleteType)}
    >
      <ListItemIcon>
        <DeleteIcon></DeleteIcon>
      </ListItemIcon>
      {label}
    </MenuItem>
  );
};

export default DeleteAction;
