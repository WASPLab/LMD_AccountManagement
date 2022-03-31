import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Button,
  Divider,
  Form,
  FormInput,
  Message,
  Segment,
} from "semantic-ui-react";

import axios from "axios";

const backend_url = "http://localhost:8000"

const PersonalDetail = ({user, setUser}) => {
  const type = Cookies.get("type")
  const token = Cookies.get("token")

  const { first_name, last_name, email } = user;

  const [errormsg, setErrormsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleChange = (event, result) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name || result.name]: value || result.value}));
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormLoading(true)
    try{
        const result = await axios.post(`${backend_url}/task/editdetails?type=${type}`, user, {
          headers: { 'Authorization': `Bearer ${token}`}
        })
        setUser({
          ...user,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        })  
        setFormLoading(false)
      }catch(error){
        console.log(error)
        setErrormsg(error)
    }
  };

  return (
    <>
      <Form
        loading={formLoading}
        error={errormsg !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Oops!"
          content={errormsg}
          onDismiss={() => setErrormsg(null)}
        />
        <Segment>
          <FormInput
            required
            label="First Name"
            placeholder="First Name"
            name="first_name"
            value={first_name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />

          <FormInput
            required
            label="Last Name"
            placeholder="Last Name"
            name="last_name"
            value={last_name}
            onChange={handleChange}
            fluid
            icon="user outline"
            iconPosition="left"
          />

          <FormInput
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
          />

          <Divider hidden />
          <Button
            icon="save"
            content="Save"
            type="submit"
            color="orange"
          />
        </Segment>
      </Form>
    </>
  );
};

export default PersonalDetail;
