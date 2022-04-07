import { useEffect, useState } from "react"
import axios from "axios"
import { Button, Divider, Header } from "semantic-ui-react"
import CreateShipmentModal from "../Modal/CreateShipmentModal"
import ParcelTable from "./Components/ParcelTable"
import Cookies from "js-cookie"
import SuccessMsg from "../Modal/SuccessMsg"

const backend_url = "http://localhost:8000"

const ShipperHome = ({ user }) => {
  const token = Cookies.get("token")
  const type = Cookies.get("type")

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [openSuccess, setOpenSuccess] = useState(false)
  const [deleteShipment, setDeleteShipment] = useState(false)
  const [pendingParcels, setPendingParcels] = useState([])
  const [approvedParcels, setApprovedParcels] = useState([])
  const [inTransitParcels, setInTransitParcels] = useState([])
  const [deliveredParcels, setDeliveredParcels] = useState([])

  useEffect(async () => {
      const data = await axios.get(`${backend_url}/task/available_parcels`, {
        params: {type, status: "pending"},
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setPendingParcels(data?.data.splice(0,3))
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

  const onButtonClick = () => {
    setShowCreateModal(true)
  }
  
  return (
    <>
      <div>Welcome, {`${user.first_name} ${user.last_name}`} </div>
      <Divider />
      <Button
        icon="shipping fast"
        content="Create Shipment"
        type="button"
        onClick={onButtonClick}
        color="orange"
      />
      <br />

      {openSuccess && <SuccessMsg showModal={openSuccess} setShowModal={setOpenSuccess} message={"Shipment created successfully."}/>}
      {deleteShipment && <SuccessMsg showModal={deleteShipment} setShowModal={setDeleteShipment} message={"This shipment is deleted permanently."}/>}

      {showCreateModal &&
        <CreateShipmentModal
          showModal={showCreateModal}
          setShowModal={setShowCreateModal}
          setPendingParcels={setPendingParcels}
          setOpenSuccess={setOpenSuccess}
        />
      }
      <Header>Pending Parcels</Header>
      <ParcelTable parcels={pendingParcels} setParcels={setPendingParcels} setOpenSuccess={setDeleteShipment} />

      <br />
      <Divider />

      <Header>Approved Parcels</Header>
      <ParcelTable parcels={approvedParcels} setParcels={setApprovedParcels} setOpenSuccess={setDeleteShipment}/>

      <br />
      <Divider />

      <Header>In-Transit Parcels</Header>
      <ParcelTable parcels={inTransitParcels} setParcels={setInTransitParcels} />

      <br />
      <Divider />

      <Header>Delivered Parcels</Header>
      <ParcelTable parcels={deliveredParcels} setParcels={setDeliveredParcels} />

    </>
  )
}

export default ShipperHome