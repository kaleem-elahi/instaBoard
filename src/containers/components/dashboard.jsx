import React, {Component} from 'react';
import {push} from 'react-router-redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setUserRecentMediaAction,setUserSelfAction, setAccessToken} from '../../actions/index';
import fetch from 'isomorphic-fetch';
import {Link} from 'react-router-dom'
import REDIRECT_URL from '../../constants/ActionTypes';
import {USER_RECENT_MEDIA,USER_SELF} from '../../constants/ApiConstants';
import HeaderBar from './header.jsx';
import { Grid, Image } from 'semantic-ui-react'
import { Sparklines,SparklinesLine ,SparklinesBars} from 'react-sparklines';
import {    
  ResponsiveContainer, BarChart, Bar,LineChart, Line, Legend, Tooltip, YAxis, CartesianAxis, CartesianGrid, XAxis } from 'recharts';


class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userData: [],
    }
  }

  componentWillMount() {

    let AT_LS = localStorage.getItem("accessToken");
    let redirect_uri = 'http://localhost:3000/';
    const url = 'https://api.instagram.com/oauth/access_token';



    if (AT_LS) {
      this.GetUserDetails(AT_LS);
      this.GetUserRecentMedia(AT_LS)

    }
  }

  GetUserRecentMedia = (token) => {
    return fetch(USER_RECENT_MEDIA + token, {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    }).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      // Examine the text in the response
      response
        .json()
        .then((data) => {
          // console.log(data);
          this.props.setUserRecentMediaAction(data);
          return data;
        });
    }).then((data) => {}).catch((err) => {
      console.log('Fetch Error :-S', err);
    });
  };

  GetUserDetails = (token) => {
    return fetch(USER_SELF + token, {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    }).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' + response.status);
        return;
      }
      // Examine the text in the response
      response
        .json()
        .then((data) => {
          this.props.setUserSelfAction(data);
          return data;
        });
    }).then((data) => {}).catch((err) => {
      console.log('Fetch Error :-S', err);
    });
  };


  Card = (total,cardClass,cardType) => {
  let datauserRecentMedia = this.props.userRecentMedia.data || []; 
const likesOfMedia =   datauserRecentMedia.map((obj)=> {
  return obj.likes['count'] 
})

  const likes= "";

    return(
        <div className="card ">
          <div className={cardClass} />
          <div className="card-title-mini">{cardType}</div>          
          <div className="card-title">{total}</div>
          
          {likes ? <Sparklines data={likesOfMedia.reverse()}>
  <SparklinesBars style={{ fill: "#41c3f9" }} />
</Sparklines> : ""

}
        </div>
    );
  }

  renderCharts = (cardType,cardTitle) => {
  let datauserRecentMedia = this.props.userRecentMedia.data || []; 

  //Epoch To Date

   function EpochToDate(epoch) {
  const month = new Array();
  month[0] = "Jan";
  month[1] = "Feb";
  month[2] = "Mar";
  month[3] = "Apr";
  month[4] = "May";
  month[5] = "Jun";
  month[6] = "Jul";
  month[7] = "Aug";
  month[8] = "Sep";
  month[9] = "Oct";
  month[10] = "Nov";
  month[11] = "Dec";

  let myDate = new Date(epoch *1000);
    return myDate.getDate()+"/"+month[myDate.getMonth()];
  }

  const likesOfMedia = datauserRecentMedia.map((obj)=> {
  const d = new Date(obj.created_time); // The 0 there is the key, which sets the date to the epoch
  return {
  name :  EpochToDate(obj.created_time),
  Likes  : obj.likes['count'] 
}
});

  const commentsOfMedia = datauserRecentMedia.map((obj)=> {
  const d = new Date(obj.created_time); // The 0 there is the key, which sets the date to the epoch
  return {
  name :  EpochToDate(obj.created_time),
  Comments  : obj.comments['count'] 
}
});



  const likes= "";


    return(
        <div className="card big">
          <div className="card-title-mini">{cardTitle}</div>          
          <div className="charts-container">
          <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%">
          <LineChart  data={cardType == 'Likes' ? likesOfMedia.reverse() : commentsOfMedia.reverse() } margin={{top: 5,right: 50,  bottom: 0}}>
            <XAxis dataKey="name" tick={{fontSize: 15}}/>
            <YAxis tick={{fontSize: 15}}/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip wrapperStyle={{fontSize: 13}} cursor={{ stroke: 'lightgrey', strokeWidth: 2 }} />
            {/* <Legend wrapperStyle={{fontSize: 15}} />  */}
            <Line type="monotone" stroke="violet" dataKey={cardType} tick={{fontSize: 15}} />
          </LineChart>
    	    </ResponsiveContainer>
        </div>

          </div>
        </div>
    );
  }

  chartsGrid = (data) => {
  const TOTAL = data.data ? data.data.counts : [];
    return (
      <Grid>
      <Grid.Row columns={2}>
        <Grid.Column>
         {this.renderCharts("Likes","Likes By Post")}
        </Grid.Column>
      
        <Grid.Column>
        {this.renderCharts("Comments","Comments By Post")}
        </Grid.Column>
      </Grid.Row>
    </Grid>  
    );       
   }         

   cardsGrid = (data) => {
    const TOTAL = data.data ? data.data.counts : [];
    const datauserRecentMedia = this.props.userRecentMedia.data || []; 

        const likesOfMedia = datauserRecentMedia.map((obj)=> {
         return obj.likes['count'];
        }).reduce( function(total, amount){
          return total + amount
        },0);

    return (
      <Grid>
      <Grid.Row columns={4}>
        <Grid.Column>
         {this.Card(TOTAL.followed_by,"followers","Followers")}
        </Grid.Column>
        <Grid.Column>
        {this.Card(TOTAL.media,"posts","Posts")}
        </Grid.Column>
        <Grid.Column>
        {this.Card(likesOfMedia,"likes","Likes")}
        </Grid.Column>
        <Grid.Column>
        {this.Card(TOTAL.follows,"following","Followings")}
        </Grid.Column>
      </Grid.Row>
    </Grid>  
    );       
   }         
 
  
  

  render() {

    let data = this.state.userData.data || [];
    let datauserRecentMedia = this.props.userRecentMedia.data || []; 
  
  const likesOfMedia =   datauserRecentMedia.map((obj)=> {
    return obj.likes['count'] 
  })
  
    return (
      <div>
        <HeaderBar userSelfData={this.props.userSelf} />
       
        <div className="section">
        {this.cardsGrid(this.props.userSelf)}

        {this.chartsGrid(datauserRecentMedia)}

        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  userRecentMedia : state.receivedData.userRecentMedia || [],
  accessTokenReceived: state.receivedData.accessTokenReceived || [],
  userSelf: state.receivedData.userSelf || []
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setUserRecentMediaAction,
  setUserSelfAction,
  setAccessToken,
  changePage: (direction) => push('/' + direction)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
