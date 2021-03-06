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
      qntColar: 0,
      qntUniversitarios: 0,
      qntMetade: 0,
      qntMenosUm: 0,
      qntDuasCaras: 0
    };
  }

  newQuiz = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('quizes').push().key;

    ref = firebase.firestore().collection('quizes') 
    ref.add({ uid: newKey, 
      title: this.state.title, 
      classUid: this.state.classUid,
      qntColar: parseInt(this.state.qntColar),
      qntUniversitarios: parseInt(this.state.qntUniversitarios),
      qntMetade: parseInt(this.state.qntMetade),
      qntMenosUm: parseInt(this.state.qntMenosUm),
      qntDuasCaras: parseInt(this.state.qntDuasCaras)
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

          <Text>Quantidade de Poderes</Text>

          <FormInput placeholder="Colar"
            keyboardType="numeric"
            onChangeText={(qntColar) => this.setState({qntColar})}
          />

          <FormInput placeholder="Ajuda dos Universitários"
            keyboardType="numeric"
            onChangeText={(qntUniversitarios) => this.setState({qntUniversitarios})}
          />

          <FormInput placeholder="Na Metade"
            keyboardType="numeric"
            onChangeText={(qntMetade) => this.setState({qntMetade})}
          />

          <FormInput placeholder="Menos Um"
            keyboardType="numeric"
            onChangeText={(qntMenosUm) => this.setState({qntMenosUm})}
          />

          <FormInput placeholder="Duas Caras"
            keyboardType="numeric"
            onChangeText={(qntDuasCaras) => this.setState({qntDuasCaras})}
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
