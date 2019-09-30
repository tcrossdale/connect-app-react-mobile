import React, { Component, Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header, { getHeaderType } from "../components/main-header";
import Footer from "../components/main-footer";
import { Preloader } from "../components/preloader-container";
class Inbox extends Component {
  state = {
    actionModalIsOpen: true,
    filterTypeView: "inbox",
    headerData: [
      {
        type: "inbox",
        centerheader: {
          type: "list",
          title: "My Inbox",
          subtitle: "List",
          list: [
            {
              icon: "list",
              action: null,
              label: "List"
            },
            {
              icon: "calendar",
              action: null,
              label: "Calendar"
            }
          ]
        },
        rightheader: [
          {
            type: "icon",
            icon: "filter",
            action: null,
            filterModalLink: true
          }
        ]
      }
    ]
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
          theHeader={getHeaderType("inbox", this.state.headerData)}
        />
        <main className="app-body">
          <div className="app-body-inner">
            <Preloader
              isLoading={this.props.appData && this.props.appData.isLoading}
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

export default Inbox;
