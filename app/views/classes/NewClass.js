import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      qntAbsence: ''
    };
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  newClass = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('classes').push().key;

    ref = firebase.firestore().collection('classes') 
    ref.add({ uid: newKey, qntAbsence: this.state.qntAbsence, name: this.state.name, professorUid: currentUser.uid}).then((response) => {
        this.props.navigation.goBack()
    }).catch((error) => {
        alert(error.message)
    })

  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView style={styles.formContainer}>
          
          <Text h2 style={styles.title}>NOVA TURMA</Text>

          <FormInput placeholder="Nome"
          onChangeText={(name) => this.setState({name})}
          />

          <FormInput placeholder="Quantidade de Faltas"
          onChangeText={(qntAbsence) => this.setState({qntAbsence})}
          />

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newClass()}
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

