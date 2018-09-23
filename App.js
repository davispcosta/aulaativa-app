import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Font } from 'expo'
import * as firebase from 'firebase';

import { Login } from './app//views/login/Login';
import { Register } from './app//views/login/Register';
import { ChooseRegister } from './app/views/login/ChooseRegister';
import { Rank } from './app/views/board/Rank';
import { NewQuiz } from './app/views/quizes/NewQuiz';
import { EditQuiz } from './app/views/quizes/EditQuiz';
import { Question } from './app/views/quizes/Question';
import { NewQuestion } from './app/views/quizes/NewQuestion';
import { EditQuestion } from './app/views/quizes/EditQuestion';
import { MaterialTabs } from './app/sections/MaterialTabs';
import { UserProfile } from './app/views/profile/UserProfile';
import { ProfessorProfile } from './app/views/profile/ProfessorProfile';
import { Classes } from './app/views/classes/Classes';
import { NewClass } from './app/views/classes/NewClass';
import { NewEvent } from './app/views/events/NewEvent';
import { SubscribeClass } from './app/views/classes/SubscribeClass';
import { NewNotification } from './app/views/board/NewNotification';
import { Doubt } from './app/views/doubts/Doubt';
import { NewDoubt } from './app/views/doubts/NewDoubt';
import Loading from './app/views/login/Loading';

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
    NewEvent: { screen: NewEvent },
    SubscribeClass: { screen: SubscribeClass},
    Doubt: { screen: Doubt},
    NewDoubt: { screen: NewDoubt },
    MaterialTabs: { screen: MaterialTabs },
    NewQuiz: { screen: NewQuiz },
    EditQuiz: { screen: EditQuiz },
    NewQuestion: { screen: NewQuestion },
    EditQuestion: { screen: EditQuestion },
    Question: { screen: Question },
    NewNotification: { screen: NewNotification },
    UserProfile: { screen: UserProfile },
    ProfessorProfile: { screen: ProfessorProfile },
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
