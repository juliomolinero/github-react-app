import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import { FaDatabase } from 'react-icons/fa';

class Loading extends Component {

    render() {
        return (
            <Modal show={this.props.showLoading} animation={false} size="md">
                <Modal.Header/>
                <Modal.Body>
                    <div className="message">
                        <FaDatabase color="#377bb5"/>&nbsp;&nbsp;&nbsp;Loading, please wait ...
                    </div>
                </Modal.Body>
                <Modal.Footer />
            </Modal>
        );
    }
}

export default Loading;