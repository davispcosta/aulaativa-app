import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewDoubt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,
      classUid: this.props.navigation.state.params.classUid,
      title: '',
    };
  }

  newDoubt = () => {
    var newKey = firebase.database().ref().child('doubts').push().key;

    ref = firebase.firestore().collection('doubts') 
    ref.add({ uid: newKey, 
      title: this.state.title, 
      classUid: this.state.classUid,
      userUid: this.state.user.uid,
      date: new Date()
    }).then((response) => {
        this.props.navigation.state.params.onNavigateBack()
        this.props.navigation.goBack()
    }).catch((error) => {
        alert(error.message)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}>

          <Text h2 style={styles.title}>QUAL SUA DÚVIDA?</Text>

          <FormInput placeholder="Dúvida"
          onChangeText={(title) => this.setState({title})}
          />

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newDoubt()}
            rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
            title='CONTINUAR'
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

