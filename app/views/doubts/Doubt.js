import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { Card, Button, Text, Icon, FormInput } from 'react-native-elements';
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Doubt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,
      doubt: this.props.navigation.state.params.doubt,
      refreshing: false,
      answer: '',
      answers: []
    };
    this.loadAnswers()
  }

  newAnswer = () => {
    const { currentUser } = firebase.auth();

    var newKey = firebase.database().ref().child('answers').push().key;

    ref = firebase.firestore().collection('answers') 
    ref.add({ uid: newKey, 
      answer: this.state.answer, 
      doubtUid: this.state.doubt.uid, 
      date: new Date()
    }).then((response) => {
        this.loadAnswers()
    }).catch((error) => {
        alert(error.message)
    })
  }

  loadAnswers = () => {
    const { currentUser } = firebase.auth();
        
    ref = firebase.firestore().collection("answers")
    let array = []
    ref.where("doubtUid", "==", this.state.doubt.uid).get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        array.push(doc.data());
      })
    this.setState({ answers: array, refreshing: false})
    }.bind(this)).catch(function (error) {
      console.log(error)
      alert(error.message)
    })
  }

  onRefresh = () => {
    this.setState({ refreshing: true})
    this.loadAnswers()
  }

  render() {
    return (
      <View style={styles.container}>

        <HeaderSection navigation={this.props.navigation} goBack={true} />
        
        <Text h3 style={styles.title}>{this.state.doubt.title}</Text>

        <FormInput placeholder="Responder..."
          onChangeText={(answer) => this.setState({answer})}/>

        <Button
          small
          backgroundColor={Constants.Colors.Primary}
          color='#FFFFFF'
          buttonStyle={styles.registerBtn}
          rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
          title='ENVIAR'
          rounded={true}
          onPress={() => this.newAnswer()}
          fontWeight='800' />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
          }
        >

        <FlatList
          data={this.state.answers}
          keyExtractor={item => item.uid.toString()}
          renderItem={({item}) => (
            <Card flexDirection="row">
              <Text>{item.answer}</Text>
            </Card>
          )}
        />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({ 
    container: {
      flex: 1
    },
    title: {
      color: Constants.Colors.Primary,
      alignSelf: 'center',
      marginTop: 20,
    },
    registerBtn: {
      marginTop: 20
    }
});