import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUser } from '../actions';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import  { reduxForm } from 'redux-form';
import ROOT_URL from '../Config/rooturl';

class Login extends Component {
  constructor() {
    super();
    this.submit = this.submit.bind(this);
    this.pushToNextState = this.pushToNextState.bind(this);
  }

  submit(data) {  
    console.log("posting to API")  
    axios.post(ROOT_URL + 'auth/login', data)
      .then((data) => {
        this.props.setUser(data.data);
        chrome.extension.sendRequest({cmd: "save", data: {pd_loggedIn: true, user: data.data}});
        this.pushToNextState()

      }, (err) => {
        console.log(err)
    });
  }

  pushToNextState() {
    const path = this.props.location.search.substr(1);
     if ( this.props.loggedIn && path.length > 1 ) {
      this.props.history.push({pathname: path});
     } else {
      this.props.history.push({ pathname: '/a' });
    }
  }

  componentDidUpdate() {
   
   const path = this.props.location.search.substr(1);
   if ( this.props.loggedIn && path.length > 1) {
     console.log("pushing")
    this.props.history.push({pathname: path});
   }
  }

  render() {
    const { fields: { email, password }, handleSubmit } = this.props;
    return (
      <section className="login">
        <div>
          <img src="logo.svg" />
        </div>
        <section className="headline">
          Looks like you are not logged in. <br />
          Please Login to access your account.
        </section>
        <div className="login_container">
          <form onSubmit={handleSubmit(this.submit)}>
            <div className="form_input">
              <input type="text" placeholder="Username" { ...email } />
            </div>
            <div className="form_input">
              <input type="password" placeholder="Password" { ...password }/>
            </div>
            <button type="submit">Login</button>
          </form>
          
        </div>
        <section className="sign_up">
            <h5>Not a user?</h5>
            <span>Sign Up Now</span>
          </section>
      </section>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.user.isAuth,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators( { setUser } , dispatch );
};

//export default connect(mapStateToProps, mapDispatchToProps)(Login);

// export default Login;

export default reduxForm({
  form: "login",
  fields: ['email', 'password']
}, mapStateToProps, mapDispatchToProps)(Login)