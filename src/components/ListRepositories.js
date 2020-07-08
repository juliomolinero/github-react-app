import React, { Component } from 'react';
import { FaStar } from 'react-icons/fa';
import Pagination from 'react-bootstrap/Pagination';
import '../css/ListRepositories.css';

class ListRepositories extends Component {
    
    render() {
        let pagination = this.props.pagination;
        //console.log(pagination);
        
        let paginationComponent = (
            <Pagination size="lg" className="justify-content-center">
                <Pagination.Prev url={pagination.prev} onClick={() => this.props.handlePagination(pagination.prev)}> Prev</Pagination.Prev>
                <Pagination.Next url={pagination.next} onClick={() => this.props.handlePagination(pagination.next)}> Next</Pagination.Next>
            </Pagination>
        );

        return (
            <div className="container top-30">
                <table className="table table-hover">
                <thead className="thead-dark">
                    <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Stars</th>
                    <th scope="col">Link</th>
                    <th scope="col">Details</th>
                    </tr>
                </thead>
                <tbody>
                {this.props.repositories.map(repo => (
                    <tr key={repo.id}>
                        <td>{repo.name}</td>
                        <td>{repo.owner.login}</td>
                        <td><FaStar /> {repo.stargazers_count}</td>
                        <td>
                            <a href={repo.url}>{repo.full_name}</a>
                        </td>
                        <td>
                            <a href="/#"
                                onClick={() => this.props.showRepositoryDetails(repo)}
                            >Details</a>
                        </td>
                    </tr>
                ))}
                </tbody>
                {this.props.totalCount > 10 &&
                <tfoot>
                    <tr>
                        <td colSpan="5">
                        {paginationComponent}
                        </td>
                    </tr>
                </tfoot>
                }
                </table>
            </div>
        );
    }
}

export default ListRepositories;