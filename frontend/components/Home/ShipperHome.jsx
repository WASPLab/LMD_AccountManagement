import { useState } from "react"
import { Button } from "semantic-ui-react"
import CreateShipmentModal from "../Modal/CreateShipmentModal"

const ShipperHome = ({ user }) => {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const onButtonClick = () => {
    setShowCreateModal(true)
  }
  return (
    <>
      <div>Welcome, {`${user.first_name} ${user.last_name}`} </div>
      <Button
        icon="shipping fast"
        content="Create Shipment"
        type="button"
        onClick={onButtonClick}
        color="orange"
      />

      {showCreateModal &&
        <CreateShipmentModal
          showModal={showCreateModal}
          setShowModal={setShowCreateModal}
        />
      }
    </>
  )
}

export default ShipperHome