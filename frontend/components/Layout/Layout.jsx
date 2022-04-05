import React, { createRef } from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import {
  Grid, Sticky, Ref, Visibility, Container
} from "semantic-ui-react";
import Router from "next/router";
import nprogress from "nprogress";
import SideMenu from "./SideMenu";

import styles from "./Layout.module.css"

const Layout = ({ children, user }) => {
  const contextRef = createRef();

  Router.events.on("routeChangeStart", () => {
    nprogress.start();
  });

  Router.events.on("routeChangeComplete", () => {
    nprogress.done();
  });

  Router.events.on("routeChangeError", () => {
    nprogress.done();
  });

  return (
    <>
      <HeadTags />
      <Navbar />
      {user ? (
        <div className={styles.sideMenu}>
          <Ref innerRef={contextRef}>
            <Grid>
              <Grid.Column width={2}>
                <Sticky context={contextRef}>
                  <SideMenu />
                </Sticky>
              </Grid.Column>

              <Grid.Column width={14}>
                <Visibility context={contextRef}>
                  {children}
                </Visibility>
              </Grid.Column>
            </Grid>
          </Ref>
        </div>
      ) : (
        <Container style={{ paddingTop: "1rem" }} text>
          {children}
        </Container>
      )}
    </>
  );
};

export default Layout;
