import React, { useState, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import PersonalDetail from '../components/Profile/Personal'
import Address from '../components/Profile/Address'
import ProfileMenuTab from '../components/Profile/ProfileMenuTab'
import axios from 'axios';
import Cookies from 'js-cookie';
import Vehicle from '../components/Profile/Vehicle'
import Payment from '../components/Profile/Payment'
import Router from 'next/router'

const backend_url = "http://localhost:8000"
const token = Cookies.get("token")
const type = Cookies.get("type")

const Profile = ({user, setUser}) => {
  const [activeItem, setActiveItem] = useState("personalDetail")
  const handleItemClick = (item) => setActiveItem(item)

  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <ProfileMenuTab
              activeItem={activeItem}
              handleItemClick={handleItemClick}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {activeItem === "personalDetail" && (
              <PersonalDetail user={user} setUser={setUser} />
            )}

            {type === "consignees" && activeItem === "address" && (
                <Address user={user} setUser={setUser} />
            )}

            {type === "drivers" && activeItem === "vehicleDetail" && (
              <Vehicle user={user} setUser={setUser} />
            )}

            {type === "consignees" && activeItem === "payment" && (
              <Payment user={user} setUser={setUser} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}

export default Profile