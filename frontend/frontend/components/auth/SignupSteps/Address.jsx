import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

import Cookies from 'js-cookie';

const backend_url = "http://localhost:8000"
const Address = ({ setActiveItem }) => {
  const [addressDetail, setAddressDetail] = useState({
    street: "",
    addressline2: "",
    city: "",
    province: "",
    postalcode: ""
  })
  const [formLoading, setFormLoading] = useState(false);
  const [errormsg, setErrormsg] = useState(null);
  const [enableSave, setEnableSave] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const { street, addressline2, city, province, postalcode } = addressDetail
  const token = Cookies.get("token")
  const type = Cookies.get("type")
  
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false)
      return
    }
    setEnableSave(true)
  }, [addressDetail])

  const handleChange = (event, result) => {
    const { name, value } = event.target;
    setAddressDetail((prev) => ({ ...prev, [name || result.name]: value || result.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const data = await axios.post(`${backend_url}/task/editaddress?type=${type}`, addressDetail, {
        headers: { 'Authorization': `Bearer ${token}`}
      })
      setActiveItem("payment")
    } catch (error) {
      console.log(error)
      setErrormsg(error)
    }
  }

  return (
    <>
      <Form
        loading={formLoading}
        error={errormsg !== null}
        onSubmit={handleSubmit}
      >
        <Segment>
          <Form.Input
            required
            label="Address 1"
            placeholder="Address 1"
            name="street"
            value={street}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Address 2"
            placeholder="Address 2"
            name="addressline2"
            value={addressline2}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Form.Input
            required
            label="City"
            placeholder="City"
            name="city"
            value={city}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Province"
            placeholder="Province"
            name="province"
            value={province}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Postal Code"
            placeholder="Postal Code"
            name="postalcode"
            value={postalcode}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <Button
            icon="save"
            content="Save"
            type="submit"
            color="orange"
          />
        </Segment>
      </Form>
    </>
  )
}

export default Address