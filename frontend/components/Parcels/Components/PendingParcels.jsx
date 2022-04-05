import ParcelTable from "../../Home/Components/ParcelTable"

const PendingParcels = ({pendingParcels, setPendingParcels, setNewParcels}) => {
  return (
    <>
    <ParcelTable parcels={pendingParcels} setParcels={setPendingParcels} setNewParcels={setNewParcels}  status="pending"/>
    </>
  )
}

export default PendingParcels