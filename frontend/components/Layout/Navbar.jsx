import React from "react";
import { Menu, Container, Icon, MenuItem } from "semantic-ui-react";

const Navbar = () => {
  return (
    <Menu fluid borderless>
          <MenuItem header position="left">
            <Icon name="fast shipping" size="big" />
            <span style={{fontSize: "18px"}}>Package Delivery</span>
          </MenuItem>
    </Menu>
  );
};

export default Navbar;
