import React from 'react';
import { StyleSheet, ScrollView, View, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';
import { Rank } from './Rank';
import { Profile } from '../profile/UserProfile';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class StudentBoard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classroom: this.props.classroom,
            professor: {},
            loadingBoard: true,
            loadingProfessor: true,
            refreshing: false,
            notifications: []
        }
        this.loadNotifications()
        this.loadClass()
    }

    loadProfessor = (professorUid) => {
        ref = firebase.firestore().collection("users")
        ref.where("uid", "==", professorUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                professor = doc.data();
            })
            this.setState({ professor: professor, loadingProfessor: false })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadClass = () => {
        console.log('this.props.classroom')
        console.log(this.props.classroom)
        ref = firebase.firestore().collection("classes")
        ref.where("uid", "==", this.props.classroom.uid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                classroom = doc.data();
            })
            this.loadProfessor(classroom.professorUid)
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadNotifications = () => {
        ref = firebase.firestore().collection("notifications")
        let array = []
        ref.where("classUid", "==", this.state.classroom.uid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ notifications: array, refreshing: false, loadingBoard: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadNotifications()
    }

    render() {
        let profCard = null;
        if(this.state.loadingProfessor){
            profCard = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            profCard = <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('ProfessorProfile', { uid: this.state.professor.uid})}>
                    <Card flexDirection="row" wrapperStyle={{alignItems: 'center',}}>
                        <Image 
                        resizeMode='contain'
                        style={styles.professorIcon}
                        source={require('../../assets/img/professor.png')}
                        />

                        <View style={{marginLeft: 20}}>
                            <Text>Professor</Text>
                            <Text h4>{ this.state.professor.name}</Text>
                        </View>
                    </Card>
                </TouchableWithoutFeedback>
        }

        var content = null;
        if(this.state.loadingBoard == true) {
            content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.notifications.length == 0 ) {
                content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Relaxa, nenhuma novidade.</Text>
                    <Image 
                    style={styles.emptyIcon} 
                    resizeMode='contain'
                    source={require('../../assets/img/notifications.png')}
                    />
                </View>
            } else {
                content = <FlatList
                data={this.state.notifications}
                style={styles.list}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <Card>
                        <Text h5 style={{fontWeight: '800'}}>{item.title}</Text>
                        <Text>{item.description}</Text>
                    </Card>
                )}
                />
            }
        }        

        return(
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
                }>

                { profCard }
                
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('Rank', { classroom: this.state.classroom })}>
                            <View
                            style={{marginVertical: 30}} wrapperStyle={styles.rankBtn}
                            flexDirection='column' alignItems='center'>
                                <Icon color={Constants.Colors.Primary} type='font-awesome' name='trophy'/>
                                <Text h5 style={{color: Constants.Colors.Primary, fontWeight: 'bold',}}>RANK</Text>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('Achievements', { classroom: this.state.classroom, user: this.state.user })}>                    
                            <View style={{marginVertical: 30}} wrapperStyle={styles.rankBtn}
                            flexDirection='column'>
                                <Icon color={Constants.Colors.Primary} type='ionicon' name='ios-medal'/>
                                <Text h5 style={{color: Constants.Colors.Primary, fontWeight: 'bold',}}>CONQUISTAS</Text>
                            </View>
                        </TouchableWithoutFeedback>
                </View>

                <Text h5 style={styles.subtitle}>MURAL</Text>

                { content }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    rankBtn: {
        padding: 10,
        justifyContent: 'space-around',
    },
    subtitle: {
        alignSelf: 'center',
        fontFamily: 'montserrat_bold',
    }, 
    professorIcon: {
        width: 50,
        height: 50
    },
    list: {
        marginBottom: 20
    },
    emptyIcon: {
        width: 200
    }
});