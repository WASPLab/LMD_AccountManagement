import { parseCookies, destroyCookie } from "nookies";

import Layout from '../components/Layout/Layout'
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { useState } from "react";

const backend_url = "http://localhost:8000"

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(pageProps.user)
  pageProps.user = user
  pageProps.setUser = setUser
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { token, type } = parseCookies(ctx);

  const redirectUser = (ctx, location) => {
    if (ctx.req) {
      ctx.res.writeHead(302, { Location: location });
      ctx.res.end();
    } else {
      Router.push(location);
    }
  }
  let pageProps = {};

  const protectedRoutes =
    ctx.pathname === "/driverHomePage" ||
    ctx.pathname === "/shipperHomePage" ||
    ctx.pathname === "/consigneeHomePage" ||
    ctx.pathname === "/driversParcels" ||
    ctx.pathname === "/shippersParcels" ||
    ctx.pathname === "/consigneesParcels" ||
    ctx.pathname === "/profile"

  if (token) {
    if(type === "drivers") {
      const driverProtectedRoutes = 
        ctx.pathname === "/shipperHomePage" ||
        ctx.pathname === "/consigneeHomePage" ||
        ctx.pathname === "/shippersParcels" ||
        ctx.pathname === "/consigneesParcels"  
      driverProtectedRoutes && redirectUser("/driverHomePage")
    } else if(type === "shippers") {
      const driverProtectedRoutes = 
        ctx.pathname === "/driverHomePage" ||
        ctx.pathname === "/consigneeHomePage" ||
        ctx.pathname === "/driversParcels" ||
        ctx.pathname === "/consigneesParcels"  
      driverProtectedRoutes && redirectUser("/shipperHomePage")
    } else if(type === "consignees") {
      const driverProtectedRoutes = 
        ctx.pathname === "/driverHomePage" ||
        ctx.pathname === "/shipperHomePage" ||
        ctx.pathname === "/driversParcels" ||
        ctx.pathname === "/shippersParcels"
      driverProtectedRoutes && redirectUser("/consigneeHomePage")
    }
  }
  

  if (!token || !type || type === undefined) {
    destroyCookie(ctx, "token");
    destroyCookie(ctx, "type")
    protectedRoutes && redirectUser(ctx, '/')
  } else {
    try {
      const res = await axios.get(`${backend_url}/task/getUser`, {
        params: { type },
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if(res.data) !protectedRoutes && redirectUser(ctx, type === "drivers" ? "/driverHomePage" : type === "shippers" ? "/shipperHomePage" : "/consigneeHomePage");
      pageProps.user = res.data
    } catch (error) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/");
    }
  }
  return { pageProps }
}

export default MyApp
