import React from "react";
import Link from "next/link";
import { Menu, Container, Icon, MenuItem } from "semantic-ui-react";
import { useRouter } from "next/router";
import Router from "next/router";
import Cookies from 'js-cookie';

const Navbar = () => {
  const router = useRouter();
  const token = Cookies.get('token')
  const type = Cookies.get("type")
  const isActive = (route) => router.pathname === route

  return (
    <Menu fluid borderless>
      <Container text>
          <MenuItem header position="left">
            <Icon size="large" />
            EXPRESS
          </MenuItem>
      </Container>
    </Menu>
  );
};

export default Navbar;
