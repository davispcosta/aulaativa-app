import React from 'react';
import { StyleSheet, ScrollView, View, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';
import { Rank } from './Rank';
import { Profile } from '../profile/UserProfile';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Board extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classUid: this.props.classUid,
            professor: {},
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
            this.setState({ professor: professor })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadClass = () => {
        ref = firebase.firestore().collection("classes")
        ref.where("uid", "==", this.state.classUid).get().then(function(querySnapshot) {
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
        ref.where("classUid", "==", this.state.classUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ notifications: array, refreshing: false})
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
        let newOnMural = null;

        if(this.state.user.role == "Professor") {
            newOnMural = <Button
                            title="ADICIONAR NO MURAL" 
                            titleStyle={{ fontWeight: '700'}}
                            buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                            onPress={() => this.props.navigation.navigate('NewNotification', { classUid: this.state.classUid})}
                        />
        } else {
            profCard = <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('ProfessorProfile', { uid: this.state.professor.uid})}>
                            <Card flexDirection="row" wrapperStyle={{alignItems: 'center',}}>
                                <Icon
                                    raised
                                    containerStyle={{backgroundColor:'#AFAFAF'}}
                                    name='user'
                                    type='font-awesome'
                                    color='#f1f1f1'
                                />

                                <View style={{marginLeft: 20}}>
                                    <Text>Professor</Text>
                                    <Text h4>{ this.state.professor.name}</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
        }

        return(
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
                }>

                {profCard}
                
                <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('Rank', { screen: Rank})}>
                    
                    <Card containerStyle={{marginBottom: 20, backgroundColor: Constants.Colors.Primary}} wrapperStyle={styles.rankBtn}
                    flexDirection='row'>
                        <Icon color='#f1f1f1' type='font-awesome' name='trophy'/>
                        <Text h3 style={{color: "white", fontWeight: 'bold',}}>RANK</Text>
                        <Icon color='#f1f1f1' type='materialicons' name='keyboard-arrow-right' />
                    </Card>

                </TouchableWithoutFeedback>

                <Text h5 style={styles.subtitle}>MURAL</Text>

                {newOnMural}

                <FlatList
                data={this.state.notifications}
                style={styles.list}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <Card title={item.title}>
                        <Text>{item.description}</Text>
                    </Card>
                )}
                />

            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
    rankBtn: {
        padding: 10,
        justifyContent: 'space-around',
    },
    subtitle: {
        alignSelf: 'center',
    }, 
    list: {
        marginBottom: 20
    },
});