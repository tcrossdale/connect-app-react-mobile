import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { Preloader } from "../components/preloader-container";
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { throws } from "assert";
import "../styles/notes.scss";

class Profile extends Component {
  state = {
    actionModalIsOpen: true,
    filterTypeView: "notes",
    headerData: [
      {
        type: "profile",
        centerheader: {
          type: "list",
          title: "My Profile",
          subtitle: "",
          list: null
        },
        leftheader: [],
        rightheader: [
          {
            type: "icon",
            icon: "pencil-alt",
            action: null,
            filterModalLink: true
          }
        ]
      }
    ],
    currentUser:
      this.props && this.props.appData && this.props.appData.currentUser
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  goPrevPage = () => {
    this.props.history.goBack();
  };

  componentDidMount() {
    let mainModalIsOpen =
      this.props && this.props.mainModalIsOpen === true
        ? this.props.mainModalIsOpen
        : null;

    // Close mainModal if open
    if (mainModalIsOpen) {
      this.props.toggleMainModal();
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("profile", this.state.headerData)}
        />
        <main className="app-body">
          <div className="app-body-inner profile-body-inner">
            <div className="upper">
              <div className="edit-panel">
                <span>
                  <FontAwesomeIcon
                    icon="angle-left"
                    onClick={() => this.goPrevPage()}
                  />
                </span>
                <span>
                  <FontAwesomeIcon icon="pencil-alt" />
                </span>
              </div>
            </div>
            <div className="lower">
              {this.state.currentUser && this.state.currentUser.user_email ? (
                <div className="email">{this.state.currentUser.user_email}</div>
              ) : null}
              <ul>
                <li>
                  <div className="inner">
                    <div className="left">
                      <div>
                        <FontAwesomeIcon icon="tasks" />
                        <span>View Tasks</span>
                      </div>
                    </div>
                    <div className="right"></div>
                  </div>
                </li>
                <li>
                  <div className="inner">
                    <div className="left">
                      <div>
                        <FontAwesomeIcon icon="clipboard-list" />
                        <span>Join project</span>
                      </div>
                    </div>
                    <div className="right"></div>
                  </div>
                </li>
                <li>
                  <div className="inner">
                    <div className="left">
                      <div>
                        <FontAwesomeIcon icon="share" />
                        <span>Share</span>
                      </div>
                    </div>
                    <div className="right"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </main>

        <UpdateProfileModal
          appData={this.props.appData}
          modalIsOpen={this.state.createModalIsOpen}
          closeCreateModal={this.closeCreateModal}
          createAppItem={this.props.createAppItem}
          activeUpdateProject={
            this.state.activeUpdateProject && this.state.activeUpdateProject
          }
          title={
            <Fragment>
              <FontAwesomeIcon icon="clipboard" />
              <span>Create Project</span>
            </Fragment>
          }
        />

        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

const UpdateProfileModal = props => {
  console.log("CreateProjectModal", props);
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
  };
  return (
    <Fragment>
      <div className="create-button-wrapper">
        <div className="create-button" onClick={() => toggleTheModal()}>
          <FontAwesomeIcon icon="plus" />
        </div>
      </div>
      <Modal isOpen={theModalIsOpen} toggle={toggleTheModal}>
        <ModalHeader toggle={toggleTheModal}>{props.title}</ModalHeader>
        <ModalBody></ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            color="primary"
            onClick={e => submitForm(theCurrForm)}
          >
            Create
          </Button>{" "}
          <Button color="secondary" onClick={toggleTheModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default Profile;
