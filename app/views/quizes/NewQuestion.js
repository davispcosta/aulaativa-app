import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Picker } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quizUid: this.props.navigation.state.params.quizUid,
      question: '',
      type: 0,
    };
  }

  newQuestion = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('questions').push().key;

    ref = firebase.firestore().collection('questions') 
    ref.add({ uid: newKey, 
      question: this.state.question, 
      quizUid: this.state.quizUid,
      type: this.state.type
    }).then((response) => {
        if(this.state.type == 0) {
          this.props.navigation.goBack()
        } else {
          this.props.navigation.navigate('EditQuestion', { questionUid: newKey})
        }
        
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
            onChangeText={(question) => this.setState({question})}
          />

           <Picker
              selectedValue = {this.state.type}
              onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}>
                  <Picker.Item label="Textual" value={0} key={0}/>  
                  <Picker.Item label="De Marcar" value={1} key={1}/>           
          </Picker>

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newQuestion()}
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
