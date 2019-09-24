import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "react-calendar";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { AccountFormFields } from "../components/forms";
import {
  CreateAccountForm,
  UpdateAccountForm,
  FormUserOptions,
  FormPostOptions
} from "../components/forms";
import { Preloader } from "../components/preloader-container";
import { setInputChange } from "../components/forms";
import {
  TabContent,
  TabPane,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Form,
  FormGroup,
  FormText,
  Button,
  Label
} from "reactstrap";
import "../styles/accounts.scss";

class Accounts extends Component {
  state = {
    actionModalIsOpen: this.props && this.props.actionModalIsOpen,
    createModalIsOpen: this.props && this.props.createModalIsOpen,
    accountsFilterTypeView: this.props && this.props.accountsFilterTypeView,
    accountsEditModalIsOpen: this.props && this.props.accountsEditModalIsOpen,
    accountEditItem: this.props && this.props.accountEditItem,
    headerData: [
      {
        type: "accounts",
        centerheader: {
          type: "list",
          title: "All Accounts",
          subtitle: "List",
          list: [
            {
              icon: "list",
              viewchange: "list-view",
              action: this.props.changeAccountView,
              label: "List"
            },
            {
              icon: "calendar",
              viewchange: "calendar-view",
              action: this.props.changeAccountView,
              label: "Calendar"
            }
          ]
        },
        rightheader: [
          {
            type: "icon",
            icon: "user-friends",
            action: this.props.navigateToUsersPage,
            filterModalLink: null,
            navigatePageUrl: "/users"
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
          listType: "tasks",
          listTitle: "Filter Accounts by Expiration Dates",
          listItems: [
            {
              label: "15 Days",
              filterTypeView: "15days",
              action: this.props.changeFilterType
            },
            {
              label: "1 Month",
              filterTypeView: "1month",
              action: this.props.changeFilterType
            },
            {
              label: "3 Months",
              filterTypeView: "3months",
              action: this.props.changeFilterType
            },
            {
              label: "6 Months",
              filterTypeView: "6moths",
              action: this.props.changeFilterType
            },
            {
              label: "3 Months",
              filterTypeView: "year",
              action: this.props.changeFilterType
            }
          ]
        }
      }
    ],
    accountsFilterList:
      this.props &&
      this.props.accountsFilterList &&
      this.props.appData.accountsFilterList
        ? this.props.appData.accountsFilterList
        : this.props.appData.accounts
  };

  toggleAccountEditModal = accountItem => {
    this.setState({
      accountsEditModalIsOpen: !this.state.accountsEditModalIsOpen,
      accountEditItem: accountItem
    });
  };

  updateAppItem = theItem => {
    this.props.updateAppItem(theItem, "accounts");
  };

  createAppItem = theItem => {
    this.props.createAppItem(theItem, "accounts");
  };

  onInputChange = (evt, theForm) => {
    let updatedForm = setInputChange(evt, theForm);
    this.setState({
      accountEditItem: updatedForm
    });
  };

  closeAccountEditModal = () => {
    this.setState({
      editModalIsOpen: false
    });
  };

  closeCreateModal = newStatus => {
    this.setState({
      createModalIsOpen: newStatus
    });
  };

  getEditItemAccountsList = listItem => {
    let editedList = null;
    console.log("The List ITEM - ", listItem);
    if (listItem) {
      let content = listItem.content && listItem.content.rendered;
      let title = listItem.title && listItem.title.rendered;

      let currentForm = {
        ...listItem
      };
      delete currentForm.title;
      delete currentForm.content;
      delete currentForm.guid;
      delete currentForm._links;
      currentForm["title"] = title;
      currentForm["content"] = content;
      editedList = currentForm;
    }
    return editedList;
  };

  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <div className="app-container">
        <Header
          headerData={this.state.headerData}
          appData={this.props.appData && this.props.appData}
          toggleMainModal={this.props.toggleMainModal}
          theHeader={getHeaderType("accounts", this.state.headerData)}
          changeFilterType={this.props.changeFilterType}
          changeAccountView={this.props.changeAccountView}
          activeViewTab={this.state.activeViewTab}
          navigateToUsersPage={this.navigateToUsersPage}
          history={this.props.history}
        />
        <main className="app-body">
          <div className="app-body-inner">
            <Preloader
              isLoading={
                this.props && this.props.appData && this.props.appData.isLoading
              }
            />
            <TabContent activeTab={this.state.accountsFilterTypeView}>
              <TabPane tabId="list-view">
                <AccountsList
                  isLoading={
                    this.props &&
                    this.props.appData &&
                    this.props.appData.isLoading
                  }
                  appData={this.props.appData && this.props.appData}
                  accountsFilterList={
                    this.state && this.state.accountsFilterList
                  }
                  accountsFilterTypeView={
                    this.state && this.state.accountsFilterTypeView
                  }
                  accountEditItem={this.state.accountEditItem}
                  toggleAccountEditModal={this.toggleAccountEditModal}
                  closeAccountEditModal={this.closeAccountEditModal}
                  deleteItemBootbox={this.props.deleteItemBootbox}
                />
              </TabPane>
              <TabPane tabId="calendar-view">
                <Calendar />
              </TabPane>
            </TabContent>

            <AccountEditModal
              appData={this.props.appData}
              accountsEditModalIsOpen={this.state.accountsEditModalIsOpen}
              toggleAccountEditModal={this.toggleAccountEditModal}
              updateAppItem={this.updateAppItem}
              createAppItem={this.createAppItem}
              deleteItemBootbox={this.deleteItemBootbox}
              onInputChange={this.onInputChange}
              accountEditItem={this.getEditItemAccountsList(
                this.state.accountEditItem
              )}
            />
            <CreateModal
              appData={this.props.appData}
              modalIsOpen={this.state.createModalIsOpen}
              closeCreateModal={this.closeCreateModal}
              updateAppItem={this.updateAppItem}
              createAppItem={this.createAppItem}
              onInputChange={this.onInputChange}
              accountEditItem={this.getEditItemAccountsList(
                this.state.accountEditItem
              )}
            />
          </div>
        </main>
        <Footer
          urlParam={this.props.match && this.props.match}
          appData={this.props.appData && this.props.appData}
        />
      </div>
    );
  }
}

