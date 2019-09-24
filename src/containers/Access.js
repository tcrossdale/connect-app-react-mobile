import React, { Fragment, Component, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  FormError,
  FormText,
  FormProps,
  Input
} from "reactstrap";
import { authFetchToken, setUserAppData, fetchUserAppData } from "../actions";
import "../styles/access.scss";
import BootBox from "react-bootbox";
import { Preloader } from "../components/preloader-container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WelcomeScreenAccessBlock = ({ isLoading, history }) => {
  if (isLoading) {
    return <Preloader />;
  } else {
    return (
      <Fragment>
        <div className="welcome-screen-inner">
          <div className="access-links">
            <Button onClick={e => history.push("/login")}>Login</Button>
            <Button onClick={e => history.push("register")}>Sign Up</Button>
          </div>
        </div>
      </Fragment>
    );
  }
};
export class WelcomeScreen extends Component {
  state = {
    showLogoutConfirmbox: false,
    isOnline: true,
    hasSetAppContent: false,
    displayUser: {},
    hasContext: false,
    taskList: []
  };
  constructor(props) {
    super(props);
    this.props = props;
  }

  logout = () => {
    let confirmLogoutPromise = new Promise((resolve, reject) => {
      this.setState({
        showLogoutConfirmbox: true
      });
      resolve(true);
    });
  };
  yesLogout = () => {
    this.props.logoutUser().then(response => {
      this.props.history.push("login");
    });
  };
  handleClose = () => {
    this.setState({
      showLogoutConfirmbox: false
    });
  };

  componentDidMount = () => {
    let appData = localStorage.getItem("isLoggedIn")
      ? JSON.parse(localStorage.getItem("appData"))
      : null;
    let currentUser = null;

    if (appData) {
      currentUser = appData.currentUser;
      console.log("currentUser - ", currentUser);
      this.setState({
        displayUser: currentUser
      });
    } else {
      this.setState({
        displayUser: null
      });
    }
  };

  render() {
    return (
      <div className="welcome-screen">
        {this.state && this.state.displayUser ? (
          <div className="welcome-screen-inner">
            <div className="access-meta">
              {this.state.displayUser.avatar_urls && (
                <img src={this.state.displayUser.avatar_urls["96"]} />
              )}
              <h5>{this.state.displayUser.user_nicename}</h5>
              <div>
                <Button
                  onClick={() => {
                    this.props.history.push("/home");
                  }}
                >
                  Back to Dashboard
                </Button>
                <Button
                  onClick={() => {
                    this.logout();
                  }}
                >
                  Log Out
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <WelcomeScreenAccessBlock
            isLoading={
              this.props.appData.isLoading && this.props.appData.isLoading
            }
            history={this.props.history}
          />
        )}
        <BootBox
          message="Do you want to Continue?"
          show={
            this.state.showLogoutConfirmbox && this.state.showLogoutConfirmbox
          }
          onYesClick={this.yesLogout && this.yesLogout}
          onNoClick={this.handleClose && this.handleClose}
          onClose={this.handleClose && this.handleClose}
        />
      </div>
    );
  }
}

export const LoginScreen = props => {
  const [loginFormHasError, setLoginFormHasError] = useState(false);
  const [usernameHasError, setUsernameHasError] = useState(false);
  const [passwordHasError, setPasswordHasError] = useState(false);
  const [loginFormErrorMsg, setLoginFormErrorMsg] = useState(
    "Invalid Login Credentials"
  );

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });

  const onLoginInputChange = evt => {
    evt.preventDefault();

    let currentForm = { ...loginForm };
    currentForm[evt.currentTarget.getAttribute("id")] = evt.currentTarget.value;
    setLoginForm(currentForm);
  };

  const setUserInitLoggedIn = tokenedUserData => {
    fetchUserAppData(tokenedUserData).then(response => {
      props.setInitCachedAppDataMotion(response, props.history);
    });
  };

  const loginSubmit = evt => {
    evt.preventDefault();

    authFetchToken(loginForm).then(function(tokenLoginData) {
      switch (tokenLoginData.message) {
        case "success":
          localStorage.setItem("loginTime", tokenLoginData.loginTime);

          setUserInitLoggedIn(tokenLoginData);
          break;
        default:
          setLoginFormHasError(true);
          break;
      }
    });
  };

  return (
    <div className="login-screen">
      <div className="form-wrapper login-screen-inner">
        <Form onSubmit={e => loginSubmit}>
          <div className="google-login-btn ">
            <Button type="button" className="success">
              <FontAwesomeIcon icon="user" /> <span>Log in with Google</span>
            </Button>
          </div>
          {loginFormHasError === true ? (
            <FormText className="form-error">{loginFormErrorMsg}</FormText>
          ) : null}
          <FormGroup>
            <Input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={loginForm.username}
              onChange={e => onLoginInputChange(e)}
              invalid={usernameHasError === true}
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => onLoginInputChange(e)}
              invalid={passwordHasError === true}
            />
          </FormGroup>
          <FormGroup>
            <Button type="submit" onClick={e => loginSubmit(e)}>
              Login
            </Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
};

export const RegisterScreen = props => {
  const registerSubmit = () => {};

  const [registerForm, setRegisterForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "subscriber"
  });

  const onRegisterInputChange = evt => {
    evt.preventDefault();

    let currentForm = { ...registerForm };
    currentForm[evt.currentTarget.getAttribute("id")] = evt.currentTarget.value;
    setRegisterForm(currentForm);
  };
  return (
    <div className="register-screen">
      <div className="form-wrapper register-screen-inner">
        <Form onSubmit={e => registerSubmit}>
          <h4>Register</h4>
          <FormGroup>
            <Input
              type="text"
              id="userName"
              name="username"
              className="form-control"
              placeholder="Username"
              value={registerForm.username}
              onChange={e => onRegisterInputChange(e)}
            />
            <Input
              type="text"
              id="firstName"
              name="firstName"
              className="form-control"
              placeholder="First Name"
              value={registerForm.firstName}
              onChange={e => onRegisterInputChange(e)}
            />
            <Input
              type="text"
              id="lastName"
              name="lastName"
              className="form-control"
              placeholder="Last Name"
              value={registerForm.lastName}
              onChange={e => onRegisterInputChange(e)}
            />
            <Input
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              value={registerForm.email}
              onChange={e => onRegisterInputChange(e)}
            />
            <Input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className="form-control"
              placeholder="Phone Number"
              value={registerForm.phoneNumber}
              onChange={e => onRegisterInputChange(e)}
            />
          </FormGroup>
          <FormGroup>
            <Button onClick={e => registerSubmit(e)}>Register</Button>
            <Button onClick={() => props.history.push("login")}>Login</Button>
          </FormGroup>
        </Form>
      </div>
    </div>
  );
};
