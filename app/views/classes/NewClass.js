import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'

export class NewClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: this.onPress }}
          backgroundColor='#9C00FF'
          centerComponent={{ text: 'APIS1', style: { color: '#fff', fontWeight: "800" } }}
        />

        <ScrollView>
          
          <Text h2 style={styles.title}>NOVA TURMA</Text>

          <FormInput placeholder="Nome" />

          <FormInput placeholder="Quantidade de Faltas" />

          <Button
            small
            backgroundColor='#9C00FF'
            color='#FFFFFF'
            buttonStyle={styles.registerBtn}
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
      flex: 1,
  },
  title: {
    color: '#9C00FF',
    alignSelf: 'center',
    marginTop: 20,
  },
  registerBtn: {
      marginTop: 40
  }
});

