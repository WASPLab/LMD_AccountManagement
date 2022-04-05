import { useEffect, useState } from "react";
import { List, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import styles from "./SideMenu.module.css";

const SideMenu = ({
}) => {
  const router = useRouter();
  const [linkToHome, setLinkToHome] = useState('')
  const isActive = (route) => router.pathname === route;
  const type = Cookies.get("type")

  const signout = () => {
    Cookies.remove("token");
    Cookies.remove("type");
    router.reload('/')
  }

  useEffect(() => {

    if (type === "drivers") {
      setLinkToHome("/driverHomePage")
    } else if (type === "shippers") {
      setLinkToHome("/shipperHomePage")
    } else {
      setLinkToHome("/consigneeHomePage")
    }
  }, [])

  return (
    <>
      <List
        className={styles.container}
        size="big"
        verticalAlign="middle"
        selection
      >
        <List.Item
          active={
            (isActive('/driverHomePage' || '/shipperHomePage' || '/consigneeHomePage'))
          }
          as="a"
          href={linkToHome}>
          <Icon
            name="home"
            size="large"
            color={(isActive('/driverHomePage' || '/shipperHomePage' || '/consigneeHomePage')) && "teal"}
          />
          <List.Content>
            <List.Header content="Home" />
          </List.Content>
        </List.Item>
        <br />
        <List.Item
          active={isActive("/profile")}
          as="a"
          href="/profile"
        >
          <Icon
            name="user"
            size="large"
            color={
              (isActive("/profile") && "teal")
            }
          />
          <List.Content>
            <List.Header content="Profile" />
          </List.Content>
        </List.Item>
        <br />
        <List.Item
          active={ isActive('/parcels') }
          as="a"
          href='/parcels'
        >
          <Icon
            name="cart"
            size="large"
            color={(isActive('/parcels')) && "teal"}
          />
          <List.Content>
            <List.Header content="Parcels" />
          </List.Content>
        </List.Item>
        <br />

        <List.Item onClick={signout} as="a">
          <Icon name="log out" size="large" />
          <List.Content>
            <List.Header content="Logout" />
          </List.Content>
        </List.Item>
      </List>
    </>
  );
};

export default SideMenu;
