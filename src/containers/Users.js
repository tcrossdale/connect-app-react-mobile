import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "react-calendar";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { UserFormFields } from "../components/forms";
import { Preloader } from "../components/preloader-container";
import BootBox from "react-bootbox";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormText,
  Input,
  Button
} from "reactstrap";
import "../styles/users.scss";

const UsersList = props => {
  let theUsersList = [
    {
      name: "Jason Winston",
      phone: "718-876-9054",
      role: "client",
      email: "jasonwinston@jwinston.com"
    },
    {
      name: "Jason Winston",
      phone: "718-876-9054",
      role: "client",
      email: "jasonwinston@jwinston.com"
    },
    {
      name: "Jason Winston",
      phone: "718-876-9054",
      role: "client",
      email: "jasonwinston@jwinston.com"
    },
    {
      name: "Jason Winston",
      phone: "718-876-9054",
      role: "client",
      email: "jasonwinston@jwinston.com"
    }
  ];
  const [usersList, setUsersList] = useState(props.theUsers);

  const toggleItem = evt => {
    const currentItem = evt.currentTarget,
      currentItemLi = currentItem
        .closest(".meta-display")
        .closest(".upper-panel")
        .closest(".inner")
        .closest("li"),
      theUl = evt.currentTarget
        .closest(".meta-display")
        .closest(".upper-panel")
        .closest(".inner")
        .closest("li")
        .closest("ul"),
      theLis = theUl.querySelectorAll("li");

    theLis.forEach((item, index) => {
      if (item == currentItemLi) {
        item.classList.toggle("active");
      } else {
        item.classList.remove("active");
      }
    });
  };

  return (
    <ul className="users-list">
      {usersList &&
        usersList.map((user, index) => (
          <li key={index}>
            <div className="inner">
              <div className="upper-panel">
                <div className="meta-display">
                  <div className="avatar" onClick={e => toggleItem(e)}>
                    <img src={user.avatar_urls && user.avatar_urls["48"]} />
                  </div>
                  <div className="user-meta">
                    <h5>{user.name}</h5>
                    <h6>J Winston NYC</h6>
                    <p className="client">Client</p>
                    <p>718-876-9054</p>
                    <p>jasonwinston@jwinston.com</p>
                  </div>
                </div>
                <div className="expirations-disiplay">
                  <div className="display">
                    <FontAwesomeIcon icon="desktop" />{" "}
                    <div>
                      Domain Expires <span></span>{" "}
                    </div>
                  </div>
                  <div className="display">
                    <FontAwesomeIcon icon="desktop" />{" "}
                    <div>
                      Hosting Expires <span></span>{" "}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bottom-panel">
                <div className="inner">
                  <div className="appdata-display">
                    <div className="item">
                      <FontAwesomeIcon icon="briefcase" />{" "}
                      <div>
                        <span>3</span> Projects
                      </div>
                    </div>
                    <div className="item">
                      <FontAwesomeIcon icon="list-ul" />{" "}
                      <div>
                        <span>3</span> Tasks
                      </div>
                    </div>
                    <div className="item">
                      <FontAwesomeIcon icon="user-plus" />{" "}
                      <div>
                        <span>3</span> Accounts
                      </div>
                    </div>
                    <div className="item">
                      <FontAwesomeIcon icon="user-plus" />{" "}
                      <div>
                        <span>3</span> Accounts
                      </div>
                    </div>
                  </div>
                  <div className="actions-display">
                    <FontAwesomeIcon
                      icon="edit"
                      onClick={() => props.showUpdateUserModal(user)}
                    />
                    <FontAwesomeIcon
                      icon="comments"
                      onClick={() => props.showNotifyUserModal(user)}
                    />
                    <FontAwesomeIcon
                      icon="trash"
                      onClick={() => props.showTrashUserModal(user)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  state = {
    actionModalIsOpen: true,
    createModalIsOpen: false,
    updateUserModalIsOpen: false,
    notifyUserModalIsOpen: false,
    trashUserBootboxIsOpen: false,
    activeUpdateUser: null,
    usersFilterTypeView: this.props && this.props.usersFilterTypeView,
    headerData: [
      {
        type: "users",
        centerheader: {
          type: "list",
          title: "All Users",
          subtitle: "List",
          list: [
            {
              icon: "list",
              viewchange: "list-view",
              action: this.props.changeUsersView,
              label: "List"
            },
            {
              icon: "calendar",
              viewchange: "calendar-view",
              action: this.props.changeUsersView,
              label: "Calendar"
            }
          ]
        },
        rightheader: [
          {
            type: "icon",
            icon: "user-cog",
            action: this.props.navigateToUsersPage,
            filterModalLink: null,
            navigatePageUrl: "/accounts"
          },
          {
            type: "icon",
            icon: "filter",
            action: this.props.toggleActionModal,
            filterModalLink: true,
            navigatePageUrl: null
          }
        ],
        actionsModalItems: {
          listType: "users",
          listItems: [
            {
              label: "All Members",
              filterTypeView: "all",
              action: this.props.changeFilterType
            },
            {
              label: "Clients",
              filterTypeView: "client",
              action: this.props.changeFilterType
            },
            {
              label: "Contractors",
              filterTypeView: "contractor",
              action: this.props.changeFilterType
            },
            {
              label: "Administrators",
              filterTypeView: "admin",
              action: this.props.changeFilterType
            }
          ]
        }
      }
    ],
    usersFilterList:
      this.props && this.props.appData && this.props.appData.users
        ? this.props.appData.users
        : null
  };

  showUpdateUserModal = theUser => {
    this.setState({
      updateUserModalIsOpen: !this.state.updateUserModalIsOpen,
      activeUpdateUser: theUser
    });
  };

  showNotifyUserModal = theUser => {
    this.setState({
      notifyUserModalIsOpen: !this.state.notifyUserModalIsOpen,
      activeUpdateUser: theUser
    });
  };

  showTrashUserModal = theUser => {
    this.setState({
      trashUserBootboxIsOpen: !this.state.trashUserBootboxIsOpen,
      activeUpdateUser: theUser
    });
  };

  noTrashUserModal = () => {
    this.setState({
      trashUserBootboxIsOpen: false
    });
  };

  toggleCreateModal = () => {
    this.setState({
      createModalIsOpen: true
    });
  };

  closeCreateModal = () => {
    this.setState({
      createModalIsOpen: !this.state.createModalIsOpen
    });
  };

  closeUpdateUserModal = () => {
    this.setState({
      updateUserModalIsOpen: !this.state.updateUserModalIsOpen
    });
  };

  closeNotifyUserModal = () => {
    this.setState({
      notifyUserModalIsOpen: !this.state.notifyUserModalIsOpen
    });
  };

  confirmUserDelete = () => {};

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("users", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          changeAccountView={this.props.changeAccountView}
          activeViewTab={this.state.activeViewTab}
          navigateToUsersPage={this.navigateToUsersPage}
          history={this.props.history}
        />
        <main className="app-body">
          <div className="app-body-inner">
            <UsersList
              showUpdateUserModal={this.showUpdateUserModal}
              showNotifyUserModal={this.showNotifyUserModal}
              showTrashUserModal={this.showTrashUserModal}
              theUsers={this.state.usersFilterList}
            />
          </div>
        </main>

        <CreateModal
          modalIsOpen={this.state && this.state.createModalIsOpen}
          closeCreateModal={this.closeCreateModal}
          title={
            <Fragment>
              <FontAwesomeIcon icon="user-plus" />
              <span>Add User</span>
            </Fragment>
          }
        />
        <UpdateUserModal
          activeUpdateUser={this.state.activeUpdateUser}
          modalIsOpen={this.state && this.state.updateUserModalIsOpen}
          closeUpdateUserModal={this.closeUpdateUserModal}
          title={
            <Fragment>
              <FontAwesomeIcon icon="user-cog" />
              <span>Update User</span>
            </Fragment>
          }
        />
        <UserNotifyModal
          activeUpdateUser={this.state.activeUpdateUser}
          modalIsOpen={this.state && this.state.notifyUserModalIsOpen}
          closeNotifyUserModal={this.closeNotifyUserModal}
          title={
            <Fragment>
              <FontAwesomeIcon icon="comments" />
              <span>Notify User</span>
            </Fragment>
          }
        />
        <BootBox
          message="Are you sure you want to delete this user?"
          show={
            this.state.trashUserBootboxIsOpen
              ? this.state.trashUserBootboxIsOpen
              : false
          }
          onYesClick={this.confirmUserDelete && this.confirmUserDelete}
          onNoClick={this.noTrashUserModal && this.noTrashUserModal}
          onClose={this.confirmUserDelete && this.confirmUserDelete}
        />

        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

const CreateModal = props => {
  console.log("CreateModal", props.modalIsOpen);
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    console.log("tempModalIsOpen", tempModalIsOpen);
    setTheModalIsOpen(tempModalIsOpen);
    props.closeCreateModal(tempModalIsOpen);
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
        <ModalBody>
          <UserFormFields
            createAppItem={props.createAppItem}
            updateAppItem={props.updateAppItem}
            toggle={toggleTheModal}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

const UpdateUserModal = props => {
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
    props.closeUpdateUserModal(tempModalIsOpen);
  };
  return (
    <Fragment>
      <Modal isOpen={props.modalIsOpen} toggle={toggleTheModal}>
        <ModalHeader toggle={toggleTheModal}>{props.title}</ModalHeader>
        <ModalBody>
          <UserFormFields
            theForm={props.activeUpdateUser && props.activeUpdateUser}
            toggle={toggleTheModal}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

const UserNotifyModal = props => {
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
    setTheModalIsOpen(tempModalIsOpen);
    props.closeNotifyUserModal(tempModalIsOpen);
  };
  return (
    <Fragment>
      <Modal isOpen={props.modalIsOpen} toggle={toggleTheModal}>
        <ModalHeader toggle={toggleTheModal}>{props.title}</ModalHeader>
        <ModalBody>User Notify Modal</ModalBody>
      </Modal>
    </Fragment>
  );
};

export default Users;
