/**
 * This is Higher Order Component (HOC) for Admin panel
 * Each component which requries authenticated user can use this HOC
 * It will check for auth status on load of each component and act respectively
 * Also listens to auth state change event, if at any point of time auth changes, it will put back to login
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';

 const getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }


export default function (ComposedComponent) {

  class Authentication extends Component {
    constructor(props) {
      super(props);
      this.handleNotLoggedInState = this.handleNotLoggedInState.bind(this);
    }

    /**
     * On load of HOC check for auth status, if fails put back to login
     * If succeeds, start auth listener
     * @memberof Authentication
     */
    componentWillMount() {
    
        const token = localStorage.getItem('accessToken');
        if (!token) {
            this.handleNotLoggedInState();
        } 
      
    }

    /**
     * set stores state and selectedStore state
     *
     * @memberof Authentication
     */
    getAllStoresAndSelectStore() {
      this.props.getStores(this.props.user.user_id)
        .then(() => {
          if (this.props.match.params.storeId) {
            this.props.selectStore(this.props.stores.find(store => store.id === this.props.match.params.storeId));
          } else {
            this.props.selectStore(this.props.stores[0]);
          }
        });
    }

    /**
     * Handle not logged in state
     *
     * @memberof Authentication
     */
    handleNotLoggedInState() {
        this.props.changePage("login");
    }

    /**
     * Renders HOC and composed components
     * Adds Header and Sidebar for components which uses is authed state
     * @returns
     * @memberof Authentication
     */
    render() {
      return ( < ComposedComponent { ...this.props
        }
        />);
      }
    }

    const mapStateToProps = state => ({
        accessTokenReceived: state.receivedData.accessTokenReceived
      })
      
      const mapDispatchToProps = dispatch => bindActionCreators({
        changePage: (direction) => push('/' + direction)
      }, dispatch)
      
    return connect(mapStateToProps, mapDispatchToProps)(Authentication);
  }
