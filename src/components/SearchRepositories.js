import React, { Component } from 'react';
import '../css/SearchRepositories.css';
import { FaSearch } from 'react-icons/fa';

class SearchRepositories extends Component {

    render() {
        return (
            <div className="container top-20">
                <div className="input-group">
                    <input name="queryText" type="text" className="form-control" aria-label="Search Repositories" placeholder="Search Repositories" 
                        maxLength="255"
                        onChange={ (e) => this.props.handleChange(e.target.value) }
                        value={this.props.queryText} 
                    />
                    <div className="input-group-append">
                        <button className="btn btn-primary" type="button" onClick={this.props.clickSearch} >
                        <FaSearch />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SearchRepositories;