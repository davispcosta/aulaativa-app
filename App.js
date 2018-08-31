import React from 'react';
import { createStackNavigator } from 'react-navigation';

import { Login } from './app//views/login/Login';
import { Register } from './app//views/login/Register';
import { ChooseRegister } from './app/views/login/ChooseRegister';
import { Classes } from './app//views/classes/Classes';
import { Rank } from './app/views/board/Rank';
import { Question } from './app/views/quizes/Question';
import { MaterialTabs } from './app/sections/MaterialTabs';

const NavigationStack = createStackNavigator({
    LoginScreen: { screen: Login },
    RegisterScreen: { screen: Register },
    ChooseRegisterScreen: { screen: ChooseRegister },
    MaterialTabs: { screen: MaterialTabs },
    Rank: { screen: Rank },
    Question: { screen: Question },
    Classes: { screen: Classes }
}, {
    navigationOptions: {
      header: null
    }
});
export default class App extends React.Component {

  render() {
    return (
      <NavigationStack />
    );
  }
}
