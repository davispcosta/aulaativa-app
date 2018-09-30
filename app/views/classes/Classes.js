import React from 'react';
import { StyleSheet, View, ScrollView, Alert, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Text, Icon, Button } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants'
import * as firebase from 'firebase';

export class Classes extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            subscription: {},
            refreshing: false,
            loading: true,
            user: {}
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
            this.setState({ user: user }, () => this.loadClasses())
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadClasses = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("classes")
        let array = []

        let uid;
        let userUid;

        if (this.state.user.role == "Professor") {
            uid = "professorUid"
            userUid = currentUser.uid
        } else {
            uid = "instituitionUid"
            userUid = this.state.user.instituitionUid
        }

        ref.where(uid, "==", userUid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                array.push(doc.data());
            })
            this.setState({ classes: array, refreshing: false })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadSubscription = (userUid, classUid) => {
        const { currenstUser } = firebase.auth();

        ref = firebase.firestore().collection('subscriptions')
        let subs = {}
        ref.where("studentUid", "==", userUid)
            .where("classUid", "==", classUid).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    subs = doc.data();
                })
                this.setState({ subscription: subs }, () => {
                    this.verifySubscription(classUid)
                })
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
    }

    verifySubscription = (classUid) => {
        if (this.state.subscription.uid == undefined) {
            Alert.alert(
                'Atenção!',
                'Você não está inscrito nessa disciplina.',
                [
                    { text: 'Inscrever-se?', onPress: () => this.seekSubscription(classUid) },
                    { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Ok', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        } else if (!this.state.subscription.accepted) {
            Alert.alert(
                'Atenção!',
                'Sua requisição para essa disciplina ainda não foi aceita.',
                [
                    { text: 'Cancelar', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                    { text: 'Ok', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
            )
        } else {
            this.props.navigation.navigate('MaterialTabs', { user: this.state.user, classUid: classUid })
        }
    }

    seekSubscription = (classUid) => {
        const { currentUser } = firebase.auth();

        var newKey = firebase.database().ref().child('subscriptions').push().key;

        ref = firebase.firestore().collection('subscriptions')
        ref.add({ accepted: false, classUid: classUid, exp: 0, qntAbsence: 0, studentUid: currentUser.uid, uid: newKey }).then((response) => {
            alert('Solicitação enviada com sucesso.')
        }).catch((error) => {
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.loadUser()
    }

    render() {

        var btnNew;
        var allClasses;

        if (this.state.user.role == "Professor") {
            btnNew = <Button
                title="NOVA TURMA"
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                onPress={() => this.props.navigation.navigate('NewClass')}
            />
            allClasses = <FlatList
                data={this.state.classes}
                keyExtractor={item => item.uid.toString()}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('MaterialTabs', { user: this.state.user, classUid: item.uid.toString() })}
                    >
                        <Card flexDirection="row">
                            <Icon
                                raised
                                containerStyle={{ backgroundColor: '#AFAFAF' }}
                                name='class'
                                color='#f1f1f1'
                            />
                            <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                                <Text
                                    fontFamily='montserrat_semi_bold'
                                    style={{ color: Constants.Colors.Primary }}
                                    h5>{item.name}</Text>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                )}
            />

        } else {
            allClasses = <FlatList
                data={this.state.classes}
                keyExtractor={item => item.uid.toString()}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                        onPress={() => this.loadSubscription(this.state.user.uid, item.uid)}
                    >
                        <Card flexDirection="row">
                            <Icon
                                raised
                                containerStyle={{ backgroundColor: '#AFAFAF' }}
                                name='class'
                                color='#f1f1f1'
                            />
                            <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                                <Text
                                    fontFamily='montserrat_semi_bold'
                                    style={{ color: Constants.Colors.Primary }}
                                    h5>{item.name}</Text>
                            </View>
                        </Card>
                    </TouchableWithoutFeedback>
                )} />
        }

        var emptyDiv;
        if (this.state.classes.length == 0 && !this.state.loading) {
            emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30 }} h4>Você não possui classes adicionadas ainda.</Text>
                <Image
                    style={styles.emptyIcon}
                    resizeMode='contain'
                    source={require('../../assets/img/pencils.png')}
                />
            </View>
        } else {
            emptyDiv = null;
        }

        var loadingDiv;
        if (this.state.loading == true) {
            loadingDiv = <View style={{ padding: 10, marginVertical: 20 }}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            loadingDiv = null
        }

        return (
            <View style={styles.container}>
                <HeaderSection navigation={this.props.navigation} logOut={true} goToProfile={true} />

                {btnNew}
                {allClasses}

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                    }>

                    {loadingDiv}
                    {emptyDiv}
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
    }
});