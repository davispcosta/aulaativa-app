import React, { Component } from 'react';
import { StyleSheet, ScrollView, Picker, View, Image } from 'react-native';
import { FormLabel, FormInput, Button, Text } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';
import '@firebase/firestore'

export class NewFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feedback: 1,
      event: this.props.navigation.state.params.event,
      user: this.props.navigation.state.params.user
    };
  }

  markFeedback = () => {
    var newKey = firebase.database().ref().child('eventFeedbacks').push().key;
      ref = firebase.firestore().collection('eventFeedbacks') 
      ref.add({ uid: newKey, 
      studentUid: this.state.user.uid,
      eventUid: this.state.event.uid,
      feedback: this.state.feedback
      }).then((response) => {
          this.props.navigation.goBack()
      }).catch((error) => {
          alert(error.message)
      })
  }
  render() {
    
    let items = feedbacks.map( (feedback) => {
        return <Picker.Item key={feedback['value']} value={feedback['value']} label={feedback['label']} />
    });

    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView keyboardShouldPersistTaps={"always"} style={styles.formContainer}
        contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}
        >

            <Text h5 style={{fontWeight: '800'}}>Marcar como feito?</Text>
           
            <Image 
            style={styles.icon} 
            resizeMode='contain'
            source={feedbacks[this.state.feedback - 1]['image']}
            />

            <Picker
                selectedValue={this.state.feedback}
                style={{ height: 50, width: 200 }}
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

const feedbacks = [{
    label: 'Fácil',
    value: 1,
    image: require('../../assets/img/feedback/facil.png')
},
{
    label: 'Incrível',
    value: 2,
    image: require('../../assets/img/feedback/incrivel.png')
},
{
    label: 'Confuso',
    value: 3,
    image: require('../../assets/img/feedback/confuso.png')
}, 
{
  label: 'Difícil',
  value: 4,
  image: require('../../assets/img/feedback/dificil.png')
},
{
  label: 'Trabalhoso',
  value: 5,
  image: require('../../assets/img/feedback/trabalhoso.png')
}]

const styles = StyleSheet.create({ 
  container: {
    flex: 1
  },
  icon: {
    width: 100,
    height: 100,
    marginVertical: 50,
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'column',
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

