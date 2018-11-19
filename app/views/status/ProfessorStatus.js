import React from 'react';
import { StyleSheet, ScrollView, View, Image, ActivityIndicator, FlatList } from 'react-native';
import { Card, Header, Text, Icon, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import { Constants } from '../../Constants';

export class ProfessorStatus extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            classUid: this.props.classUid,
            user: this.props.user,
            subsAccepted: [],
            unsupportedSubs: [],
            usersAccepted: [],
            unsupportedUsers: [],
            loadingSubs: true,
            loadingStudents: true
        }
    }

    componentDidMount = () => {
        this.setState({ loadingSubs: true, loadingStudents: true, unsupportedUsers: [], usersAccepted: [] })
        this.loadUnsupportedSubscriptions();
        this.loadSupportedSubscriptions();
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
                    this.setState({ usersAccepted: array, loadingStudents: false })
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            })
        } else {
            this.setState({ loadingStudents: false })
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
                    this.setState({ unsupportedUsers: array, loadingSubs: false })
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            })
        } else {
            this.setState({ loadingSubs: false })
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
            .then( (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, ' => ', doc.data())
                    ref.doc(doc.id).update({ accepted: true })                    
                    this.componentDidMount()
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
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    ref.doc(doc.id).delete().then(() => {
                        this.componentDidMount()
                    })
                })
            })
    }

    render() {
        var subs;
        if(this.state.loadingSubs == true) {
            subs = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if (this.state.unsupportedUsers.length == 0) {
                subs = <Text style={styles.info} h5>Nenhuma Solicitação</Text>
            } else {
                subs = <FlatList
                    data={this.state.unsupportedUsers}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({ item }) => (
                        <Card style={{flex: 1}} flexDirection="column" justifyContent='center'>
                            <Text style={{fontWeight: '700' }} h5>{item.name}</Text>
                            <Text style={{fontWeight: '700' }} h5>{item.email}</Text>
                            <View style={{flexDirection: 'column', justifyContent: "center"}}>
                                <Button
                                    title="Aceitar"
                                    titleStyle={{ fontWeight: '700' }}
                                    buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary, width: '100%' }}
                                    onPress={() => this.acceptedRequest(item.uid)}
                                />
                                <Button
                                    title="Rejeitar"
                                    titleStyle={{ fontWeight: '700' }}
                                    buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary, width: '100%' }}
                                    onPress={() => this.refuseRequest(item.uid)}
                                />
                            </View>
                        </Card>
                    )} />
            }
        }

        var students;
        if(this.state.loadingStudents == true) {
            students = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if (this.state.usersAccepted.length == 0) {
                students = <Text style={styles.info} h5>Sem alunos ativos.</Text>
            } else {
                students = <FlatList
                    data={this.state.usersAccepted}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({ item }) => (
                        <Card>
                            <Text h5 style={{fontWeight: '800'}}>{item.name}</Text>
                            <Text h5 style={{fontWeight: '400'}}>{item.email}</Text>
                        </Card>
                    )} />
            }
        }

        return (
            <ScrollView style={styles.container}>
                <Text h5 style={styles.subtitle}>SOLICITAÇÕES</Text>
                {subs}

                <Text h5 style={styles.subtitle}>ALUNOS</Text>
                {students}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    faults: {
        flexDirection: 'row'
    },
    subtitle: {
        marginTop: 20,
        alignSelf: 'center',
        fontFamily: 'montserrat_bold',
    },
    info: {
        marginTop: 10,
        marginBottom: 20,
        alignSelf: 'center',
    }
});