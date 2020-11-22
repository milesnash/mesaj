import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="container-fluid App">
      <div className="row align-items-center justify-content-center min-vh-100">
        <div className="col-md-4">
          <h2>
            Send a message{" "}
            <img src={logo} className="form-header-img" alt="logo" />
          </h2>
          <form name="form">
            <div className="form-group">
              <label htmlFor="to">To</label>
              <input
                type="text"
                className="form-control"
                name="to"
                required
                placeholder="e.g. 447700900000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="body">Message</label>
              <textarea
                className="form-control"
                name="body"
                maxLength="140"
                required
                placeholder="Enter your message..."
              ></textarea>
            </div>
            <div className="form-group">
              <button className="btn btn-primary">Send</button>
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
              <tr>
                <th scope="row">Seconds ago</th>
                <td>Sent</td>
                <td>07700900002</td>
                <td>The rain in Spain falls mainly on the plain.</td>
              </tr>
              <tr>
                <th scope="row">Seconds ago</th>
                <td>Sent</td>
                <td>07700900001</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  eu tempus nisi, sed maximus arcu.
                </td>
              </tr>
              <tr>
                <th scope="row">Ages ago</th>
                <td>Sent</td>
                <td>07700900000</td>
                <td>Texty McTextface</td>
              </tr>
              <tr>
                <th scope="row">Seconds ago</th>
                <td>Sent</td>
                <td>07700900002</td>
                <td>The rain in Spain falls mainly on the plain.</td>
              </tr>
              <tr>
                <th scope="row">Seconds ago</th>
                <td>Sent</td>
                <td>07700900001</td>
                <td>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  eu tempus nisi, sed maximus arcu.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
