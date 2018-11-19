import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';

export class StudentAchievements extends Component {
  constructor(props) {
    super(props);
    this.state = {
        classroom: this.props.classroom,
        user: this.props.user,
        refreshing: false,
        loadingAll: true,
        loadingMy: true,
        myachievements: [],
        achievements: []
    }
    
  }

  componentDidMount = () => {
    this.setState({ loadingAll: true})
    this.loadMyAchievements()
  }

  loadMyAchievements = () => {    
    ref = firebase.firestore().collection("studentAchievements")
    let array = []
    ref.where("studentUid", "==", this.state.user.uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            array.push(doc.data());
        })
        this.setState({ myachievements: array, refreshing: false, loadingMy: false})
        console.log('this.state.myachievements')
        console.log(this.state.myachievements)
        this.loadAchievements();
    }.bind(this)).catch(function (error) {
        console.log(error)
        alert(error.message)
    })
  }

  loadAchievements = () => {    
    ref = firebase.firestore().collection("achievements")
    let array = []
    ref.where("classUid", "==", this.state.classroom.uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            array.push(doc.data());
        })
        this.setState({ achievements: array, refreshing: false, loadingAll: false})
    }.bind(this)).catch(function (error) {
        console.log(error)
        alert(error.message)
    })
  }

  onRefresh = () => {
    this.setState({ refreshing: true})
    this.loadMyAchievements()
    this.loadAchievements()
  }

  getAchievementCard = (item) => {
    if (this.state.myachievements.some(e => e.achievementUid === item.uid)) {
        return <Card>
            <Text>Conquista:</Text>
            <Text style={{fontWeight: '800'}}>{item.title}</Text>
        </Card>
    } else {
        return null;
    }
    
  }

  render() {

    var myAchievements = null;
    if(this.state.loadingMy == true) {
        myAchievements = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
    } else {
        if(this.state.myachievements.length == 0 ) {
            myAchievements = 
                <Text h5 style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Não tem conquistas.</Text>
        } else {
            myAchievements = <FlatList
            data={this.state.achievements}
            keyExtractor={item => item.uid.toString()}
            renderItem={({item}) => (
                this.getAchievementCard(item)
            )}
            />
        }
    }

    var allAchievements = null;
    if(this.state.loadingAll == true) {
        allAchievements = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
    } else {
        if(this.state.achievements.length == 0 ) {
            allAchievements = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Essa turma não possui conquistas adicionadas ainda.</Text>
                <Image 
                style={styles.emptyIcon} 
                resizeMode='contain'
                source={require('../../assets/img/pencils.png')}
                />
            </View>
        } else {
            allAchievements = <FlatList
            data={this.state.achievements}
            keyExtractor={item => item.uid.toString()}
            renderItem={({item}) => (
                <Card>
                    <Text>Conquista:</Text>
                    <Text style={{fontWeight: '800'}}>{item.title}</Text>
                </Card>
            )}
            />
        }
    }

    return (
        <ScrollView 
            refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
        }>
          <Text h5 style={{alignSelf: 'center', fontFamily: 'montserrat_bold', marginVertical: 30}}>MINHAS CONQUISTAS</Text>
          { myAchievements }

          <Text h5 style={{alignSelf: 'center', fontFamily: 'montserrat_bold', marginVertical: 30}}>TODAS CONQUISTAS</Text>
          { allAchievements }
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  emptyIcon: {
      width: 100
  },
  baseText: {
      color: Constants.Colors.Primary,
      paddingHorizontal: 20,
      paddingTop: 20,
      fontFamily: "montserrat_bold"
  }
});
