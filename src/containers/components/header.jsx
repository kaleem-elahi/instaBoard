// Load the full build.
import  _  from 'lodash';
import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import {push} from 'react-router-redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setUsersSearchAction,setUserSelfAction, setAccessToken} from '../../actions/index';
import {
    Container,
    Divider,
    Dropdown,
    Grid,
    Header,
    Image,
    List,
    Menu,
    Segment,
    Search
} from 'semantic-ui-react'
import Logo from '../../assets/images/logo.png'




class HeaderBar extends Component {

    constructor(props) {
        super(props);
        this.state={
            searchValue:"",
            usersSearchData :[],
            isLoading: false
            
        }
    }

    logOut = () => {
        var iframe = document.getElementById('logoutIframe');
        iframe.src = "https://instagram.com/accounts/logout";
        // document.getElementById('logoutIframe').reload(true);
        document.body.appendChild(iframe);

        let logout = 'http://instagram.com/accounts/logout/';
        localStorage.removeItem("accessToken");
        this.props.changePage('');


    }


    // source = () => _.times(5, (this.state.usersSearchData) => ({
    //     title: "data.company.companyName()",
    //     description: "faker.company.catchPhrase()",
    //     image: "faker.internet.avatar()",
    //     price: "faker.finance.amount(0, 100, 2, '$')",
    //   }));
  
      
handleSearchChange = (event) =>{
    const token  = localStorage.getItem('accessToken');
    this.setState({searchValue: event.target.value,isLoading:true})
    if(event.target.value.length > 0){
        return fetch(`https://api.instagram.com/v1/users/search?q=${event.target.value}&access_token=${token}`, {
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
              this.props.setUsersSearchAction(data);

              const dataPattern = data.data.map((obj)=>({
                title : obj.full_name,
                description : obj.bio,
                image: obj.profile_picture
              }))

              this.setState({
                isLoading: false,
                usersSearchData:dataPattern,
              })

              return data;
            });
        }).then((data) => {}).catch((err) => {
          console.log('Fetch Error :-S', err);
        });
    }
}

    FixedMenuLayout = (full_name,profile_picture) => 
        {
    // const  image  = ;
            return (


            <Menu fixed='top' inverted>
                <Container>
                    <Menu.Item as='a' header>
                        <Image
                            size='mini'
                            src={Logo}
                            style={{
                            marginRight: '1.5em'
                        }}/>
                        Instaboard
                    </Menu.Item>
    
                    <Search
                        className="ui fluid category search"
                        loading={this.state.isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={this.handleSearchChange}
                        results={this.state.usersSearchData || []}
                        value={this.state.searchValue}
                    />
    
                    <Dropdown item simple text={<div><Image src={profile_picture} avatar /><span>{full_name}</span></div>}>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={this
                                .logOut
                                .bind(this)}>Logout</Dropdown.Item>
                            <iframe id="logoutIframe" style={{visibility : 'hidden',height:'0px',width: '0px', lineHeight: '3.5em',display: 'none'}} src=""/>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Menu>
            )

        }

    render() {
        const {username, website, profile_picture, full_name} = this.props.userSelfData.data || [];
        return (
            <div>
                {this.FixedMenuLayout(full_name,profile_picture)}
{/* 
                <Link to="/">Home</Link>
                <Link to="/dashboard">dashboard</Link>
                <Link to="/profile">Profile</Link> */}
{/* 
                <button
                    className="btn btn-danger"  
                    onClick={this
                    .logOut
                    .bind(this)}>Logout</button>
                <strong>This is header</strong> */}
            </div>
        )
    }

}

const mapStateToProps = state => ({
    accessTokenReceived: state.receivedData.accessTokenReceived || [],
    userSelf: state.receivedData.userSelf || [],
    usersSearch : state.receivedData.usersSearch ||[]
})

const mapDispatchToProps = dispatch => bindActionCreators({
    setUsersSearchAction,
    setUserSelfAction,
    setAccessToken,
    changePage: (direction) => push('/' + direction)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
