import Amplify, { API } from "aws-amplify";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { AmplifyAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import React, { Component } from "react";
import * as moment from "moment";
import logo from './logo.svg';
import './App.css';

import awsconfig from "./aws-exports";

Amplify.configure(awsconfig);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      messages: [],
      sendingMessage: false,
      serverError: false,
      to: "",
      content: "",
      updateSentText: true,
      authState: "signin",
      user: undefined,
    };

    this.updateSentTextHandle = 0;

    this.handleChange = this.handleChange.bind(this);
    this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.updateSentText = this.updateSentText.bind(this);
  }

  componentDidMount() {
    onAuthUIStateChange((nextAuthState, user) => {
      const { authState } = this.state;

      if (nextAuthState === authState) {
        return;
      }

      if (nextAuthState === AuthState.SignedIn) {
        this.getMessages();
        this.updateSentTextHandle = setInterval(() => {
          this.updateSentText();
        }, 60000);
      }

      if (nextAuthState === AuthState.SignedOut) {
        clearInterval(this.updateSentTextHandle);
      }

      this.setState({
        authState: nextAuthState,
        user,
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.updateSentTextHandle);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleMessageFormSubmit(event) {
    event.preventDefault();
    this.setState({
      sendingMessage: true,
    });

    const { content, to } = this.state; // TODO: Validation

    this.sendMessage({ content, to });
  }

  getMessages() {
    API.get("messagesapi", "/messages")
      .then((messages) => {
        messages = messages || [];
        messages.sort((a, b) => a.sentAt < b.sentAt ? -1 : 1)
        this.setState({
          isLoading: false,
          messages,
        });
      })
      .catch((error) => {
        console.error(error.message || error);
        this.setState({
          serverError: true,
        });
      });
  }

  sendMessage(message) {
    API.post("messagesapi", "/messages", {
      body: message,
    })
      .then((message) => {
        this.setState({
          sendingMessage: false,
        });

        this.getMessages();
      })
      .catch((error) => {
        console.error(error.message || error);
        this.setState({
          serverError: true,
        });
      });
  }

  updateSentText() {
    const { updateSentText } = this.state;

    this.setState({
      updateSentText: !!updateSentText
    })
  }

  render() {
    const {
      authState,
      content,
      isLoading,
      messages,
      to,
      sendingMessage,
      serverError,
      updateSentText,
      user,
    } = this.state;

    return authState === AuthState.SignedIn && user ? (
      <div className="App">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-center min-vh-100">
            <div className="col-md-4">
              <h2>
                Send a message{" "}
                <img src={logo} className="form-header-img" alt="logo" />
              </h2>
              <form name="form" onSubmit={this.handleMessageFormSubmit}>
                <div className="form-group">
                  <label htmlFor="to">To</label>
                  <input
                    type="text"
                    className="form-control"
                    name="to"
                    required
                    placeholder="e.g. 07700900000"
                    value={to}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="body">Message</label>
                  <textarea
                    className="form-control"
                    name="content"
                    maxLength="140"
                    required
                    placeholder="Enter your message..."
                    value={content}
                    onChange={this.handleChange}
                  ></textarea>
                </div>
                <div className="form-group">
                  <button
                    className="btn btn-primary"
                    disabled={sendingMessage || serverError}
                  >
                    {sendingMessage && (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    )}{" "}
                    Send
                  </button>
                </div>
              </form>
              <small className="text-muted">
                Icons made by{" "}
                <a href="http://www.freepik.com/" title="Freepik">
                  Freepik
                </a>{" "}
                from{" "}
                <a href="https://www.flaticon.com/" title="Flaticon">
                  www.flaticon.com
                </a>
              </small>
            </div>
            <div className="col-md-8">
              <h2>Messages</h2>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">Sent</th>
                    <th scope="col">Status</th>
                    <th scope="col">Recipient No.</th>
                    <th scope="col">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {updateSentText &&
                    !!messages.length &&
                    messages.map((message) => (
                      <tr key={message.id}>
                        <th scope="row">
                          {moment.unix(message.sentAt).fromNow()}
                        </th>
                        <td>{message.status}</td>
                        <td>{message.to}</td>
                        <td>{message.content}</td>
                      </tr>
                    ))}
                  {!messages.length && (
                    <tr>
                      <th colSpan="4" scope="row">
                        <div className="d-flex justify-content-center">
                          {serverError ? (
                            "Failed to retrieve messages from the server 😭"
                          ) : isLoading ? (
                            <LoadingSpinner />
                          ) : (
                            "You haven't send a message yet!"
                          )}
                        </div>
                      </th>
                    </tr>
                  )}
                  {sendingMessage && !isLoading && (
                    <tr>
                      <th colSpan="4" scope="row">
                        <div className="d-flex justify-content-center">
                          <LoadingSpinner />
                        </div>
                      </th>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <AmplifySignOut />
        </div>
      </div>
    ) : (
      <AmplifyAuthenticator usernameAlias="email" />
    );
  }
}

function LoadingSpinner() {
  return (
    <div className="spinner-grow" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default App;
