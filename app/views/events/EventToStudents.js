import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, ActivityIndicator, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, CheckBox } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';

export class EventToStudents extends Component {
    constructor(props) {
      super(props);
      this.state = {
        event: this.props.navigation.state.params.event,
        loading: true,
        students: [],
        subsAccepted: []
      }
      this.loadSupportedSubscriptions()
    }
    
    loadSupportedSubscriptions = () => {
        ref = firebase.firestore().collection("subscriptions")
        ref.where("classUid", "==", this.state.event.classUid)
            .where("accepted", "==", true).get().then(function (querySnapshot) {
                var sub = []
                querySnapshot.forEach(function (doc) {
                    sub.push(doc.data())
                })
                this.setState({ subsAccepted: sub}, () => { this.loadAcceptedUsers() })
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
                    this.setState({ students: array, loading: false  })                    
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
            return <Card key={index} containerStyle={{marginVertical: 20, borderWidth: 2, borderColor: Constants.Colors.Primary}}>
                <Text h5 style={{fontWeight: '800'}}>{item.name}</Text>
                <Text h5>{item.email}</Text>
            </Card>
        } else {
            return <Card key={index} containerStyle={{marginVertical: 20}}>
                <Text h5 style={{fontWeight: '800'}}>{item.name}</Text>
                <Text h5>{item.email}</Text>
            </Card>
        }
    }

    loadEventToStudents = () => {
        this.state.students.map( (student) => {

            if(student.checked) {
                var newKey = firebase.database().ref().child('studentEvents').push().key;

                ref = firebase.firestore().collection('studentEvents') 
                    ref.add({ uid: newKey, 
                    studentUid: student.uid,
                    eventUid: this.state.event.uid
                    }).then((response) => {
                        this.props.navigation.goBack()
                    }).catch((error) => {
                        alert(error.message)
                    })

                firebase.firestore().collection("subscriptions").where("studentUid", "==", student.uid).where("classUid", "==", this.state.event.classUid)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach( (doc) => {
                        var newExp = doc.data().exp + this.state.event.exp;
                        firebase.firestore().collection("subscriptions").doc(doc.id).update({exp: newExp }).then(() =>{            
                            this.props.navigation.goBack();
                        });
                    });
                })
            }            
        })          
    }

    render() {
        var content;
        if(this.state.loading == true) {
            content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.students.length == 0) {
                content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Não há alunos na turma.</Text>
                    <Image 
                    style={styles.emptyIcon} 
                    resizeMode='contain'
                    source={require('../../assets/img/student.png')}
                    />
                </View>
            } else {
                content = <FlatList
                    data={this.state.students}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({item, index}) => (
                        <TouchableWithoutFeedback
                        onPress={() => this.toogleStudent(index)}>
                        { this.getStudentCard(item, index) }                
                        </TouchableWithoutFeedback>
                    )}
                />
            }
        }
    
        return (
          <View style={styles.container}>
            <HeaderSection navigation={this.props.navigation} goBack={true} />
    
            <ScrollView>

              <Text h5 style={{textAlign: 'center', fontWeight: '800', marginVertical: 30}}>ADICIONAR PONTOS</Text>
    
              { content }
    
              <Button
                small
                backgroundColor={Constants.Colors.Primary}
                color='#FFFFFF'
                buttonStyle={styles.registerBtn}
                onPress={ () => this.loadEventToStudents()}
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