import React from 'react';
import { StyleSheet, ScrollView, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Icon, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import { Constants } from '../../Constants';

export class Status extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            classUid: this.props.classroom.uid,
            user: {},
            status: {},
            subsAccepted: [],
            unsupportedSubs: [],
            usersAccepted: [],
            unsupportedUsers: [],
            achievements: []
        }
    }

    componentDidMount = () => {
        this.loadUser();        
    }

    loadStatus = () => {
        console.log('status')
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("subscriptions").where("classUid", "==", this.state.classUid)
        ref.where("studentUid", "==", currentUser.uid).get().then(function (querySnapshot) {
            var status = {}
            querySnapshot.forEach(function (doc) {
                status = doc.data();
            })
            this.setState({ status: status }, () => { console.log(this.state.status)})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadUser = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("users")
        ref.where("uid", "==", currentUser.uid).get().then(function (querySnapshot) {
            var user = {}
            querySnapshot.forEach(function (doc) {
                user = doc.data();
            })
            this.setState({ user: user }, () =>{
                if(user.role == "Professor") {
                    this.loadUnsupportedSubscriptions();
                    this.loadSupportedSubscriptions();
                } else if(user.role == "Student") {
                    this.loadStatus()
                }
            })            
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
                    this.setState({ usersAccepted: array })
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            })
        }
    }

    loadUnsupportedUsers = () => {
        if (this.state.unsupportedSubs.length > 0) {
            let array = []
            ref = firebase.firestore().collection("users")
            this.state.unsupportedSubs.forEach((element) => {
                ref.where("uid", "==", element.studentUid).get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        array.push(doc.data())
                    })
                    this.setState({ unsupportedUsers: array })
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            })
        }
    }

    loadUnsupportedSubscriptions = () => {
        ref = firebase.firestore().collection("subscriptions")
        ref.where("classUid", "==", this.state.classUid)
            .where("accepted", "==", false).get().then(function (querySnapshot) {
                var sub = []
                querySnapshot.forEach(function (doc) {
                    sub.push(doc.data())
                })
                this.setState({ unsupportedSubs: sub }, () => this.loadUnsupportedUsers())
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
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

    acceptedRequest = (uid) => {
        let subscriptionUid =
            this.state.unsupportedSubs.find(function (element) {
                return element.studentUid == uid
            }).uid;

        ref = firebase.firestore().collection('subscriptions')

        ref.where("uid", "==", subscriptionUid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, ' => ', doc.data())
                    ref.doc(doc.id).update({ accepted: true })
                })
            })

    }

    addFault = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("subscriptions")
        ref.where("classUid", "==", this.state.classUid)
            .where("studentUid", "==", currentUser.uid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    ref.doc(doc.id).update({ qntAbsence: this.state.status.qntAbsence + 1 })
                })
            })
    }

    refuseRequest = (uid) => {
        let subscriptionUid =
            this.state.unsupportedSubs.find(function (element) {
                return element.studentUid == uid
            }).uid;

        ref = firebase.firestore().collection('subscriptions')

        ref.where("uid", "==", subscriptionUid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    console.log(doc.id, ' => ', doc.data())
                })
            })

    }

    generateFaults(classFaults, statusFaults) {
        const faults = [];
        for (let i = 0; i < classFaults; i++) {
            faults.push(
                <Icon
                    key={i}
                    name="favorite"
                    color="#FF412F"
                />
            );
        }
        return faults;
    }

    render() {
        let screen = null;
        let usersActive = null;

        if (this.state.user.role == "Professor") {
            if (this.state.unsupportedUsers.length == 0) {
                screen = <Text style={styles.subtitle} h4>Sem solicitações de novos alunos.</Text>
            } else {
                screen = <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ marginTop: 20 }} h4>Solicitações</Text>
                    <FlatList
                        data={this.state.unsupportedUsers}
                        keyExtractor={item => item.uid.toString()}
                        renderItem={({ item }) => (
                            <Card style={{flex: 1}} flexDirection="column">
                                <Text h5>Solicitante: {item.name}</Text>
                                <View style={{flexDirection: 'row',}}>
                                    <Button
                                        title="Aceitar"
                                        titleStyle={{ fontWeight: '700' }}
                                        buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                                        onPress={() => this.acceptedRequest(item.uid)}
                                    />
                                    <Button
                                        title="Rejeitar"
                                        titleStyle={{ fontWeight: '700' }}
                                        buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                                        onPress={() => console.log('rejeitei')}
                                    />
                                </View>
                            </Card>
                        )} />
                </ScrollView>
            }
            if (this.state.usersAccepted.length == 0) {
                usersActive = <Text style={styles.subtitle} h4>Sem alunos ativos.</Text>

            } else {
                usersActive = <ScrollView>
                    <Text style={styles.subtitle} h4>Alunos ativos:</Text>
                    <FlatList
                        data={this.state.usersAccepted}
                        keyExtractor={item => item.uid.toString()}
                        renderItem={({ item }) => (
                            <Card title={item.name + ' - ' + item.role}>
                            </Card>
                        )} />
                </ScrollView>
            }
        } else if (this.state.user.role == "Student")  {            
            screen =
                <View>
                    <Text style={styles.subtitle} h4>EXPERIÊNCIA</Text>
                    <View style={styles.xpBar}></View>
                    <Text h5>{this.state.status.exp} xp</Text>
                    <Text style={styles.subtitle} h4>{this.state.status.qntAbsence} FALTAS</Text>
                    <View style={styles.faults}>                        
                        {this.generateFaults(this.props.classroom.qntAbsence, this.state.status.qntAbsence)}                        
                    </View>
                    <Button
                        title="Adicionar Faulta"
                        titleStyle={{ fontWeight: '700' }}
                        buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                        onPress={() => this.addFault()}
                    />
                    <Text style={styles.subtitle} h4>CONQUISTAS</Text>
                    <FlatList
                        data={this.state.achievements}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <Card title={item.title}>
                            </Card>
                        )}
                    />
                </View>
        }

        return (
            <View style={styles.container}>
                {screen}
                <View
                    style={{
                        borderBottomColor: 'black',
                        borderBottomWidth: 1,
                    }}
                />
                {usersActive}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    xpBar: {
        width: "80%",
        height: 5,
        backgroundColor: "#000",
        borderRadius: 5,
    },
    faults: {
        flexDirection: 'row'
    }
});