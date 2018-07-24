import React from 'react';
import { createStackNavigator } from 'react-navigation';
import LoginStack from './app/sections/navigation/LoginStack';
import DrawerStack from './app/sections/navigation/DrawerStack';

const MyRoutes = createStackNavigator({
  LoginStack: { screen: LoginStack },
  DrawerStack: { screen: DrawerStack },
}, {
  initialRouteName: 'DrawerStack',
  navigationOptions: {
    header: null
  }
}); 

export default class App extends React.Component {

  render() {
    return (
      <MyRoutes />
    );
  }
}
