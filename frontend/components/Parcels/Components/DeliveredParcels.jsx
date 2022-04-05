import ParcelTable from "../../Home/Components/ParcelTable"

const DeliveredParcels = ({deliveredParcels, setDeliveredParcels}) => {
  return (
    <ParcelTable parcels={deliveredParcels} setParcels={setDeliveredParcels}/>
    )
}

export default DeliveredParcels