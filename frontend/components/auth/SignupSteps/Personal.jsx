import { useEffect, useState } from "react";
import { useRouter } from "next/router"
import {
  Button,
  Divider,
  Form,
  FormInput,
  Message,
  Segment,
} from "semantic-ui-react";

import axios from "axios";
import Cookies from "js-cookie";

const backend_url = "http://localhost:8000"
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const regexEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const PersonalDetail = ({setActiveItem, type}) => {
  const router = useRouter()
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const { first_name, last_name, email, password } = user;

  const [showPassword, setShowPassword] = useState(false);
  const [errormsg, setErrormsg] = useState(null);

  const [uname, setUname] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleChange = (event, result) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name || result.name]: value || result.value}));
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormLoading(true)
    try{
        const token = await axios.post(`${backend_url}/task/signup?type=${type}`, user)
        Cookies.set("token", token.data.access_token)
        if (type === "shippers") {
          router.reload("/shipperHomePage")
        }
        else if (type === "consignees") {
          setActiveItem("address")
        }
        else if (type === "drivers") {
          setActiveItem("vehicleDetail")
        }
      } catch(error){
        console.log(error)
        setErrormsg(error)
      }
  };

  useEffect(() => {
    const isUser = Object.values({
      first_name,
      last_name,
      email,
      password
    }).every((item) => Boolean(item));
    (isUser && regexEmail.test(email) && usernameAvailable) ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      const data = await axios.get(`${backend_url}/task/checkUsername?username=${uname}`, {
        params: {type}
      });
      if (data.data.result === "false") {
        setUsernameAvailable(true);
        setUser((prev) => ({ ...prev, username: uname }));
      } else {
        setUsernameAvailable(false)
      }
    } catch (error) {
      setErrormsg("Username Not Avaialable");
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    uname === "" ? setUsernameAvailable(false) : checkUsername();
  }, [uname])

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

          <FormInput
            required
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => {
                setShowPassword(!showPassword);
              },
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
          />

          <FormInput
            required
            loading={usernameLoading}
            error={!usernameAvailable}
            label="Username"
            placeholder="Username"
            name="username"
            value={uname}
            onChange={(e) => {
              setUname(e.target.value);
              if (regexUserName.test(e.target.value)) {
                setUsernameAvailable(true);
              } else {
                setUsernameAvailable(false);
              }
            }}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="orange"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
    </>
  );
};

export default PersonalDetail;
