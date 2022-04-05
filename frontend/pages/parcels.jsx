import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { Grid } from 'semantic-ui-react'
import AcceptedParcels from '../components/Parcels/Components/AcceptedParcels'
import DeliveredParcels from '../components/Parcels/Components/DeliveredParcels'
import InTransitParcels from '../components/Parcels/Components/InTransitParcels'
import PendingParcels from '../components/Parcels/Components/PendingParcels'
import DriverParcels from '../components/Parcels/Parcels'

const backend_url = "http://localhost:8000"

const driversParcels = () => {
  const token = Cookies.get("token")
  const type = Cookies.get("type")

  const [activeItem, setActiveItem] = useState("pendingParcels")
  const [pendingParcels, setPendingParcels] = useState([])
  const [approvedParcels, setApprovedParcels] = useState([])
  const [inTransitParcels, setInTransitParcels] = useState([])
  const [deliveredParcels, setDeliveredParcels] = useState([])


  const handleItemClick = (item) => setActiveItem(item)
    
  useEffect(async () => {
    const data = await axios.get(`${backend_url}/task/available_parcels`, {
      params: {type, status: "pending"},
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setPendingParcels(data?.data)
    const approvedData = await axios.get(`${backend_url}/task/available_parcels`, {
      params: {type, status: "assigned"},
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setApprovedParcels(approvedData?.data.splice(0,3))
    const inTransitData = await axios.get(`${backend_url}/task/available_parcels`, {
      params: {type, status: "in-transit"},
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setInTransitParcels(inTransitData?.data.splice(0,3))
    const deliveredData = await axios.get(`${backend_url}/task/available_parcels`, {
      params: {type, status: "delivered"},
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setDeliveredParcels(deliveredData?.data.splice(0,3))
  }, [])

  return (
    <>
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <DriverParcels
              activeItem={activeItem}
              handleItemClick={handleItemClick}
            />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column>
            {activeItem === "pendingParcels" && (
              <PendingParcels pendingParcels={pendingParcels} setPendingParcels={setPendingParcels} setNewParcels={setApprovedParcels} />
            )}

            {activeItem === "approvedParcels" && (
                <AcceptedParcels approvedParcels={approvedParcels} setApprovedParcels={setApprovedParcels} setNewParcels={setInTransitParcels} />
            )}

            {activeItem === "inTransitParcels" && (
              <InTransitParcels inTransitParcels={inTransitParcels} setInTransitParcels={setInTransitParcels} setNewParcels={setDeliveredParcels} />
            )}

            {activeItem === "deliveredParcels" && (
              <DeliveredParcels deliveredParcels={deliveredParcels} setDeliveredParcels={setDeliveredParcels} />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  )
}

export default driversParcels