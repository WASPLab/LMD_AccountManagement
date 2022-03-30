import React, { useState } from 'react'
import { Button, Divider, Form, List } from 'semantic-ui-react'
import Cookies from 'js-cookie'
import Router from 'next/router'
import axios from 'axios'

const backend_url = "http://localhost:8000"

const Vehicle = ({setActiveItem}) => {
  const token = Cookies.get("token")
  const type = Cookies.get("type")

  const [errormsg, setErrormsg] = useState(null);
  const [showLicenseDetail, setShowLicenseDetail] = useState(true)
  const [showVehicleDetail, setShowVehicleDetail] = useState(false)

  const [licenseDetail, setLicenseDetail] = useState({
    license_number: "",
    license_expiry_date: "",
  })

  const [vehicleDetail, setVehicleDetail] = useState({
    vehicle_insurance_number: "",
    car_make: "",
    car_model: "",
    year: "",
  })

  const { license_number, license_expiry_date } = licenseDetail
  const { vehicle_insurance_number, car_make, car_model, year } = vehicleDetail

  const handleChange = (event, result) => {
    const { name, value } = event.target;
    setLicenseDetail((prev) => ({ ...prev, [name || result.name]: value || result.value}));
  };

  const handleVehicleChange = (event, result) => {
    const { name, value } = event.target;
    setVehicleDetail((prev) => ({ ...prev, [name || result.name]: value || result.value}));
  };

  const buttonClickHandle = async (event) => {
    event.preventDefault()
    try {
      const licenceResult = await axios.post(`${backend_url}/task/editlicense?type=${type}`, licenseDetail, {
        headers: { 'Authorization': `Bearer ${token}`}
      })
      const vehicleResult = await axios.post(`${backend_url}/task/editvehicle?type=${type}`, vehicleDetail, {
        headers: { 'Authorization': `Bearer ${token}`}
      })
      Router.push("/driverHomePage")
    } catch(error) {
      console.log(error)
      setErrormsg(error)
    }
  }

  return (
    <>
      <List size="huge" animated error={errormsg || null}>
          <List.Item>
            <List.Icon name='book' size="large" verticalAlign="middle" />
            <List.Content>
              <List.Header
                as="a"
                onClick={() => {
                  setShowLicenseDetail(!showLicenseDetail)
                  setShowVehicleDetail(!showVehicleDetail)
                }}
                content="License Detail"
              />
          </List.Content>

          {showLicenseDetail && <Form>
            <Form.Input
              required
              label="License Number"
              placeholder="License Number"
              name="license_number"
              value={license_number}
              onChange={handleChange}
              fluid
              icon="drivers license"
              iconPosition="left"
            />

            <Form.Input
              required
              label="Expiry Date"
              placeholder="Expiry Date"
              name="license_expiry_date"
              value={license_expiry_date}
              onChange={handleChange}
              fluid
              icon="calendar alternate outline"
              iconPosition="left"
            />
          </Form>}
        </List.Item>

        <Divider />
        
        <List.Item>
            <List.Icon name='truck' size="large" verticalAlign="middle" />
            <List.Content>
              <List.Header
                as="a"
                onClick={() => {
                  setShowLicenseDetail(!showLicenseDetail)
                  setShowVehicleDetail(!showVehicleDetail)
                }}
                content="Vehicle Detail"
              />
          </List.Content>
          {showVehicleDetail && <Form>
            <Form.Input
              required
              label="Vehicle Insurance Number"
              placeholder="Vehicle Insurance Number"
              name="vehicle_insurance_number"
              value={vehicle_insurance_number}
              onChange={handleVehicleChange}
              fluid
              icon="id card outline"
              iconPosition="left"
            />
            <Form.Input
              required
              label="Car Make"
              placeholder="Car Make"
              name="car_make"
              value={car_make}
              onChange={handleVehicleChange}
              fluid
              icon="industry"
              iconPosition="left"
            />
            <Form.Input
              required
              label="Car Model"
              placeholder="Car Model"
              name="car_model"
              value={car_model}
              onChange={handleVehicleChange}
              fluid
              icon="car"
              iconPosition="left"
            />
            <Form.Input
              required
              label="Year"
              placeholder="Year"
              name="year"
              value={year}
              onChange={handleVehicleChange}
              fluid
              icon="calendar alternate outline"
              iconPosition="left"
            />
          </Form>}
        </List.Item>

        <Divider hidden />
        <Button
          icon="save"
          content="Save"
          onClick={buttonClickHandle}
          color="orange"
        />
      </List>
    </>
  )
}

export default Vehicle