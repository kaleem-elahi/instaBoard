import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setAccessToken } from './../../actions/index';
import getParameterByName from '../../hoc/auth';
import { CLIENT_ID } from './../../constants/ApiConstants';

class Login extends Component {

  componentWillMount() {
    let AT_LS = localStorage.getItem("accessToken");
    let accessToken = this.getParameterByName('access_token'); // extract token from url
    if(AT_LS){
      this.props.changePage('dashboard');
    }else{
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        this.props.changePage('dashboard');      
      }
    }
  }

  getParameterByName = (name, url) => {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  render() {
    return (
      <div className="insta-block--login">
        <div className="linear-wipe"> Welcome, folks!</div>
        <div className="linear-caption">Know your Instagram account statistics</div>  
           <button className="instagram-login"  onClick={ () => window.location=`https://api.instagram.com/oauth/authorize/?client_id=${CLIENT_ID}&redirect_uri=http://localhost:3000/&response_type=token&scope=basic+public_content+follower_list+comments+relationships+likes` } >
          Login with Instagram
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accessTokenReceived: state.receivedData.accessTokenReceived
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setAccessToken,
  changePage: (direction) => push('/' + direction)
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
