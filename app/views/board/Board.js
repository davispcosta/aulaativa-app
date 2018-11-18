import React from 'react';
import { StyleSheet, ScrollView, View, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';
import { ProfessorBoard } from './ProfessorBoard';
import { StudentBoard } from './StudentBoard';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Board extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,            
        }
    }

    render() {
        var screen = null;
        if(this.state.user.role == "Professor") {
            screen = <ProfessorBoard classroom={this.props.classroom} user={this.state.user} navigation={this.props.navigation}/>
        } else if(this.state.user.role == "Student"){
            screen = <StudentBoard classroom={this.props.classroom} user={this.state.user} navigation={this.props.navigation}/>
        }

        return(
            <ScrollView 
                style={styles.container}>
                { screen }                
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    }
});