import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, CheckBox } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';

export class AchievementToStudents extends Component {
    constructor(props) {
      super(props);
      this.state = {
        achievement: this.props.navigation.state.params.achievement,
        loading: false,
        students: [],
        subsAccepted: []
      }
      this.loadSupportedSubscriptions()
    }
    
    loadSupportedSubscriptions = () => {
        ref = firebase.firestore().collection("subscriptions")
        ref.where("classUid", "==", this.state.achievement.classUid)
            .where("accepted", "==", true).get().then(function (querySnapshot) {
                var sub = []
                querySnapshot.forEach(function (doc) {
                    sub.push(doc.data())
                })
                this.setState({ subsAccepted: sub, loading: false }, () => { this.loadAcceptedUsers() })
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
                    });
                    array.forEach(function (obj) { obj.checked = false })
                    this.setState({ students: array })                    
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            })
        }
    }

    toogleStudent = (index) => {                
        var array = [...this.state.students]
        array[index].checked = !array[index].checked;
        this.setState({students: array})        
    }

    getStudentCard = (item, index) => {
        if(item.checked) {
            return <Card key={index} title={item.name}>
                <Text>Esse aluno irá receber a conquista!</Text>
            </Card>
        } else {
            return <Card key={index}>
                <Text>{item.name}</Text>
            </Card>
        }
    }

    loadAchievementsToStudents = () => {
        this.state.students.map( (student) => {

            if(student.checked) {
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
            }            
        })          
    }

    render() {

        var emptyDiv;
        if(this.state.students.length == 0) {
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

        var loadingDiv;
        if(this.state.loading == true) {
            loadingDiv = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            loadingDiv = null
        }
    
        return (
          <View style={styles.container}>
            <HeaderSection navigation={this.props.navigation} goBack={true} />
    
            <ScrollView>
    
              { emptyDiv }
              { loadingDiv }
    
              <FlatList
                data={this.state.students}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item, index}) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.toogleStudent(index)}>
                    { this.getStudentCard(item, index) }                
                    </TouchableWithoutFeedback>
                )}
              />

              <Button
                small
                backgroundColor={Constants.Colors.Primary}
                color='#FFFFFF'
                buttonStyle={styles.registerBtn}
                onPress={ () => this.loadAchievementsToStudents()}
                rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                title='ADICIONAR'
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
    registerBtn: {
        marginTop: 40
    }
});