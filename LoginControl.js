import React, { Component } from 'react';

async function signIn() {
  
  var strWindowFeatures = "location=yes,height=570,width=1120,scrollbars=yes,status=yes, credentials: omit";
  var win = window.open(url, "_blank", strWindowFeatures);
  let response = '';

  return await new Promise(resolve => {
    const timer = setInterval(() => {
      if (win.closed) {
        response = chrome.runtime.sendMessage({ type: "login_status" });
        console.log(response);
        resolve(response);
        clearInterval(timer);
        return response;
      }
    }, 500);
  });
}

function getCurrentTab(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  },
    (tabs) => {
      callback(tabs[0]);
    });
}

export default class LoginControl extends Component {
  constructor(props) {
    super(props);
    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.state = {
      isLoggedIn: false,
      isIntegrated: false
    };
    this.username = '';
    this.tabMessage = '';
  }

  handleLoginClick() {
    signIn().then((username) => {
      if (username) {
        this.setState({ isLoggedIn: true });
        this.username = username;
      }
    });
  }

  handleLogoutClick() {
    this.setState({ isLoggedIn: false });
  }

  handleCreateAccount(e) {
    e.preventDefault();
    signIn().then((username) => {
      if (username) {
        this.setState({ isLoggedIn: true });
        this.username = username;
      }
    });
  }

  componentDidMount() {
    chrome.runtime.sendMessage({ type: "login_status" }).then((username) => {
      console.log(username);
      if (username) {
        this.setState({ isLoggedIn: true });
        this.username = username;
      }
    });
    getCurrentTab((tab) => {
      if (tab) {
        console.log(tab.url);

        if (tab.url.includes('://calendar.google.com/')) {
          this.setState({ isIntegrated: true });
          this.tabMessage = <p>Attach Flowcaster meeting and <br />review session when you create events</p>;
        }
        else if (tab.url.includes('://mail.google.com/')) {
          this.setState({ isIntegrated: true });
          this.tabMessage = <p>Schedule Flowcaster meeting from <br />side bar</p>;
        }
        else if (tab.url.includes('://contacts.google.com/')) {
          this.setState({ isIntegrated: true });
          this.tabMessage = <p>Direct call to your contacts with<br />Flowcaster and review session</p>;
        }
        else if (tab.url.includes('.google.com/')) {
          this.setState({ isIntegrated: true });
          this.tabMessage = <p>Get Flowcaster meeting and review <br /> session link in tools</p>;

        }
      }
    });
  }
  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    if (isLoggedIn) {
      button = <LogoutButton onClick={this.handleLogoutClick} />;
    } else {
      button = <div>
        <LoginButton onClick={this.handleLoginClick} />
        <CreateAccountLink onClick={this.handleCreateAccount} />
      </div>;
    }

    return (
      <div>
        <Greeting isLoggedIn={isLoggedIn} isIntegrated={this.state.isIntegrated} username={this.username} message={this.tabMessage} createClicked={this.handleCreateAccount} />
        {button}
      </div>
    );
  }
}
