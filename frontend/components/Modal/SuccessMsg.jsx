import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const SuccessMsg = ({ showModal, setShowModal }) => {
  return (
    <>
      <Modal
        size="mini"
        open={showModal}
        onClose={() => setShowModal(false)}
        closeIcon
        closeOnDimmerClick
      >
        <Modal.Header
          content={'Success'}
        />
        <Modal.Content>
          <div style={{textAlign: "center"}}>
            Shipment Created Successfully.
            <br />
            <br />
            <Button
              icon="check"
              content="Okay"
              onClick={() => setShowModal(false)}
              color="orange"
            />
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default SuccessMsg