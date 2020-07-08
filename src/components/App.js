import React, { Component } from 'react';
import '../css/App.css';
import AppHeader from './AppHeader';
import SearchRepositories from './SearchRepositories';
import ListRepositories from './ListRepositories';
import RepositoryDetails from './RepositoryDetails';
import Loading from './Loading';
import RequestLimit from './RequestLimit';

class App extends Component {

  constructor() {
    super();
    this.state = {
      // Search results functionality
      apiPaginatedUrl: '',
      apiBaseUrl: 'https://api.github.com/search/repositories?page=1&per_page=10&sort=stars&order=desc&q=',
      queryText: '',
      repositories: [],
      // Modals
      show: false,
      showLoading: false,
      showRequestLimit: false,
      // Repository details
      userBiography: '',
      lastForkBy: 'N/A',
      lastCommitters: [],
      repository: {
        id: '',
        name: '',
        owner: ''
      },
      // Pagination
      totalCount: 0,
      pagination: {
        first: '',
        last: '',
        next: '',
        prev: ''
      }
    };
    this.searchRepositories = this.searchRepositories.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showRepositoryDetails = this.showRepositoryDetails.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
  }

  /**
   * Set query value to state
  */
  handleChange(query) {
    this.setState({
        queryText: query
    }); 
  }

  /**
   * Everytime pagination buttons are clicked it needs to perform a new search
   * @param { GitHub API URL } url 
   */
  handlePagination(url) {
    if (url === "") {
      console.log("Nothing to do");
      return;
    }
    this.setState({
      apiPaginatedUrl: url
    }, () => this.searchRepositories());
  }

  /**
   * Performs a search agains GitHub API based on the input query text field
   * q: apache+language:scala
   * page: current page number
   * per_page: 10 max amount of reaults
   * 
   */
  searchRepositories() {
    // Performs validation
    if (this.state.queryText === "" && this.state.apiPaginatedUrl === "") {
      return;
    }
    this.showLoadingModal();
    let apiUrl = (this.state.apiPaginatedUrl === "") ? this.state.apiBaseUrl + this.state.queryText : this.state.apiPaginatedUrl;
    //console.log("Searching ..." + apiUrl);
    fetch(apiUrl)
      .then(response => {
          // Check rate limit
          let rateLimitRemainingHeader = response.headers.get('x-ratelimit-remaining');
          if (rateLimitRemainingHeader === 0) {
            this.showRequestLimitModal();
            throw new Error("X-RateLimit-Limit exceeded!");
          }
          // Grab link for pagination
          let linkHeader = response.headers.get('link');
          let paginationLinks = this.parseLinkHeader(linkHeader);
          this.setState({ pagination: paginationLinks });
        // Continue the process
        return response;
        })
      .then(response => response.json())
      .then(data => {
          this.setState({
            repositories: data.items,
            totalCount: data.total_count
          });
          
        })
      .catch(err => console.log('Error ' + err))
      .finally(() => this.hideLoadingModal());
  }

  /**
   * Return a dictionary of links, useful for pagination 
   * @param { Link } link e.g. 
   * link: 
   * <https://api.github.com/search/repositories?page=4&per_page=10&sort=stars&order=desc&q=java>; rel="prev", 
   * <https://api.github.com/search/repositories?page=6&per_page=10&sort=stars&order=desc&q=java>; rel="next", 
   * <https://api.github.com/search/repositories?page=100&per_page=10&sort=stars&order=desc&q=java>; rel="last", 
   * <https://api.github.com/search/repositories?page=1&per_page=10&sort=stars&order=desc&q=java>; rel="first"
   * 
   * @return e.g.
   * {
   * prev: "https://api.github.com/search/repositories?page=4&per_page=10&sort=stars&order=desc&q=java", 
   * next: "https://api.github.com/search/repositories?page=6&per_page=10&sort=stars&order=desc&q=java", 
   * last: "https://api.github.com/search/repositories?page=100&per_page=10&sort=stars&order=desc&q=java", 
   * first: "https://api.github.com/search/repositories?page=1&per_page=10&sort=stars&order=desc&q=java"
   * }
   */
  parseLinkHeader(link) {
    if (link.length === 0) {
      throw new Error("input must not be of zero length");
    }
  
    // Split parts by comma
    var parts = link.split(',');
    var links = {
      first: '',
      last: '',
      next: '',
      prev: ''
    };

    parts.forEach( p => {
      var section = p.split(';');
      if (section.length !== 2) {
        throw new Error("section could not be split on ';'");
      }
      var url = section[0].replace(/<(.*)>/, '$1').trim();
      var name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });
    
    return links;
  }

  /**
   * Set repository to be displayed on modal
   * @param { RepositoryDetails } repo 
   */
  showRepositoryDetails(repo) {
    this.setState({
      repository: repo
    });
    // Displays loding
    this.showLoadingModal();

    // Get user biography
    fetch(repo.owner.url)
      .then(response => response.json())
      .then(data => 
        this.setState({
          userBiography: data.bio
        })
      )
      .catch(error => console.log("Error fetching user biography " + error));

    // Get last 3 commiters
    let committersUrl = repo.commits_url.replace("{/sha}", "");
    fetch(committersUrl)
        .then(response => response.json())
        .then(data => {
            let maxCommitters = 0;
            let commiters = [];
            data.forEach(e => {
              if (maxCommitters === 3) return;
              e.committer.id = maxCommitters;
              commiters.push(e.committer);
              maxCommitters++;
            });
            this.setState({ lastCommitters: commiters });
        })
        .catch(error => console.log("Error fetching commiters " + error));
    
    // Get last fork user
    fetch(repo.forks_url)
      .then(response => response.json())
      .then(data => 
        this.setState({
          lastForkBy: data[0].owner.login
        })
      )
      .catch(error => console.log("Error fetching last fork " + error))
      .finally(() => {
        this.hideLoadingModal();
        this.showModal();
      });

    // Clear values
    this.setState({
      userBiography: '',
      lastForkBy: 'N/A',
      lastCommitters: []
    });
  }

  // Modals functions -------------------->
  // Repository details
  showModal = () => {
    this.setState({ show: true });
  };
  hideModal = () => {
    this.setState({ show: false });
  };
  // Loading
  showLoadingModal = () => {
    this.setState({ showLoading: true });
  };
  hideLoadingModal = () => {
    this.setState({ showLoading: false });
  };
  // Rate limit
  showRequestLimitModal = () => {
    this.setState({ showRequestLimit: true });
  };
  hideRequestLimitModal = () => {
    this.setState({ showRequestLimit: false });
  };
  // Modals functions -------------------->

  render() {
    return (
      <>
        <AppHeader />
        <SearchRepositories queryText={this.state.queryText} clickSearch={this.searchRepositories} handleChange={this.handleChange}/>
        <ListRepositories repositories={this.state.repositories} showRepositoryDetails={this.showRepositoryDetails} 
          totalCount={this.state.totalCount} pagination={this.state.pagination} handlePagination={this.handlePagination} />
        <RepositoryDetails repository={this.state.repository} handleClose={this.hideModal} show={this.state.show} 
          userBiography={this.state.userBiography} lastForkBy={this.state.lastForkBy} lastCommits={this.state.lastCommitters}
          />
        <Loading showLoading={this.state.showLoading} />
        <RequestLimit showRequestLimit={this.state.showRequestLimit} handleCloseRequestLimit={this.hideRequestLimitModal}/>
      </>
    );
  }
}

export default App;
