import React, { Component } from 'react';
import '../css/AppHeader.css';

class AppHeader extends Component {
    render() {
        return (
            <header className="app-header">
                <div className="container row">
                    <div className="col-md-3">
                        <img className="app-logo img-responsive" src="./github_logo.jpeg" alt="Github" />
                    </div>
                    <div className="col-md-9 d-flex align-items-center">
                        <h2>GitHub Repository List</h2>
                    </div>
                </div>
            </header>
        );
    }
}

export default AppHeader;