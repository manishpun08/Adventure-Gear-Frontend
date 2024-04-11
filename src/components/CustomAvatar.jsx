import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import * as React from "react";
import { getFullName } from "../utils/general.function";
import { useNavigate } from "react-router-dom";
import LogoutConfirmationDialog from "./LogoutConfirmationDialog";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const settings = [
  {
    name: "Profile",
  },
];

const CustomAvatar = () => {
  const userId = localStorage.getItem("userId");
  const firstName = localStorage.getItem("firstName");
  const lastName = localStorage.getItem("lastName");
  const image = localStorage.getItem("image");

  // const avatarName = localStorage.getItem("avatarName");

  // const renderAvatar = () => {
  //   const image = localStorage.getItem("image");
  //   if (image) {
  //     return <Avatar src={image} />;
  //   }
  // };

  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const fullName = getFullName();
  return (
    <Box sx={{ flexGrow: 0 }}>
      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
        <Box>
          {image === "image" ? (
            <Avatar {...stringAvatar(`${firstName} ${lastName}`)} />
          ) : (
            <Avatar src={image} />
          )}
        </Box>
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            sx={{ display: "flex", flexDirection: "column" }}
            key={setting}
            onClick={handleCloseUserMenu}
          >
            <Button
              key={setting.id}
              sx={{ color: "#000" }}
              onClick={() => {
                navigate(`userProfile/get/${userId}`);
              }}
            >
              {setting.name}
            </Button>
            <LogoutConfirmationDialog />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CustomAvatar;
