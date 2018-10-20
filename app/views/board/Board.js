import React from 'react';
import { StyleSheet, ScrollView, View, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';
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
        let newOnMural = null;

        if(this.state.user.role == "Professor" && !this.state.loadingProfessor ) {
            newOnMural = <Button
                            title="ADICIONAR NO MURAL" 
                            titleStyle={{ fontWeight: '700'}}
                            buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                            onPress={() => this.props.navigation.navigate('NewNotification', { classroom: this.state.classroom})}
                        />
        } else if(this.state.user.role == "Student" && !this.state.loadingProfessor){
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

        var emptyDiv;
        if(this.state.notifications.length == 0 && !this.state.loadingBoard) {
            emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Relaxa, nenhuma novidade.</Text>
                        <Image 
                        style={styles.emptyIcon} 
                        resizeMode='contain'
                        source={require('../../assets/img/notifications.png')}
                        />
                    </View>
        } else {
            emptyDiv = null;
        }

        var loadingBoardDiv;
        if(this.state.loadingBoard == true) {
            loadingBoardDiv = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            loadingBoardDiv = null
        }

        var loadingProfessorDiv;
        if(this.state.loadingProfessor == true) {
            loadingProfessorDiv = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            loadingProfessorDiv = null
        }

        return(
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
                }>

                { loadingProfessorDiv }
                { profCard }
                
                <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('Rank', { classroom: this.state.classroom })}>
                    
                    <Card containerStyle={{marginBottom: 20, backgroundColor: Constants.Colors.Primary}} wrapperStyle={styles.rankBtn}
                    flexDirection='row'>
                        <Icon color='#f1f1f1' type='font-awesome' name='trophy'/>
                        <Text h3 style={{color: "white", fontWeight: 'bold',}}>RANK</Text>
                        <Icon color='#f1f1f1' type='materialicons' name='keyboard-arrow-right' />
                    </Card>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('Achievements', { screen: Achievements})}>                    
                    <Card containerStyle={{marginBottom: 20, backgroundColor: Constants.Colors.Primary}} wrapperStyle={styles.rankBtn}
                    flexDirection='row'>
                        <Icon color='#f1f1f1' type='material-community' name='medal'/>
                        <Text h3 style={{color: "white", fontWeight: 'bold',}}>CONQUISTAS</Text>
                        <Icon color='#f1f1f1' type='materialicons' name='keyboard-arrow-right' />
                    </Card>
                </TouchableWithoutFeedback>

                <Text h5 style={styles.subtitle}>MURAL</Text>

                {newOnMural}
                { loadingBoardDiv }
                { emptyDiv }

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
    emptyIcon: {
        width: 200
    }
});