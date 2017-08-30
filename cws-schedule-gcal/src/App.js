import React, { Component } from 'react'
import { CLIENT_ID, DISCOVERY_DOCS, SCOPES, getUpcomingEvents, addClass } from './Api.js'
import getGApi from 'google-client-api'
import periods from './periods.js'


// material design stuff
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton'
import AppBar from 'material-ui/AppBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme'

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  margin: 0,
  appBar: {
    height: 70
  }
})

var sampleClass = {
  day: periods.tuesday,
  period: periods.tuesday.first,
  name: "Relativity",
  room: '4B',
  date: '2017-09-12',
  recurrence: "weekly" // 'single' or 'weekly'
}


class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      showAuthButton: false,
      showSignOutButton: false
    };
    this.initClient = this.initClient.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    this.createAndAddClass = this.createAndAddClass.bind(this);
  }

  handleAuthClick(){
    getGApi().then((gapi) => {
      gapi.auth2.getAuthInstance().signIn();
    })
  }
  
  handleSignoutClick(){
    getGApi().then((gapi) => {
      gapi.auth2.getAuthInstance().signOut();
    })
  }

  handleClientLoad() {
    getGApi().then((gapi) => {
      gapi.load('client:auth2', this.initClient);
    })
  }

  updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      this.setState({
        showAuthButton: false,
        showSignOutButton: true
      })

      getUpcomingEvents()
    } else {
      this.setState({
        showAuthButton: true,
        showSignOutButton: false
      })
    }
  }

  initClient() {
    var _this = this;
    getGApi().then((gapi) => {
      gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
      }).then(function () {
        console.log(gapi);
        gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);
        _this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    })
  }

  componentDidMount(){
    this.handleClientLoad();
  }

  createAndAddClass() {
    addClass(sampleClass)
  }

  render() {
    let authButton = <RaisedButton label="Authorize" onClick={this.handleAuthClick.bind(this)} primary={true} />
    let signOutButton = <RaisedButton label="Sign out" onClick={this.handleSignoutClick.bind(this)} secondary={true} />
    return(
      <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <AppBar
          showMenuIconButton={false}
          title="Commonwealth School Google Calendar"/>
          <div style={{margin: 8}}>
            {this.state.showAuthButton ? authButton : null}
            {this.state.showSignOutButton ? (
              <div>
                <RaisedButton 
                  label="Add Sample Class"
                  primary={true}
                  onClick={this.createAndAddClass}
                  style={{marginBottom: 8}}
                /><br/>
                {signOutButton}
              </div>
             ) : null}
          </div>
      </div>
    </MuiThemeProvider>
    )
  }
}

export default App