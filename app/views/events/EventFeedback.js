import React, { Component } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text, Header } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class EventFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: 1,
    };
  }

  markFeedback = () => {
    
  }

  render() {
    var label = <Text h5>{feedbacks[this.state.feedback]}</Text>
    let items = feedbacks.map( (feedback) => {
        return <Picker.Item key={feedback.value} value={feedback.value} label={feedback.label} />
    });

    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}>          
          { label }

            <Picker
                selectedValue={this.state.feedback}
                style={{ height: 50, width: 100 }}
                onValueChange={(itemValue, itemIndex) => this.setState({feedback: itemValue})}>
                { items }
            </Picker>

            <Button
                small
                backgroundColor={Constants.Colors.Primary}
                color='#FFFFFF'
                buttonStyle={styles.registerBtn}
                onPress={ () => this.markFeedback()}
                rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                title='SALVAR'
                rounded={true}
                fontWeight='800' />
        
        </ScrollView>
      
      </View>
    );
  }
}

var feedbacks = [{
    label: 'Bom',
    value: 1
},
{
    label: 'Ruim',
    value: 2
},
{
    label: 'Confuso',
    value: 3
}]

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

