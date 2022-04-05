import ParcelTable from "../../Home/Components/ParcelTable"

const AcceptedParcels = ({approvedParcels, setApprovedParcels, setNewParcels}) => {
  return (
    <>
    <ParcelTable parcels={approvedParcels} setParcels={setApprovedParcels} setNewParcels={setNewParcels}  status="assigned"/>
    </>
  )
}

export default AcceptedParcels