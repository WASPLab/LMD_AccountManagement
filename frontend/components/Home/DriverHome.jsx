import { useEffect, useState } from "react"
import axios from "axios"
import { Divider, Header } from "semantic-ui-react"
import ParcelTable from "./Components/ParcelTable"
import Cookies from "js-cookie"
import SuccessMsg from "../Modal/SuccessMsg"

const backend_url = "http://localhost:8000"

const DriverHome = ({ user }) => {
  const token = Cookies.get("token")
  const type = Cookies.get("type")

  const [pendingParcels, setPendingParcels] = useState([])
  const [approvedParcels, setApprovedParcels] = useState([])
  const [inTransitParcels, setInTransitParcels] = useState([])
  const [deliveredParcels, setDeliveredParcels] = useState([])
  const [openSuccess, setOpenSuccess] = useState(false)

  useEffect(async () => {
    const data = await axios.get(`${backend_url}/task/available_parcels`, {
      params: { type, status: "pending" },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setPendingParcels(data?.data.splice(0, 3))
    const approvedData = await axios.get(`${backend_url}/task/available_parcels`, {
      params: { type, status: "assigned" },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setApprovedParcels(approvedData?.data.splice(0, 3))
    const inTransitData = await axios.get(`${backend_url}/task/available_parcels`, {
      params: { type, status: "in-transit" },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setInTransitParcels(inTransitData?.data.splice(0, 3))
    const deliveredData = await axios.get(`${backend_url}/task/available_parcels`, {
      params: { type, status: "delivered" },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setDeliveredParcels(deliveredData?.data.splice(0, 3))
  }, [])

  return (
    <>
      <div>Welcome, {`${user.first_name} ${user.last_name}`} </div>
      <Divider />
      {openSuccess && <SuccessMsg showModal={openSuccess} setShowModal={setOpenSuccess} message={"This shipment is no longer part of your delivery cycle."}/>}

      <Header>Pending Parcels</Header>
      <ParcelTable parcels={pendingParcels} setParcels={setPendingParcels} setNewParcels={setApprovedParcels} />
      <br />
      <Divider />

      <Header>Approved Parcels</Header>
      <ParcelTable parcels={approvedParcels} setParcels={setApprovedParcels} setOpenSuccess={setOpenSuccess} setNewParcels={setInTransitParcels} setOldParcels={setPendingParcels} />

      <br />
      <Divider />

      <Header>In-Transit Parcels</Header>
      <ParcelTable parcels={inTransitParcels} setParcels={setInTransitParcels} setOpenSuccess={setOpenSuccess} setNewParcels={setDeliveredParcels} setOldParcels={setPendingParcels} />

      <br />
      <Divider />

      <Header>Delivered Parcels</Header>
      <ParcelTable parcels={deliveredParcels} setParcels={setDeliveredParcels} />

    </>
  )
}

export default DriverHome