import React, { Component, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const MainModal = props => {
  const [mainModalIsOpen, setMainModalIsOpen] = useState(props.mainModalIsOpen);

  const toggleMainModal = () => {
    let currMainModalOpen = !mainModalIsOpen;
    setMainModalIsOpen(currMainModalOpen);
  };
  const askToLogout = () => {
    console.log("Logout Props - ", props);
    props.askToLogout();
  };
  return (
    <Modal
      isOpen={props.mainModalIsOpen}
      toggle={props.toggleMainModal}
      id="user-settings-modal"
    >
      <ModalHeader toggle={props.toggleMainModal}>
        <img
          src={
            props.appData &&
            props.appData.currentUser &&
            props.appData.currentUser.avatar_urls &&
            props.appData.currentUser.avatar_urls &&
            props.appData.currentUser.avatar_urls["96"]
          }
        />
      </ModalHeader>
      <ModalBody>
        {props.appData && props.appData.currentUser && (
          <div>{props.appData.currentUser.email}</div>
        )}
        <div>
          <Button
            type="button"
            className="primary"
            onClick={() => askToLogout()}
          >
            Logout
          </Button>
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

export default MainModal;