const AccountEditModal = props => {
  return (
    <Modal
      isOpen={props && props.accountsEditModalIsOpen}
      toggle={props.toggleAccountEditModal}
    >
      <ModalHeader toggle={props.toggleAccountEditModal}>
        <span>
          {props && props.accountEditItem && props.accountEditItem.title
            ? props.accountEditItem.title
            : ""}
        </span>
      </ModalHeader>
      <AccountFormFields
        appData={props & props.appData}
        theForm={props && props.accountEditItem && props.accountEditItem}
        onInputChange={props && props.onInputChange}
        updateAppItem={props.updateAppItem}
        createAppItem={props.createAppItem}
        isOpen={props && props.accountsEditModalIsOpen}
        toggle={props.toggleAccountEditModal}
      />
    </Modal>
  );
};

const AccountsList = props => {
  const AccountItem = ({ appData, account, index }) => {
    let accountDate = new Date(account.date);
    let theDateDisplay = `${accountDate.getMonth() +
      1}/${accountDate.getDate()}/${accountDate.getFullYear()}`;
    let returnItem = null;

    const onClickItem = evt => {
      const theParent = evt.currentTarget
          .closest(".inner")
          .closest("li")
          .closest("ul"),
        theListItems = theParent.querySelectorAll("li");
      theListItems.forEach((item, index) => {
        if (item == evt.currentTarget.closest(".inner").closest("li")) {
          item.classList.toggle("active");
        } else {
          item.classList.remove("active");
        }
      });
    };

    const editAccountItem = account => {
      props.toggleAccountEditModal(account);
    };

    const deleteItemBootbox = account => {
      props.deleteItemBootbox(account, "account");
    };

    if (account) {
      returnItem = (
        <li key={index} className="display-item account-item">
          <div className="inner">
            <div className="left" onClick={e => onClickItem(e)}>
              <FontAwesomeIcon icon="angle-down" />
              <h5>{account.title.rendered}</h5>
            </div>
            <div className="right">
              <span className="display">{theDateDisplay}</span>
              <div className="action-panel">
                <span className="edit" onClick={() => editAccountItem(account)}>
                  <FontAwesomeIcon icon="pencil-alt" />
                </span>
                <span
                  className="trash"
                  onClick={() => deleteItemBootbox(account)}
                >
                  <FontAwesomeIcon icon="trash" />
                </span>
              </div>
            </div>
          </div>
          <AccountDetailPanel appData={appData} account={account} />
        </li>
      );
    } else {
      returnItem = <Fragment></Fragment>;
    }
    return returnItem;
  };

  const AccountDetailPanel = props => {
    let theAccountUser = null;

    if (props.account.assigneeid) {
      let userIndex =
        props.appData &&
        props.appData.users &&
        props.appData.users.findIndex(user => {
          return user.id === props.account.assigneeid;
        });
      theAccountUser = props.appData.users[userIndex];
    }

    const formatAccountItem = theItem => {
      let updatedItem = { ...theItem };

      updatedItem && updatedItem.hosting_registration_date === "0000-00-00"
        ? (updatedItem["hosting_registration_date"] = "")
        : null;
      updatedItem && updatedItem.hosting_expiration_date === "0000-00-00"
        ? (updatedItem["hosting_expiration_date"] = "")
        : null;
      updatedItem && updatedItem.domain_registration_date === "0000-00-00"
        ? (updatedItem["domain_registration_date"] = "")
        : null;
      updatedItem && updatedItem.domain_expiration_date === "0000-00-00"
        ? (updatedItem["domain_expiration_date"] = "")
        : null;

      // let hostRegDate = new Date(updatedItem.hosting_registration_date);
      // let hostExpDate = new Date(updatedItem.hosting_registration_date);
      // let domRegDate = new Date(updatedItem.hosting_registration_date);
      // let domExpDate = new Date(updatedItem.hosting_registration_date);
      // console.log("hostRegDate", hostRegDate);
      // if (hostRegDate == "Invalid Date") {
      //   console.log("Invalid DATE");
      // }

      theItem = { ...updatedItem };
      console.log("Updated Item - ", updatedItem);
      return theItem;
    };

    let theUpdatedItem = formatAccountItem(props && props.account);

    const [theAccount, setTheAccount] = useState(
      formatAccountItem(props.account)
    );

    return (
      <div className="account-detail-panel">
        {theAccountUser ? (
          <div className="account-user">
            <span>
              <img src={theAccountUser.avatar_urls["96"]} />
            </span>
            <h5>{theAccountUser.name}</h5>
          </div>
        ) : null}
        <div className="details-inner">
          {theAccount.ftp_url !== "" ? (
            <div className="item">
              <span>FTP URL</span>
              <span>{theAccount.ftp_url}</span>
            </div>
          ) : null}
          {theAccount.ftp_username !== "" ? (
            <div className="item">
              <span>FTP Username</span>
              <span>{theAccount.ftp_username}</span>
            </div>
          ) : null}
          {theAccount.ftp_password !== "" ? (
            <div className="item">
              <span>FTP Password</span>
              <span>{theAccount.ftp_password}</span>
            </div>
          ) : null}
          {theAccount.wp_url !== "" ? (
            <div className="item">
              <span>WP URL</span>
              <span>{theAccount.wp_url}</span>
            </div>
          ) : null}
          {theAccount.wp_username !== "" ? (
            <div className="item">
              <span>WP Username</span>
              <span>{theAccount.wp_username}</span>
            </div>
          ) : null}
          {theAccount.wp_password !== "" ? (
            <div className="item">
              <span>WP Password</span>
              <span>{theAccount.wp_password}</span>
            </div>
          ) : null}
          {theAccount.domain_provider && theAccount.domain_provider[0] ? (
            <div className="item">
              <span>Domain Provider</span>
              <span>{theAccount.domain_provider[0]}</span>
            </div>
          ) : null}
          {theAccount.domain_registration_date !== "" ? (
            <div className="item">
              <span>Domain Registration</span>
              <span>{theAccount.domain_registration_date}</span>
            </div>
          ) : null}
          {theAccount.domain_expiration_date !== "" ? (
            <div className="item">
              <span>Domain Expiration</span>
              <span>{theAccount.domain_expiration_date}</span>
            </div>
          ) : null}
          {theAccount.hosting_provider && theAccount.hosting_provider[0] ? (
            <div className="item">
              <span>Hosting Provider</span>
              <span>{theAccount.hosting_provider[0]}</span>
            </div>
          ) : null}
          {theAccount.hosting_provider_username !== "" ? (
            <div className="item">
              <span>Hosting Provider Username</span>
              <span>{theAccount.hosting_provider_username}</span>
            </div>
          ) : null}
          {theAccount.hosting_provider_password !== "" ? (
            <div className="item">
              <span>Hosting Provider Password</span>
              <span>{theAccount.hosting_provider_password}</span>
            </div>
          ) : null}
          {theAccount.hosting_registration_date !== "" ? (
            <div className="item">
              <span>Hosting Registration</span>
              <span>{theAccount.hosting_registration_date}</span>
            </div>
          ) : null}
          {theAccount.hosting_expiration_date !== "" ? (
            <div className="item">
              <span>Hosting Expiration</span>
              <span>{theAccount.hosting_expiration_date}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <ul className="default-display-list accounts-list">
        {props && props.accountsFilterList
          ? props.accountsFilterList.map((account, index) => (
              <AccountItem
                appData={props && props.appData}
                key={index}
                account={account}
                index={index}
              />
            ))
          : null}
      </ul>
    </Fragment>
  );
};

const CreateModal = props => {
  const [theModalIsOpen, setTheModalIsOpen] = useState(
    props.modalIsOpen ? props.modalIsOpen : false
  );
  const toggleTheModal = () => {
    let tempModalIsOpen = !theModalIsOpen;
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
        <AccountFormFields
          title="Create Account"
          createAppItem={props.createAppItem}
          updateAppItem={props.updateAppItem}
          toggle={toggleTheModal}
        />
      </Modal>
    </Fragment>
  );
};

export default Accounts;
