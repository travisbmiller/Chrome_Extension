import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import routes from './routes.js';
import { Provider } from 'react-redux';
import Store from './store';
import { setUser, addUrl } from './actions';


ReactDOM.render(
  <Provider store={Store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('picdrop_ex')
);




//load tab data
chrome.extension.sendRequest({cmd: "load"}, function(response) {
   console.log("running")
   console.log("response", response)
   

    if (response.pd_loggedIn) { 
      console.log("trying to set user") 
      Store.dispatch(setUser(response.user));
    }

});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    if (request.url) {
      var url = request.url.srcUrl;
      console.log("request object", request)
      
      Store.dispatch(addUrl(request.url));
      
      console.log("state", Store.getState())
      console.log( parent.document )
      if ( document.getElementById("picdrop").className === "closed" ) {
        document.getElementById("picdrop").className = "";
      }
      document.getElementById("picdrop").src = "chrome-extension://nlmfjalfhbaeclmijpiamgealocldiab/iframe.html#/a/addimage"
    }

  });











