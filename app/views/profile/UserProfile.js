import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Text, Icon, Card } from 'react-native-elements'
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection'
import * as firebase from 'firebase';

export class UserProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      classes: []
    }
  }

  componentDidMount = () => {
    this.loadUser();
  }

  loadUser = () => {
    const { currentUser } = firebase.auth();

    ref = firebase.firestore().collection("users")
    ref.where("uid", "==", currentUser.uid).get().then(function(querySnapshot) {
        var user = {}
        querySnapshot.forEach(function(doc) {
            user = doc.data();
        })
        this.setState({ user: user })
        this.loadClasses();
    }.bind(this)).catch(function (error) {
        console.log(error)
        alert(error.message)
    })
  }

  loadClasses = () => {

    if(this.state.user.role == "Professor") {
      table = "classes"
      uid = "professorUid"
  } else {
      table = "subscriptions"
      uid = "studentUid"
  }

    const { currentUser } = firebase.auth();
    
    ref = firebase.firestore().collection(table)
    let array = []
    ref.where(uid, "==", currentUser.uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            array.push(doc.data());
        })
        this.setState({ classes: array, refreshing: false})
    }.bind(this)).catch(function (error) {
        console.log(error)
        alert(error.message)
    })
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>

        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView>

          <View style={styles.imgContainer}>
            <Icon type='font-awesome' name='user' color='#f1f1f1' size={50} />
          </View>
          
          <View style={{paddingLeft: 20, marginVertical: 20}}>
            <Text h3>{ this.state.user.name }</Text>
            <Text h4>Contato</Text>
            <Text>{ this.state.user.email }</Text>
          </View>

          <Text h4 style={{alignSelf: 'center',}}>Disciplinas</Text>

          <FlatList
            data={this.state.classes}
            keyExtractor={item => item.uid}
            renderItem={({item}) => (
              <Card flexDirection="row">
                <Icon
                  raised
                  containerStyle={{backgroundColor:'#AFAFAF'}}
                  name='class'
                  color='#f1f1f1'
                />
                <View style={{marginLeft: 20}}>
                  <Text
                    style={{fontFamily: 'montserrat'}}
                    h4>{item.name}</Text>
                  {/* <Text>{item.professor}</Text>
                  <Text style={{color: "gray"}}>{item.alunos} ALUNOS</Text> */}
                </View>
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
      flex: 1,
  },
  imgContainer: {
    width: '100%',
    backgroundColor: 'grey',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
});