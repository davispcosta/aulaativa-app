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
      classUid = '',
      refreshing = true,
      classes = []
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

  render() {
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}>

          <Text h2 style={styles.title}>INSCREVER-SE EM NOVA TURMA</Text>

          <Picker
            selectedValue={this.state.classUid}
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue, itemIndex) => this.setState({classUid: itemValue})}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.newClass()}
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

