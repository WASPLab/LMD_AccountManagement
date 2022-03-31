import { useState } from "react";
import { Button, Dropdown, Form, Header, Modal, Segment } from "semantic-ui-react";

import Cookies from 'js-cookie';
import axios from "axios";

const backend_url = "http://localhost:8000"

const CreateShipmentModal = ({ showModal, setShowModal }) => {
  const token = Cookies.get("token")

  const [shipmentDetail, setShipmentDetail] = useState({
    consignee: "",
    numItems: "",
    size: "",
    cost: "",
    pickupStreet: "",
    pickupAddressline2: "",
    pickupCity: "",
    pickupProvince: "",
    pickupPostalcode: "",
    dropStreet: "",
    dropAddressline2: "",
    dropCity: "",
    dropProvince: "",
    dropPostalcode: "",
    deliveryDay: "",
    pickupDay: "",
    pickupTime: "",
    deliveryTime: "",
    distance: "",
  })

  const {
    consignee,
    numItems,
    size,
    cost,
    pickupStreet,
    pickupAddressline2,
    pickupCity,
    pickupProvince,
    pickupPostalcode,
    dropStreet,
    dropAddressline2,
    dropCity,
    dropProvince,
    dropPostalcode,
    deliveryDay,
    pickupDay,
    pickupTime,
    deliveryTime,
    distance,
  } = shipmentDetail

  const onModalClose = () => {
    setShowModal(false)
  }

  const handleChange = (event, result) => {
    const { name, value } = event.target;
    setShipmentDetail((prev) => ({ ...prev, [name || result.name]: value || result.value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      const data = await axios.post(`${backend_url}/task/create_shipping_request`, shipmentDetail, {
        headers: { 'Authorization': `Bearer ${token}`}
      })
      setShowModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  const sizeOfItem = [
    { key: "veryLarge", text: "Very Large", value: "Very Large" },
    { key: "large", text: "Large", value: "Large" },
    { key: "medium", text: "Medium", value: "Medium" },
    { key: "small", text: "Small", value: "Small" },
  ];

  return (
    <>
      <Modal
        size="small"
        open={showModal}
        onClose={onModalClose}
        closeIcon
        closeOnDimmerClick
      >
        <Modal.Header
          content={'Create New Shipment'}
        />

        <Modal.Content>
          <div style={{ position: "sticky", bottom: "0px" }}>
            <Form onSubmit={submitHandler}>
              <Form.Input
                required
                label="Consignee"
                placeholder="Consignee"
                name="consignee"
                value={consignee}
                onChange={handleChange}
                fluid
                icon="user"
                iconPosition="left"
              />
              <Header>Shipment Description</Header>

              <Segment >
                <Form.Input
                  required
                  label="Number of Items"
                  placeholder="Number of Items"
                  name="numItems"
                  value={numItems}
                  onChange={handleChange}
                  fluid
                  icon="keyboard outline"
                  iconPosition="left"
                />

                <Dropdown
                  placeholder="Size of Box"
                  name="size"
                  label="Size of Box"
                  search
                  selection
                  options={sizeOfItem}
                  fluid
                  onChange={handleChange}
                  value={size}
                />

                <Form.Input
                  required
                  label="Cost"
                  placeholder="Cost"
                  name="cost"
                  value={cost}
                  onChange={handleChange}
                  fluid
                  icon="keyboard outline"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Distance"
                  placeholder="Distance"
                  name="distance"
                  value={distance}
                  onChange={handleChange}
                  fluid
                  icon="keyboard outline"
                  iconPosition="left"
                />
              </Segment>

              <Header>Pickup Details</Header>
              <Segment>
                <Form.Input
                  required
                  label="Address 1"
                  placeholder="Address 1"
                  name="pickupStreet"
                  value={pickupStreet}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Address 2"
                  placeholder="Address 2"
                  name="pickupAddressline2"
                  value={pickupAddressline2}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="City"
                  placeholder="City"
                  name="pickupCity"
                  value={pickupCity}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Province"
                  placeholder="Province"
                  name="pickupProvince"
                  value={pickupProvince}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Postal Code"
                  placeholder="Postal Code"
                  name="pickupPostalcode"
                  value={pickupPostalcode}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Pickup Day"
                  placeholder="DD/MM/YYYY"
                  name="pickupDay"
                  value={pickupDay}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Pickup Time"
                  placeholder="HH:MM AM/PM"
                  name="pickupTime"
                  value={pickupTime}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />
              </Segment>

              <Header>Dropoff Details</Header>
              <Segment>
                <Form.Input
                  required
                  label="Address 1"
                  placeholder="Address 1"
                  name="dropStreet"
                  value={dropStreet}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Address 2"
                  placeholder="Address 2"
                  name="dropAddressline2"
                  value={dropAddressline2}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="City"
                  placeholder="City"
                  name="dropCity"
                  value={dropCity}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Province"
                  placeholder="Province"
                  name="dropProvince"
                  value={dropProvince}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Postal Code"
                  placeholder="Postal Code"
                  name="dropPostalcode"
                  value={dropPostalcode}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Delivery Day"
                  placeholder="DD/MM/YYYY"
                  name="deliveryDay"
                  value={deliveryDay}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />

                <Form.Input
                  required
                  label="Delivery Time"
                  placeholder="HH:MM AM/PM"
                  name="deliveryTime"
                  value={deliveryTime}
                  onChange={handleChange}
                  fluid
                  icon="user"
                  iconPosition="left"
                />
              </Segment>

              <Button
                icon="save"
                content="Save"
                type="submit"
                color="orange"
              />
            </Form>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default CreateShipmentModal