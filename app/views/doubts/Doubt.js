import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
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
      loading: true,
      answer: '',
      answers: [],
      users: []
    };
    this.loadAnswers()
  }

  newAnswer = () => {
    var newKey = firebase.database().ref().child('answers').push().key;
    ref = firebase.firestore().collection('answers') 
    ref.add({ uid: newKey, 
      answer: this.state.answer, 
      doubtUid: this.state.doubt.uid, 
      date: new Date(),
      userUid: this.state.user.uid
    }).then(() => {
        this.setState({answer: '', loading: true})
        this.refs.input.blur()
        this.loadAnswers()
    }).catch((error) => {
        alert(error.message)
    })
  }

  loadAnswers = () => {
    ref = firebase.firestore().collection("answers")
    let array = []
    let users = []
    ref.where("doubtUid", "==", this.state.doubt.uid).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        let answer = doc.data();
        firebase.firestore().collection('users').where("uid", "==", answer.userUid).get().then( snapshot => {
          let user;
          snapshot.forEach((doc) => {
            user = doc.data();
          })
          users.push(user);
          array.push(answer);
          this.setState({ answers: array, users: users, refreshing: false, loading: false})  
        })        
      })      
    }).catch(function (error) {
      console.log(error)
      alert(error.message)
    })
  }

  onRefresh = () => {
    this.setState({ refreshing: true})
    this.loadAnswers()
  }

  render() {
    var content = null;
    if(this.state.loading == true) {
      content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
    } else {
      content = <FlatList
          data={this.state.answers}
          keyExtractor={item => item.uid.toString()}
          renderItem={({item, index}) => (
            <Card flexDirection="column">
              <Text style={{marginBottom: 5}}>{item.answer}</Text>
              <Text style={{textAlign: 'right', fontSize: 10, fontWeight: '400'}}>Respondido por:</Text>
              <Text style={{textAlign: 'right', fontWeight: '800'}}>{this.state.users[index].name}</Text>
            </Card>
          )}
        />
    }

    return (
      <View style={styles.container}>

        <HeaderSection navigation={this.props.navigation} goBack={true} />
        
        <Text h3 style={styles.title}>{this.state.doubt.title}</Text>

        <FormInput placeholder="Responder..."
          ref="input"
          value={this.state.answer}
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

        <Text h5 style={styles.subtitle}>RESPOSTAS</Text>
        
        { content }

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
    },
    subtitle: {
      alignSelf: 'center',
      fontFamily: 'montserrat_bold',
      marginTop: 20
    }
});