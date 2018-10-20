import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroom: this.props.navigation.state.params.classroom,
      title: '',
      description: '',
    };
  }

  newNotification = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('notifications').push().key;

    ref = firebase.firestore().collection('notifications') 
    ref.add({ uid: newKey, 
      title: this.state.title, 
      description: this.state.description, 
      classUid: this.state.classroom.uid, 
      date: new Date()
    }).then((response) => {
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

          <Text h2 style={styles.title}>NOVA NOTIFICAÇÃO</Text>

          <FormInput placeholder="Título"
          onChangeText={(title) => this.setState({title})}
          />

          <FormInput placeholder="Descrição"
          multiline={true}
          onChangeText={(description) => this.setState({description})}
          />

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newNotification()}
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

