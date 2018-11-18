import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ProfessorEvents } from './ProfessorEvents';
import { StudentEvents } from './StudentEvents';

export class Events extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classUid: this.props.classroom.uid,
        }
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadEvents()
    }

    render() {
        var screen = null;
        if(this.state.user.role == "Professor") {
            screen = <ProfessorEvents user={this.state.user} classUid={this.state.classUid} navigation={this.props.navigation}/>
        } else if(this.state.user.role == "Student") {
            screen = <StudentEvents user={this.state.user} classUid={this.state.classUid} navigation={this.props.navigation}/>
        }

        return(
            <ScrollView>
               { screen } 
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
});