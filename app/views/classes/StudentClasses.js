import React from 'react';
import { Image, StyleSheet, View, ScrollView, Alert, FlatList, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Text, Icon, Button } from 'react-native-elements';
import { HeaderSection } from '../../sections/HeaderSection';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';


export class StudentClasses extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            subscription: {},
            subscriptions: [],
            classes: [],
            professors: []
        }
        this.loadClasses();
    }

    loadClasses = () => {
        // ref = firebase.firestore().collection("classes")
        // let array = []
        // ref.where("instituitionUid", "==", this.props.user.instituitionUid).get().then(function (querySnapshot) {
        //     querySnapshot.forEach(function (doc) {
        //         var classroom = doc.data()
        //         if(classroom.active) {
        //             array.push(classroom);
        //         }
        //     })
        //     this.setState({ classes: array, refreshing: false, loading: false })
        // }.bind(this)).catch(function (error) {
        //     console.log(error)
        //     alert(error.message)
        // })

        ref = firebase.firestore().collection("classes")
        let classrooms = []
        let professors = []
        ref.where("instituitionUid", "==", this.props.user.instituitionUid).get().then( snapshot => {

            snapshot.forEach((doc) => {
                let classroom = {}
                classroom= doc.data();
                let professorUid = classroom.professorUid;
                console.log('professorUid')
                console.log(professorUid)
                if(classroom.active) {
                    firebase.firestore().collection('users').where("uid", "==", professorUid).get().then( snapshot => {
                        let professor;
                        snapshot.forEach((doc) => {
                            professor = doc.data();
                        })
                        professors.push(professor);
                        classrooms.push(classroom);
                        console.log(professors)
                        console.log(classrooms)
                        this.setState({ classes: classrooms, professors: professors, refreshing: false, loading: false})  
                    })
                }
            })                  
        })
    }

    verifySubscription = (classroom) => {
        if (this.state.subscription.uid == undefined) {
            Alert.alert(
                'Atenção!',
                'Você não está inscrito nessa disciplina.',
                [
                    { text: 'Inscrever-se?', onPress: () => this.seekSubscription(classroom.uid) },
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
            this.props.navigation.navigate('MaterialTabs', { user: this.props.user, classroom: classroom })
        }
    }

    seekSubscription = (classUid) => {
        const { currentUser } = firebase.auth();
        var newKey = firebase.database().ref().child('subscriptions').push().key;

        ref = firebase.firestore().collection('subscriptions')
        ref.add({ name: this.state.user.name, accepted: false, classUid: classUid, exp: 0, qntAbsence: 0, studentUid: currentUser.uid, uid: newKey }).then((response) => {
            alert('Solicitação enviada com sucesso.')
        }).catch((error) => {
            alert(error.message)
        })
    }

    loadUsersSubscriptions = () => {
        ref = firebase.firestore().collection("subscriptions")
        ref.where("studentUid", "==", this.props.user.uid)
        .where("accepted", "==", true).get().then(function (querySnapshot) {
            var subs = []
            querySnapshot.forEach(function (doc) {
                subs.push(doc.data())
            })
            this.setState({ subscriptions: subs }, () => { this.myclasses() })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadSubscription = (userUid, classroom) => {
        ref = firebase.firestore().collection('subscriptions')
        let subs = {}
        ref.where("studentUid", "==", userUid)
        .where("classUid", "==", classroom.uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                subs = doc.data();
            })
            this.setState({ subscription: subs }, () => {
                this.verifySubscription(classroom)
            })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    getClasses = (item, index) => {
        return <Card flexDirection="row" wrapperStyle={{alignItems: 'center'}}>
            <Icon                                
                name='class'
                color={Constants.Colors.Primary}
            />
            <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                <Text
                    fontFamily='montserrat_semi_bold'
                    style={{ color: Constants.Colors.Primary }}
                    h5>{item.name}</Text>
                <Text
                    fontFamily='montserrat_semi_bold'
                    style={{ color: Constants.Colors.Gray }}
                    h5>{this.state.professors[index].name}</Text>
            </View>
        </Card>
    }

    render() {
        var classes = null;
        if (this.state.loading == true) {
            classes = <View style={{ padding: 10, marginVertical: 20 }}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.classes.length == 0) {
                classes = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30 }} h4>Você não possui classes adicionadas ainda.</Text>
                <Image
                    style={styles.emptyIcon}
                    resizeMode='contain'
                    source={require('../../assets/img/pencils.png')}
                />
                </View>
            } else {
                classes = <FlatList
                data={this.state.classes}
                keyExtractor={item => item.uid.toString()}
                renderItem={({ item, index }) => (
                    <TouchableWithoutFeedback
                        onPress={() => this.loadSubscription(this.props.user.uid, item)}
                    >
                        {this.getClasses(item, index)}
                    </TouchableWithoutFeedback>
                )} />
            }
        }
        return (
            <ScrollView>                
                { classes }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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