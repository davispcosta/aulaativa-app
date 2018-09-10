import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import { Login } from './app//views/login/Login';
import { Register } from './app//views/login/Register';
import { ChooseRegister } from './app/views/login/ChooseRegister';
import { Classes } from './app//views/classes/Classes';
import { Rank } from './app/views/board/Rank';
import { Question } from './app/views/quizes/Question';
import { MaterialTabs } from './app/sections/MaterialTabs';
import { SubscribeClass } from './app/views/classes/SubscribeClass';
import { Profile } from './app/views/profile/Profile';
import { NewClass } from './app/views/classes/NewClass';
import { NewNotification } from './app/views/board/NewNotification';

const NavigationStack = createStackNavigator({
    Classes: { screen: Classes },
    NewClass: { screen: NewClass},
    MaterialTabs: { screen: MaterialTabs },
    Question: { screen: Question },
    NewNotification: { screen: NewNotification },
    Profile: { screen: Profile },
    LoginScreen: { screen: Login },
    RegisterScreen: { screen: Register },
    ChooseRegisterScreen: { screen: ChooseRegister },
    Rank: { screen: Rank },
    SubscribeClass: { screen: SubscribeClass }
}, {
    navigationOptions: {
      header: null
    }
});
export default class App extends React.Component {
  state = {
    fontLoaded: false,
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      'Montserrat': require('./app/assets/fonts/MontserratRegular.ttf'),
      'MontserratThin': require('./app/assets/fonts/MontserratThin.ttf'),
    });
    this.setState({ fontLoaded: true})
  }

  render() {
    return (
      <View style={styles.container}>
        {
          this.state.fontLoaded ? (
            <NavigationStack />
          ) : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
  container: {
      flex: 1,
  },
});
