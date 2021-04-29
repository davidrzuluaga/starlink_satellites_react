import React from "react";
import { Button, Modal, Input } from "semantic-ui-react";

const CoordinatesModal = (props) => {
  const { set_coordinatesEdit, coordinatesEdit, set_coordinates, globeloaded, set_globeloaded } = props;
  const [open, set_open] = React.useState(false);

  const triggerButton = (
    <Button onClick={() => set_open(!open)}>Enter your coordinates</Button>
  );

  const handleInputs = event => {
    let name = event.target.name;
    let value = event.target.value;
    set_coordinatesEdit({ ...coordinatesEdit, [name]: value });
  };

  React.useEffect(() => {
    set_open(false)
  }, [globeloaded]);

  const saveCoordinates = () => {
    const {latitude, longitude} = coordinatesEdit
    if (!latitude || !longitude) return alert("Enter Coordinates")
    set_globeloaded(false)
    set_coordinates([parseInt(latitude), parseInt(longitude)]);
  };

  return (
    <>
      <Modal size={"mini"} open={open} trigger={triggerButton} onClose={()=>set_open(false)}>
        <Modal.Header>Change Coordinates</Modal.Header>
        <Modal.Content>
          <Input type="number" onChange={handleInputs} name="latitude" placeholder="Latitude" />
          <Input type="number" onChange={handleInputs} name="longitude" placeholder="Longitude" />
          <Input type="number" onChange={handleInputs} name="number" placeholder="Number of Satellites" />
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={()=>saveCoordinates()} loading={!globeloaded}>Set</Button>
          <Button onClick={()=>set_open(false)}>Cancel</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default CoordinatesModal;
