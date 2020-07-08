import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import '../css/RequestLimit.css';

class RequestLimit extends Component {

    render() {
        return (
            <Modal show={this.props.showRequestLimit} animation={false} size="lg">
                <Modal.Header className="justify-content-center"><h3>No more requests available</h3></Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-3">
                            <img className="sad-avatar" src='./sad.png' alt="No more requests at the moment" />
                        </div>
                        <div className="col-md-9 d-flex align-items-center">
                            <h5>
                                Ouch!, it seems you have reached out the limit to perform requests, please try again in a minute.
                            </h5>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.props.handleCloseRequestLimit}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RequestLimit;