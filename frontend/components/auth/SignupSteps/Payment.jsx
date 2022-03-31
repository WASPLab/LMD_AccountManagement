import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const backend_url = "http://localhost:8000"

const Payment = () => {
  const router = useRouter()
  const token = Cookies.get("token")
  const type = Cookies.get("type")

  const [addressDetail, setAddressDetail] = useState({
    card_number: "",
    expiration: "",
    name_on_card: "",
    cvc: "",
  })
  const [formLoading, setFormLoading] = useState(false);
  const [errormsg, setErrormsg] = useState(null);
  const [enableSave, setEnableSave] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const { card_number, name_on_card, expiration, cvc } = addressDetail

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
      const data = await axios.post(`${backend_url}/task/editpayment?type=${type}`, addressDetail, {
        headers: { 'Authorization': `Bearer ${token}`}
      })
      router.reload("/consigneeHomePage")
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
            label="Card Number"
            placeholder="Card Number"
            name="card_number"
            value={card_number}
            onChange={handleChange}
            fluid
            icon="credit card"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Name on Card"
            placeholder="Name on Card"
            name="name_on_card"
            value={name_on_card}
            onChange={handleChange}
            fluid
            icon="id card"
            iconPosition="left"
          />

          <Form.Input
            required
            label="Valid Thru"
            placeholder="Valid Thru"
            name="expiration"
            value={expiration}
            onChange={handleChange}
            fluid
            icon="calendar check"
            iconPosition="left"
          />

          <Form.Input
            required
            label="CVC"
            placeholder="CVC"
            name="cvc"
            value={cvc}
            onChange={handleChange}
            fluid
            icon="cc"
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

export default Payment