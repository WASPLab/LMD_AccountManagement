import axios from 'axios'
import Cookies from 'js-cookie'
import React from 'react'
import { Button, Modal, Table } from 'semantic-ui-react'

const backend_url = "http://localhost:8000"

const ParcelDetailModal = ({ parcel, showModal, setShowModal, setParcels, setNewParcels, setOldParcels, setOpenSuccess }) => {
  const type = Cookies.get("type")
  const token = Cookies.get("token")

  const acceptOrder = async () => {
    try {
      const data = await axios.post(`${backend_url}/task/accept_order`, {}, {
        params: { id: parcel.parcelid },
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setShowModal(false)
      setParcels((prev) => prev.filter((p) => p.parcelid !== parcel.parcelid))
      parcel.status = "assigned"
      setNewParcels((prev) => [parcel, ...prev])
    } catch (error) {
      console.log(error)
    }
  }

  const cancelShipment = async () => {
    if ((parcel.status === "pending" || parcel.status === "assigned") && type === "shippers") {
      parcel.status = "canceled"
    } else if ((parcel.status === "assigned" || parcel.status === "in-transit")&& type === "drivers") {
      parcel.status = "pending"
    }
    try {
      const data = await axios.post(`${backend_url}/task/update_order_status`, {}, {
        params: { id: parcel.parcelid, status: parcel.status, type },
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setShowModal(false)
      setParcels((prev) => prev.filter((p) => p.parcelid !== parcel.parcelid))
      if (type === "drivers") {
        setOldParcels((prev) => [parcel, ...prev])
      }
      setOpenSuccess(true)
    } catch (error) {
      console.log(error)
    }
  }

  const updateOrder = async () => {
    if (parcel.status === 'assigned') {
      parcel.status = "in-transit"
    } else if (parcel.status === 'in-transit') {
      parcel.status = "delivered"
    }
    try {
      const data = await axios.post(`${backend_url}/task/update_order_status`, {}, {
        params: { id: parcel.parcelid, status: parcel.status, type },
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setShowModal(false)
      setParcels((prev) => prev.filter((p) => p.parcelid !== parcel.parcelid))
      setNewParcels((prev) => [parcel, ...prev])
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <Modal
        size="small"
        open={showModal}
        onClose={() => setShowModal(false)}
        closeIcon
        closeOnDimmerClick
      >
        <Modal.Header
          content={'Parcel Details'}
        />

        <Modal.Content>
          <Table definition>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Consignee</Table.Cell>
                <Table.Cell>{parcel.consignee}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>No. of Items</Table.Cell>
                <Table.Cell>{parcel.numItems}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Parcel Size</Table.Cell>
                <Table.Cell>{parcel.size}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Pickup Address</Table.Cell>
                <Table.Cell>{
                  `${parcel?.pickupStreet}, 
                  ${parcel?.pickupAddressline2}, 
                  ${parcel?.pickupCity}, 
                  ${parcel?.pickupProvince}, 
                  ${parcel?.pickupPostalcode}`
                }
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Pickup Time</Table.Cell>
                <Table.Cell>{
                  `${parcel.pickupDay}, ${parcel.pickupTime}`
                }
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Dropoff Address</Table.Cell>
                <Table.Cell>{
                  `${parcel.dropStreet}, 
                  ${parcel?.dropAddressline2}, 
                  ${parcel?.dropCity}, 
                  ${parcel?.dropProvince}, 
                  ${parcel?.dropPostalcode}`
                }
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Dropoff Time</Table.Cell>
                <Table.Cell>{
                  `${parcel.deliveryDay}, ${parcel.deliveryTime}`
                }
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Distance</Table.Cell>
                <Table.Cell>{`${parcel.distance} KM`}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Cost</Table.Cell>
                <Table.Cell>{`CAD ${parcel.cost}`}</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
          {type === 'drivers' && parcel.status === 'pending' && <>
            <Button
              icon="check"
              content="Accept"
              color='orange'
              onClick={acceptOrder}
            />
            <Button
              icon="cancel"
              content="Cancel"
              color='orange'
              onClick={() => setShowModal(false)}
            />
          </>}
          {type === 'drivers' && parcel.status === 'assigned' &&
            <>
              <Button
                icon="shipping fast"
                content="Update Status to In-Transit"
                color='orange'
                onClick={updateOrder}
              />
            </>
          }

          {type === 'drivers' && parcel.status === 'in-transit' &&
            <>
              <Button
                icon="truck"
                content="Update Status to Delivered"
                color='orange'
                onClick={updateOrder}
              />
            </>
          }
          {type === 'drivers' && (parcel.status === 'assigned' || parcel.status === 'in-transit') &&
            <>
              <Button
                icon="cancel"
                content="Cancel Shipment"
                color='orange'
                onClick={cancelShipment}
              />
            </>
          }
          {type === 'shippers' && (parcel.status === 'assigned' || parcel.status === 'pending') &&
            <>
              <Button
                icon="cancel"
                content="Cancel Shipment"
                color='orange'
                onClick={cancelShipment}
              />
            </>
          }

        </Modal.Content>
      </Modal>
    </>
  )
}

export default ParcelDetailModal