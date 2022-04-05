import React from 'react'
import { Menu } from 'semantic-ui-react'
import Cookies from 'js-cookie'

const type = Cookies.get("type")

const DriverParcels = ({
	activeItem,
	handleItemClick
}) => {
	return (
		<>
			<Menu pointing secondary>
				<Menu.Item
					name="pendingParcels"
					active={activeItem === "pendingParcels"}
					onClick={() => handleItemClick("pendingParcels")}
				/>

				<Menu.Item
					name="approvedParcels"
					active={activeItem === "approvedParcels"}
					onClick={() => handleItemClick("approvedParcels")}
				/>

				<Menu.Item
					name="inTransitParcels"
					active={activeItem === "inTransitParcels"}
					onClick={() => handleItemClick("inTransitParcels")}
				/>

				<Menu.Item
					name="deliveredParcels"
					active={activeItem === "deliveredParcels"}
					onClick={() => handleItemClick("deliveredParcels")}
				/>
			</Menu>
		</>
	)
}

export default DriverParcels