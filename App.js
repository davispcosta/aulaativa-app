import React from 'react';
import { StackNavigator } from 'react-navigation';

import { Login } from './app/views/Login.js'
import { Contact } from './app/views/Contact.js';

const MyRoutes = StackNavigator({
  LoginRT: {
    screen: Login
  }, 
  ContactRT: {
    screen: Contact
  }
}, {
  initialRouteName: 'LoginRT'
}); 

export default class App extends React.Component {
  render() {
    return (
      <MyRoutes />
    );
  }
}
