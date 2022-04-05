import ParcelTable from "../../Home/Components/ParcelTable"


const InTransitParcels = ({inTransitParcels, setInTransitParcels, setDeliveredParcels}) => {
  return (
    <ParcelTable parcels={inTransitParcels} setParcels={setInTransitParcels} setNewParcels={setDeliveredParcels} status="in-transit"/>
    )
}

export default InTransitParcels