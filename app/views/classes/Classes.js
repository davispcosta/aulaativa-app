import React from 'react';
import { StyleSheet, View } from 'react-native';;
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';
import { ProfessorClasses } from './ProfessorClasses';
import { StudentClasses } from './StudentClasses';

export class Classes extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
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
        var screen;
        if(this.state.user.role == "Professor") {
            screen = <ProfessorClasses user={this.state.user} navigation={this.props.navigation}/>
        } else if(this.state.user.role == "Student"){
            screen = <StudentClasses user={this.state.user} navigation={this.props.navigation}/>
        }
        return (
            <View style={styles.container}>
                <HeaderSection title="Turmas" navigation={this.props.navigation} logOut={true} />
                { screen }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});