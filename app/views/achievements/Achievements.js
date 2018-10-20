import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';

export class Achievements extends Component {
  constructor(props) {
    super(props);
    this.state = {
        classroom: this.props.navigation.state.params.classroom,
        refreshing: false,
        loading: false,
        achievements: []
    }
    this.loadAchievements()
  }

  loadAchievements = () => {    
    ref = firebase.firestore().collection("achievements")
    let array = []
    ref.where("classUid", "==", this.state.classroom.uid).get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            array.push(doc.data());
        })
        this.setState({ achievements: array, refreshing: false, loading: false})
    }.bind(this)).catch(function (error) {
        console.log(error)
        alert(error.message)
    })
  }

  onRefresh = () => {
    this.setState({ refreshing: true})
    this.loadAchievements()
  }

  render() {

    var emptyDiv;
    if(this.state.achievements.length == 0) {
        emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Essa turma não possui conquistas adicionadas ainda.</Text>
                    <Image 
                    style={styles.emptyIcon} 
                    resizeMode='contain'
                    source={require('../../assets/img/pencils.png')}
                    />
                </View>
    } else {
        emptyDiv = null;
    }

    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView 
            refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
        }>

          <Button
            title="ADICIONAR CONQUISTA" 
            titleStyle={{ fontWeight: '700'}}
            buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
            onPress={() => this.props.navigation.navigate('NewAchievement', { classroom: this.state.classroom})}
          />

          { emptyDiv }

          <FlatList
            data={this.state.achievements}
            keyExtractor={item => item.uid.toString()}
            renderItem={({item}) => (
                <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('AchievementToStudents', { achievement: item })}>
                <Card title={item.title} >
                </Card>
                </TouchableWithoutFeedback>
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
