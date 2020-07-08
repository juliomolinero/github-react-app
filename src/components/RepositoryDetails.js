import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";
import ListGroup from 'react-bootstrap/ListGroup';
import '../css/RepositoryDetails.css';

class RepositoryDetails extends Component {

    render() {
        return (
            <Modal show={this.props.show} animation={false} size="lg">
                <Modal.Header className="justify-content-center"><h3>{this.props.repository.name}</h3></Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-2">
                            <img className="avatar" src={this.props.repository.owner.avatar_url} alt="Profile" />
                        </div>
                        <div className="col-md-10 div-wrapper">
                            <div>
                                <label><b>Last 3 commits by:&nbsp;</b></label>
                                <ListGroup>
                                {this.props.lastCommits.map(commit => (
                                    <ListGroup.Item key={commit.id}>{commit.login}</ListGroup.Item>
                                ))}
                                </ListGroup>
                            </div>
                            <hr/>
                            <p>
                                <label><b>The last fork was created by:&nbsp;</b></label>
                                <span>{this.props.lastForkBy}</span>
                            </p>
                            <hr/>
                            <p>
                                <label><b>The owner has this in their biography:&nbsp;</b></label>
                                <span>{this.props.userBiography}</span>
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-primary" onClick={this.props.handleClose}>Close</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RepositoryDetails;