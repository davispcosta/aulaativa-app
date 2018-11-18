import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, CheckBox, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class EditClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroom: this.props.navigation.state.params.classroom,
      name: this.props.navigation.state.params.classroom.name,
      active: this.props.navigation.state.params.classroom.active,
    };
  }

  updateClass = () => {
    firebase.firestore().collection("classes").where("uid", "==", classroom.uid)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach( (doc) => {
            firebase.firestore().collection("classes").doc(doc.id).update({name: this.state.name, active: this.state.active}).then(() =>{            
              this.props.navigation.goBack();
              setTimeout(() => this.props.navigation.setParams({classroom: { classroom: this.state.id, name: this.state.name, active: this.state.name }}), 10)
            });
        });
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}>          
          <Text h2 style={styles.title}>EDITAR</Text>

          <FormInput placeholder="Nome"
          value={this.state.name}
          onChangeText={(name) => this.setState({name})}
          />

          <CheckBox
            center
            title='Ativo'
            iconRight
            iconType='material'
            checkedIcon='alarm-on'
            uncheckedIcon='alarm-off'
            checkedColor='green'
            checked={this.state.active}
            onPress={() => { this.setState({ active: !this.state.active }) }}
          />

          <Button
            small
            backgroundColor={Constants.Colors.Primary}
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
            onPress={ () => this.updateClass()}
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

