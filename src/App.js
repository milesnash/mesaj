import { API } from "aws-amplify";
import React, { Component } from "react";
import * as moment from "moment";
import logo from './logo.svg';
import './App.css';

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
    };

    this.sendMessageTimeoutHandle = 0;

    this.handleChange = this.handleChange.bind(this);
    this.handleMessageFormSubmit = this.handleMessageFormSubmit.bind(this);
  }

  componentDidMount() {
    API.get('messagesapi', '/messages')
      .then((messages) => {
        this.setState({
          isLoading: false,
          messages
        });
      })
      .catch((error) => {
        console.error(error.message || error);
        this.setState({
          serverError: true,
        })
      });
  }

  componentWillUnmount() {
    clearTimeout(this.sendMessageTimeoutHandle);
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

    const { content, to } = this.state;
    // Validation
    // POST to API
    console.log(content, to);

    this.sendMessageTimeoutHandle = setTimeout(() => {
      this.setState((prevState) => {
        return {
          messages: [
            ...prevState.messages,
            {
              id: Math.round(Math.random() * 1000),
              sentAt: moment().unix(),
              status: "Sent",
              to,
              content
            }
          ],
          sendingMessage: false,
        };
      });
    }, 3000);
  }

  render() {
    const {
      content,
      isLoading,
      messages,
      to,
      sendingMessage,
      serverError,
    } = this.state;

    return (
      <div className="container-fluid App">
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
                {!!messages.length &&
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
      </div>
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
