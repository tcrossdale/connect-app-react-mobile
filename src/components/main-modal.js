import React, { Component, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MainModal = props => {
  const [mainModalIsOpen, setMainModalIsOpen] = useState(props.mainModalIsOpen);

  const toggleMainModal = () => {
    let currMainModalOpen = !mainModalIsOpen;
    setMainModalIsOpen(currMainModalOpen);
  };
  const askToLogout = () => {
    props.askToLogout();
  };

  return (
    <Modal
      isOpen={props.mainModalIsOpen}
      toggle={props.toggleMainModal}
      id="user-settings-modal"
    >
      <ModalHeader toggle={props.toggleMainModal}></ModalHeader>
      <ModalBody>
        <div className="avatar-panel">
          <img
            src={
              props.appData &&
              props.appData.currentUser &&
              props.appData.currentUser.avatar_urls &&
              props.appData.currentUser.avatar_urls &&
              props.appData.currentUser.avatar_urls["96"]
            }
          />
          {props.appData &&
          props.appData.currentUser &&
          props.appData.currentUser.user_email ? (
            <div className="email">{props.appData.currentUser.user_email}</div>
          ) : null}
          <div className="view-profile-link">
            <Link to="/profile" onClick={() => toggleMainModal()}>
              View Profile
            </Link>
          </div>
        </div>
        <div className="settings-actions-links">
          <div className="item">
            <h5>Organizations</h5>
            <div className="item-inner">
              <div className="wrap">
                <h6>My Company</h6>
                {props.appData &&
                props.appData.currentUser &&
                props.appData.currentUser.user_email ? (
                  <p>{props.appData.currentUser.user_email}</p>
                ) : null}
              </div>
              <FontAwesomeIcon icon="angle-right" />
            </div>
          </div>
          <div className="item">
            <h5>Notifications</h5>
            <div className="item-inner">
              <div className="wrap">
                <h6>Push</h6>
                <p>On</p>
              </div>
              <FontAwesomeIcon icon="angle-right" />
            </div>
          </div>
          <div className="item">
            <h5>Support</h5>
            <div className="item-inner">
              <div className="wrap">
                <h6>Contact Support</h6>
              </div>
              <FontAwesomeIcon icon="angle-right" />
            </div>
          </div>
          <div className="item">
            <h5>More</h5>
            <div className="item-inner">
              <div className="wrap">
                <h6>Rate the app</h6>
              </div>
              <FontAwesomeIcon icon="angle-right" />
            </div>
            <div className="item-inner">
              <div className="wrap">
                <h6>Privacy policy</h6>
              </div>
              <FontAwesomeIcon icon="angle-right" />
            </div>
            <div className="item-inner">
              <div className="wrap">
                <h6>Terms of service</h6>
              </div>
              <FontAwesomeIcon icon="angle-right" />
            </div>
            <div className="item-inner">
              <div className="wrap">
                <h6>Version</h6>
              </div>
            </div>
          </div>
        </div>
        <div className="settings-logout-link">
          <Button
            type="button"
            className="primary"
            onClick={() => askToLogout()}
          >
            Log out
          </Button>
        </div>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

export default MainModal;
