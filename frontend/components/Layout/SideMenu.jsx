import { List, Icon } from "semantic-ui-react";
import Router, { useRouter } from "next/router";
import Cookies from "js-cookie";
import styles from "./SideMenu.module.css";

const SideMenu = ({
}) => {
    const router = useRouter();

    const isActive = (route) => router.pathname === route;
    const type = Cookies.get("type")

    const signout = () => {
        Cookies.remove("token");
        Cookies.remove("type");
        Router.reload(`/`)
    }

    return (
        <>
            <List
                className={styles.container}
                size="big"
                verticalAlign="middle"
                selection
            >
                <List.Item active={
                    type === "drivers" ? isActive('/driverHomePage') :
                    type === "shippers" ? isActive('/shipperHomePage') :
                    isActive('/consigneeHomePage')
                } as="a" href={
                    type === "drivers" ? '/driverHomePage' :
                        type === "shippers" ? '/shipperHomePage' :
                            '/consigneeHomePage'
                }>
                    <Icon
                        name="home"
                        size="large"
                        color={(isActive('/driverHomePage') || isActive('/shipperHomePage') || isActive('/consigneeHomePage') ) && "teal"}
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
