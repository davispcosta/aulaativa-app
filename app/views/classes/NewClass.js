import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, CheckBox, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      qntAbsence: '',
      active: false,
      instituitionUid: this.props.navigation.state.params.instituitionUid
    };
  }

  newClass = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('classes').push().key;

    ref = firebase.firestore().collection('classes') 
    ref.add({ uid: newKey, 
      qntAbsence: this.state.qntAbsence, 
      name: this.state.name, 
      professorUid: currentUser.uid,
      active: this.state.active,
      instituitionUid: this.state.instituitionUid}).then((response) => {
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
          <Text h2 style={styles.title}>NOVA TURMA</Text>

          <FormInput placeholder="Nome"
          onChangeText={(name) => this.setState({name})}
          />

          <FormInput placeholder="Quantidade de Faltas"
          keyboardType="numeric"
          onChangeText={(qntAbsence) => this.setState({qntAbsence})}
          />

          <CheckBox
            center
            title='Inativo'
            iconRight
            iconType='material'
            checkedIcon='alarm-on'
            uncheckedIcon='alarm-off'
            checkedColor='green'
            checkedTitle='Ativo'
            checked={this.state.active}
            onPress={() => { this.setState({ active: !this.state.active }) }}
          />

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newClass()}
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

