import { useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { Grid } from 'semantic-ui-react';

import SignupMenuTab from './SignupSteps/SignupMenuTab';
import PersonalDetail from "./SignupSteps/Personal";
import Address from './SignupSteps/Address';
import Vehicle from './SignupSteps/Vehicle';
import Payment from './SignupSteps/Payment';

import styles from './Signup.module.css';

const SignupComponent = () => {
  const router = useRouter()
  const token = Cookies.get('token')
  const type = router.query.type
  Cookies.set("type", type)  
  
  const [activeItem, setActiveItem] = useState("")

  const handleItemClick = (item) => setActiveItem(item)

  return (
    <div className={styles.form}>
      {!token ? 
        <PersonalDetail setActiveItem={setActiveItem} type={type} />
        :
        (
          <Grid>
            <Grid.Row>
              <Grid.Column>
                <SignupMenuTab
                  activeItem={activeItem}
                  handleItemClick={handleItemClick}
                />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                {type === "consignees" && activeItem === "address" && (
                  <Address setActiveItem={setActiveItem} type={type}/>
                )}

                {type === 'drivers' && activeItem === "vehicleDetail" && (
                  <Vehicle setActiveItem={setActiveItem} type={type}/>
                )}

                {type === "consignees" && activeItem === "payment" && (
                  <Payment setActiveItem={setActiveItem} type={type}/>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )
      }
    </div>
  )
};

export default SignupComponent;
