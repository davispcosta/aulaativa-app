import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classUid: this.props.navigation.state.params.classUid,
      title: '',
    };
  }

  newQuiz = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('quizes').push().key;

    ref = firebase.firestore().collection('quizes') 
    ref.add({ uid: newKey, 
      title: this.state.title, 
      classUid: this.state.classUid
    }).then((response) => {
        this.props.navigation.navigate('EditQuiz', { quizUid: newKey})
    }).catch((error) => {
        alert(error.message)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}>
        
          <FormInput placeholder="Título"
            onChangeText={(title) => this.setState({title})}
          />

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newQuiz()}
            rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
            title='SALVAR'
            rounded={true}
            fontWeight='800' />
        
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20
  },
  title: {
    color: Constants.Colors.Primary,
    alignSelf: 'center',
    marginTop: 20,
  },
  registerBtn: {
      marginTop: 40
  }
});
