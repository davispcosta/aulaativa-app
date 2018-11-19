import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Icon } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection';
import { TouchableWithoutFeedback } from 'react-native';
import { Question } from './Question'
import * as firebase from 'firebase';

let question = null;

export class Questions extends React.Component {
    static navigationOption = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            quizUid: this.props.navigation.state.params.quizUid,
            questions: [],
            numberQuestion: 0
        };


        this.loadQuestions();
    }

    loadQuestions = () => {
        ref = firebase.firestore().collection("questions")
        let array = []
        ref.where("quizUid", "==", this.state.quizUid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                array.push(doc.data());
            })
            this.setState({ questions: array, refreshing: false, loading: false })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    render() {
        if (this.state.questions.length > 0) {
            question = <Question questions={this.state.questions} />
        }

        return (
            <View style={styles.container}>
                <HeaderSection navigation={this.props.navigation} goBack={true} />
                <ScrollView>
                    {question}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    questionWrapper: {
        padding: 20,
        borderWidth: 2,
        borderColor: '#9C00FF',
    },
    alternative: {
    }
});
