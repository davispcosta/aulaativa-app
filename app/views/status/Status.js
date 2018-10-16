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
            classUid: this.props.navigation.state.params.classUid,
            user: {},
            subsAccepted: [],
            unsupportedSubs: [],
            usersAccepted: [],
            unsupportedUsers: []
        }
        this.loadUser()
    }

    loadUser = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("users")
        ref.where("uid", "==", currentUser.uid).get().then(function (querySnapshot) {
            var user = {}
            querySnapshot.forEach(function (doc) {
                user = doc.data();
            })
            this.setState({ user: user },
                () => { this.loadUnsupportedSubscriptions() },
                () => { this.loadSupportedSubscriptions() })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadAcceptedUsers = () => {
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

    loadUnsupportedUsers = () => {
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
                var subs = []
                querySnapshot.forEach(function (doc) {
                    subs.push(doc.data())
                })
                this.setState({ subsAccepted: subs }, () => this.loadAcceptedUsers())
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
    }

    acceptedRequest = (uid) => {
        alert(
            this.state.unsupportedSubs.find(function (element) {
                return element.studentUid == uid
            }).uid
        )
        // firebase.firestore().doc('accepted').update({
        //     'accepted': true
        // })
    }

    generateFaults() {
        const faults = [];
        for(let i=0; i<10; i++) {
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

        if (this.state.user.role == "Professor") {
                screen = 
                <ScrollView contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{ marginTop: 20,}} h4>Solicitações</Text>
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
                    <Text h4>Alunos</Text>
                    <FlatList
                        data={this.state.usersAccepted}
                        keyExtractor={item => item.uid.toString()}
                        renderItem={({ item }) => (
                            <Card title={item.name}>
                            </Card>
                        )} />
                </ScrollView>
        } else if (this.state.user.role == "Student")  {
            screen =
                <View>
                    <Text style={styles.subtitle} h4>EXPERIÊNCIA</Text>
                    <View style={styles.xpBar}></View>
                    <Text h5>220 xp</Text>
                    <Text style={styles.subtitle} h4>FALTAS</Text>
                    <View style={styles.faults}>
                        {this.generateFaults()}
                    </View>
                    <Text style={styles.subtitle} h4>CONQUISTAS</Text>
                    <FlatList
                        data={achievements}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({item}) => (
                            <Card title={item.title}>
                            </Card>
                        )}
                    />
                </View>
        }

        return (
            <View style={styles.container}>
                {screen}
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

const achievements = [{
    id: 0,
    title: 'Trabalho Entregue',
},{
    id: 1,
    title: 'Ponto Na VP1',
}]