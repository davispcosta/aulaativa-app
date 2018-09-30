import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Picker } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

import { HeaderSection } from '../../sections/HeaderSection'

export class SubscribeClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      studentUid: this.props.navigation.state.params.studentUid,
      classUid: '',
      refreshing: false,
      classes: []
    };
    this.loadClasses()
  }

  loadClasses = () => {
    const { currentUser } = firebase.auth();
    
    ref = firebase.firestore().collection("classes")
    let array = []
    ref.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            array.push(doc.data());
        })
        this.setState({ classes: array, refreshing: false})
    }.bind(this)).catch(function (error) {
        console.log(error)
        alert(error.message)
    })
  }

  subscribeClass = () => {
    var newKey = firebase.database().ref().child('subscriptions').push().key;

    ref = firebase.firestore().collection('subscriptions') 
    ref.add({ uid: newKey, qntAbsence: 0, exp: 0, studentUid: this.state.studentUid, classUid: this.state.classUid}).then((response) => {
        this.props.navigation.goBack()
    }).catch((error) => {
        alert(error.message)
    })
  }

  render() {

    let cursos = this.state.classes.map( classroom => {
      return <Picker.Item key={classroom.uid} value={classroom.uid} label={classroom.name} style={{ width:"100%" }} />
    });
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}>

          <Text h2 style={styles.title}>INSCREVER-SE EM NOVA TURMA</Text>

          <Picker
            selectedValue={this.state.classUid}
            style={{ height: 50, width: 100 }}
            onValueChange={(uid) => this.setState({classUid: uid}, () => { console.log("this.state.uid"); console.log(this.state.uid) })}>
            {cursos}
          </Picker>

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.subscribeClass()}
            rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
            title='INSCREVER-SE'
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

