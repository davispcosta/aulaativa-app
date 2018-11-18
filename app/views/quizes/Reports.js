import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, Picker, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, FormInput, Icon } from 'react-native-elements';
import { HeaderSection } from '../../sections/HeaderSection';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Reports extends Component {

    constructor(props) {
        super(props);
        this.state = {
            quizUid = this.props.navigation.state.params.quizUid,
            answers: [],
            total: 0,
            corrects: 0,
            wrongs: 0
        }
    }

    componentDidMount = () => {
        this.loadStudentsAnswers()
    }

    loadStudentsAnswers = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("studentAlternatives")
        let array = []
        ref.where("quizUid", "==", this.state.quizUid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                array.push(doc.data());
            })
            this.setState({ answers: array, total: array.length }, () => { this.answersCorrects() })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }


    answersCorrects = () => {
        let corrects = 0;
        let wrongs = 0;

        this.state.answers.forEach(function (d) {
            if (!d.isRight) {
                wrongs = 0;
            } else {
                corrects = 0;
            }
        })

        this.setState({ corrects: corrects, wrongs: wrongs })

    }

    render() {
        return (
            <View>
                <Text> Relatórios </Text>
            </View>
        )
    }

}