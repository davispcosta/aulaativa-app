import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Font } from 'expo'
import * as firebase from 'firebase';

import { Login } from './app//views/login/Login';
import { Register } from './app//views/login/Register';
import { ChooseRegister } from './app/views/login/ChooseRegister';
import { Rank } from './app/views/board/Rank';
import { Question } from './app/views/quizes/Question';
import { MaterialTabs } from './app/sections/MaterialTabs';
import { SubscribeClass } from './app/views/classes/SubscribeClass';
import { Profile } from './app/views/profile/Profile';
import { Classes } from './app/views/classes/Classes';
import { NewClass } from './app/views/classes/NewClass';
import { SubscribeClass } from './app/views/classes/SubscribeClass';
import { NewNotification } from './app/views/board/NewNotification';
import Loading from './app/views/login/Loading';
import { Doubt } from './app/views/doubts/Doubt';

const firebaseConfig = {
  apiKey: "AIzaSyCZar2BXYpbFMpxUz5Vt8zeozIdOiwD25M",
  authDomain: "aula-ativa-api-38773.firebaseapp.com",
  databaseURL: "https://aula-ativa-api-38773.firebaseio.com",
  projectId: "aula-ativa-api-38773",
  storageBucket: "aula-ativa-api-38773.appspot.com",
}
firebase.initializeApp(firebaseConfig);
const settings = {timestampsInSnapshots: true};
firebase.firestore().settings(settings);

console.ignoredYellowBox = ['Setting a timer'];

const NavigationStack = createStackNavigator({
    Loading: {screen: Loading},
    LoginScreen: { screen: Login },
    RegisterScreen: { screen: Register },
    Classes: { screen: Classes },
    NewClass: { screen: NewClass},
    SubscribeClass: { screen: SubscribeClass},
    Doubt: { screen: Doubt},
    NewDoubts: { screen: NewDoubt }
    MaterialTabs: { screen: MaterialTabs },
    Question: { screen: Question },
    NewNotification: { screen: NewNotification },
    Profile: { screen: Profile },
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
    await Font.loadAsync({
      'montserrat': require('./app/assets/fonts/MontserratRegular.ttf'),
      'montserrat_thin': require('./app/assets/fonts/MontserratThin.ttf'),
      'montserrat_bold': require('./app/assets/fonts/MontserratBold.ttf'),
      'montserrat_black': require('./app/assets/fonts/MontserratBlack.ttf'),
      'montserrat_light': require('./app/assets/fonts/MontserratLight.ttf'),
      'montserrat_medium': require('./app/assets/fonts/MontserratMedium.ttf'),
      'montserrat_extra_bold': require('./app/assets/fonts/MontserratExtraBold.ttf'),
      'montserrat_semi_bold': require('./app/assets/fonts/MontserratSemiBold.ttf'),
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
