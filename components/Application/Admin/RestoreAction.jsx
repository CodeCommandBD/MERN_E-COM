import { ListItemIcon, MenuItem } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import React from "react";

const RestoreAction = ({ handleDelete, row }) => {
  return (
    <MenuItem
      key="restore"
      onClick={() => handleDelete([row.original._id], "RSD")}
    >
      <ListItemIcon>
        <RestoreIcon></RestoreIcon>
      </ListItemIcon>
      Restore
    </MenuItem>
  );
};

export default RestoreAction;
