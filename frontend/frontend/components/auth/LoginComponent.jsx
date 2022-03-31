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
import Cookies from "js-cookie"
import styles from "./Login.module.css";

const LoginComponent = () => {
  const router = useRouter()
  const type = router.query.type

  if (type) {
    Cookies.set("type", type)
  } else {
    Cookies.set("type", "consignees")
  }
  const backend_url = "http://localhost:8000"

  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const { username, password } = user;

  const [showPassword, setShowPassword] = useState(false);
  const [errormsg, setErrormsg] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  useEffect(() => {
    const isUser = Object.values({
      username,
      password,
    }).every((item) => Boolean(item));
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true)
    try{
      const token = await axios.post(`${backend_url}/task/login?type=${type}`, user)
      Cookies.set("token", token.data.access_token)
      if (type === "drivers") {
        router.reload("/driverHomePage")
      } else if (type === "shippers") {
        router.reload("/shipperHomePage")
      } else if (type === "consignees") {
        router.reload("/consigneeHomePage")
      }
    }catch(error){
        console.log(error)
        setErrormsg(error)
    } finally{
      setFormLoading(false)
    }
  };

  return (
    <>
      <Form
        loading={formLoading}
        error={errormsg !== null}
        onSubmit={handleSubmit}
        className={styles.form}
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
            label="Username"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
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

          <Divider hidden />
          <Button
            icon="signup"
            content="Login"
            type="submit"
            color="orange"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>
    </>
  );
};

export default LoginComponent;
