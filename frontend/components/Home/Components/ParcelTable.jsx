import React, { useState } from 'react'
import { Button, Table } from 'semantic-ui-react'
import ParcelDetailModal from '../../Modal/ParcelDetailModal'
import NoDataFound from './NoDataFound'

const ParcelTable = ({ parcels, setParcels, setNewParcels, status }) => {
  const [showModal, setShowModal] = useState(false)
  const [selectedParcel, setSelectedParcel] = useState('')

  return (
    <>
      {showModal &&
        <ParcelDetailModal
          showModal={showModal}
          setShowModal={setShowModal}
          parcel={parcels.find((parcel) => parcel.parcelid === selectedParcel)}
          status={status}
          setParcels={setParcels}
          setNewParcels={setNewParcels}
        />
      }
      {parcels.length > 0 ? (<Table >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Consignee</Table.HeaderCell>
            <Table.HeaderCell>No. of Items</Table.HeaderCell>
            <Table.HeaderCell>Size of Parcel</Table.HeaderCell>
            <Table.HeaderCell>Pickup Location</Table.HeaderCell>
            <Table.HeaderCell>Drop Location</Table.HeaderCell>
            <Table.HeaderCell>Pickup Date</Table.HeaderCell>
            <Table.HeaderCell>Drop Date</Table.HeaderCell>
            <Table.HeaderCell>Distance</Table.HeaderCell>
            <Table.HeaderCell>Cost</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {parcels.map((parcel) => {
            return (
              <Table.Row>
                <Table.Cell>{parcel.consignee}</Table.Cell>
                <Table.Cell>{parcel.numItems}</Table.Cell>
                <Table.Cell>{parcel.size}</Table.Cell>
                <Table.Cell>{`${parcel.pickupCity}, ${parcel.pickupProvince}`}</Table.Cell>
                <Table.Cell>{`${parcel.dropCity}, ${parcel.dropProvince}`}</Table.Cell>
                <Table.Cell>{parcel.pickupDay}</Table.Cell>
                <Table.Cell>{parcel.deliveryDay}</Table.Cell>
                <Table.Cell>{parcel.distance}</Table.Cell>
                <Table.Cell>{parcel.cost}</Table.Cell>
                <Table.Cell>
                  <Button
                    icon="eye"
                    content="View Detail"
                    type="button"
                    onClick={() => {
                      setShowModal(true)
                      setSelectedParcel(parcel.parcelid)
                    }}
                    color="orange"
                  />

                </Table.Cell>
              </Table.Row>)
          })}
        </Table.Body>
      </Table>) : (
        <NoDataFound />
      )}
    </>
  )
}

export default ParcelTable