import React from 'react';
import { StyleSheet, ScrollView, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Icon, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import { Constants } from '../../Constants';
import { ProfessorStatus } from './ProfessorStatus';
import { StudentStatus } from './StudentStatus';

export class Status extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            classUid: this.props.classroom.uid,
            user: {}
        }
    }

    componentDidMount = () => {
        this.loadUser();        
    }

    loadUser = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("users")
        ref.where("uid", "==", currentUser.uid).get().then(function (querySnapshot) {
            var user = {}
            querySnapshot.forEach(function (doc) {
                user = doc.data();
            })
            this.setState({ user: user })            
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    render() {
        let screen = null;

        if (this.state.user.role == "Professor") {
            screen = <ProfessorStatus classUid={this.state.classUid} user={this.state.user}/>
        } else if (this.state.user.role == "Student")  {            
            screen = <StudentStatus classUid={this.state.classUid} user={this.state.user} classroom={this.props.classroom}/>
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
    }
});