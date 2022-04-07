import axios from 'axios';
import { useState, useEffect } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import Router from 'next/router';

import Cookies from 'js-cookie';

const backend_url = "http://localhost:8000"

const Payment = ({ user, setUser }) => {
  const token = Cookies.get("token")
  const type = Cookies.get("type")

  const [cardDetail, setCardDetail] = useState({
    card_number: user?.card_number || "",
    expiration: user?.expiration || "",
    name_on_card: user?.name_on_card || "",
    cvc: user?.cvc || "",
  })
  const [formLoading, setFormLoading] = useState(false);
  const [errormsg, setErrormsg] = useState(null);
  const [enableSave, setEnableSave] = useState(false)
  const [cardNumberError, setCardNumberError] = useState(false)
  const [cvcError, setCvcError] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)
  const { card_number, name_on_card, expiration, cvc } = cardDetail

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false)
      return
    }
    setEnableSave(true)
  }, [cardDetail])

  const handleChange = (event, result) => {
    const { name, value } = event.target;
    if (name === "cvc") {
      setCvcError(false)
    }
    if (name === "card_number") {
      setCardNumberError(false)
    }
    setCardDetail((prev) => ({ ...prev, [name || result.name]: value || result.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (card_number.length !== 16) {
      setCardNumberError(true)
      return
    }
    if (cvc.length !== 3) {
      setCvcError(true)
      return
    }
    try {
      const data = await axios.post(`${backend_url}/task/editpayment?type=${type}`, cardDetail, {
        headers: { 'Authorization': `Bearer ${token}`}
      })
      setUser({
        ...user,
        card_number: cardDetail.card_number,
        expiration: cardDetail.expiration,
        name_on_card: cardDetail.name_on_card,
        cvc: cardDetail.cvc,
      })
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
            error={cardNumberError && "Please enter 16 digit card number"}
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
            error={cvcError && "Please enter valid cvc"}
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