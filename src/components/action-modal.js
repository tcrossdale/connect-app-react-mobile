import React, { Fragment } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ActionModal = props => {
  const TheActionList = props => {
    const renderAction = (theAction, theFilterType, theFilterTypeView) => {
      let currAction = theAction;
      currAction(theFilterType, theFilterTypeView);
    };

    const SubListItems = props => {
      let theHTML = (
        <ul className="sublist-items">
          {props.subListItems &&
            props.subListItems.map((subItem, theIndex) => (
              <li
                key={theIndex}
                onClick={() =>
                  renderAction(
                    subItem.action,
                    props.actionModalItemsList.listType,
                    theItem.filterTypeView
                  )
                }
                className={
                  props.filterTypeView &&
                  subItem.filterTypeView === props.filterTypeView
                    ? "active"
                    : null
                }
              >
                <div className="inner">
                  <span>{subItem.label}</span>
                  <div className="check-icon">
                    <FontAwesomeIcon icon="check" />
                  </div>
                  <div className="dropdown-icon">
                    <FontAwesomeIcon icon="angle-right" />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      );
      return theHTML;
    };
    return (
      <Fragment>
        {props.actionModalItemsList && props.actionModalItemsList.listTitle ? (
          <h5 className="modal-filter-header">
            {props.actionModalItemsList.listTitle}
          </h5>
        ) : null}
        <ul>
          {Array.isArray(props.actionModalItemsList.listItems) &&
            props.actionModalItemsList.listItems.map((item, index) => (
              <li
                key={index}
                onClick={() =>
                  renderAction(
                    item.action,
                    props.actionModalItemsList.listType,
                    item.filterTypeView
                  )
                }
                className={
                  props.filterTypeView &&
                  item.filterTypeView === props.filterTypeView
                    ? "active"
                    : null
                }
              >
                <div
                  className={
                    item.subListItems ? "inner has-sublist-items" : "inner"
                  }
                >
                  <span>{item.label}</span>
                  <div className="check-icon">
                    <FontAwesomeIcon icon="check" />
                  </div>
                  <div className="dropdown-icon">
                    <FontAwesomeIcon icon="angle-right" />
                  </div>
                </div>
                <SubListItems
                  actionModalItemsList={props.actionModalItemsList}
                  filterTypeView={props.filterTypeView}
                  subListItems={item.subListItems && item.subListItems}
                />
              </li>
            ))}
        </ul>
      </Fragment>
    );
  };

  return (
    <Modal
      isOpen={props.actionModalIsOpen}
      toggle={props.toggleActionModal}
      id="action-modal"
    >
      <ModalBody>
        <TheActionList
          actionModalItemsList={
            props.actionModalItemsList && props.actionModalItemsList
          }
          filterTypeView={props.filterTypeView && props.filterTypeView}
        />
      </ModalBody>
    </Modal>
  );
};

export default ActionModal;
