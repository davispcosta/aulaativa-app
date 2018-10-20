import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, CheckBox } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';

export class NewAchievement extends Component {
    constructor(props) {
      super(props);
      this.state = {
        achievement: this.props.navigation.state.params.achievement,
        loading: false,
        students: [],
        subsAccepted: [],
        achievementToStudents: []
      }
      this.loadStudents()
    }
    
    loadSupportedSubscriptions = () => {
        ref = firebase.firestore().collection("subscriptions")
        ref.where("classUid", "==", this.state.classUid)
            .where("accepted", "==", true).get().then(function (querySnapshot) {
                var sub = []
                querySnapshot.forEach(function (doc) {
                    sub.push(doc.data())
                })
                this.setState({ subsAccepted: sub }, () => { this.loadAcceptedUsers() })
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
    }

    loadAcceptedUsers = () => {
        if (this.state.subsAccepted.length > 0) {
            let array = []
            ref = firebase.firestore().collection("users")
            this.state.subsAccepted.forEach((element) => {
                ref.where("uid", "==", element.studentUid).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        array.push(doc.data())
                    })
                    this.setState({ students: array })                    
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            })
        }
    }

    toogleStudent = (item) => {
        if(this.state.achievementToStudents.includes(item)) {
            var array = [...this.state.achievementToStudents]
            var index = array.indexOf(item)
            array.splice(index, 1)
            this.setState({achievementToStudents: array})
            item.checked = false
        } else {
            var array = [...this.state.achievementToStudents]
            array.push(item)
            this.setState({achievementToStudents: array})
            item.checked = true
        }
    }

    getStudentCard = (item) => {
        if(item.checked) {
            return <Card class="checked" title={item.name} id={'student-'+item.id}></Card>
        } else {
            return <Card title={item.name} id={'student-'+item.id}></Card>
        }
    }

    loadAchievementsToStudents = () => {
        this.state.achievementToStudents.map( (student) => {
            var newKey = firebase.database().ref().child('studentAchievements').push().key;

            ref = firebase.firestore().collection('studentAchievements') 
            ref.add({ uid: newKey, 
            studentUid: student.uid,
            achievementUid: this.state.achievement.uid
            }).then((response) => {
                this.props.navigation.goBack()
            }).catch((error) => {
                alert(error.message)
            })     
        })          
    }

    render() {

        var emptyDiv;
        if(this.state.achievements.length == 0) {
            emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Não há alunos na turma.</Text>
                        <Image 
                        style={styles.emptyIcon} 
                        resizeMode='contain'
                        source={require('../../assets/img/student.png')}
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
                title="ADICIONAR AOS ALUNOS" 
                titleStyle={{ fontWeight: '700'}}
                buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                onPress={() => this.loadAchievementsToStudents()}
              />
    
              { emptyDiv }
    
              <FlatList
                data={this.state.students}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.toogleStudent(item)}>
                    { this.getStudentCard() }                
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
    }    
});