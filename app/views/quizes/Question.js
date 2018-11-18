import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, Picker, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, FormInput, Icon } from 'react-native-elements';
import { HeaderSection } from '../../sections/HeaderSection';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: this.props.questions,
            alternatives: [],
            numberQuestion: 0,
            corrects: 0,
            total: 0,
            checked: false,
            isCorrect: false,
            answersStudents: [],
            answerCorrect: null,
            loading: true,
            finished: false
        }

        this.loadAlternatives(this.state.questions[this.state.numberQuestion].uid);
    }

    loadAlternatives = (uid) => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("alternatives")
        let array = []
        ref.where("questionUid", "==", uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (d) {
                array.push(d.data());
            })
            this.setState({ alternatives: array, loading: false })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadAnswersStudent = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("studentAlternatives")
        let array = []
        ref.where("studentUid", "==", currentUser.uid)
            .where("quizUid", "==", this.state.questions[0].quizUid)
            .get().then(function (querySnapshot) {
                querySnapshot.forEach(function (d) {
                    array.push(d.data());
                })
                this.setState({ answersStudents: array })
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
    }

    verifyAlternative = (item) => {
        const { currentUser } = firebase.auth();

        var newKey = firebase.database().ref().child('studentAlternatives').push().key;

        let answer = this.verifyAnswerQuestion(item.uid);

        if (answer.uid == undefined) {
            ref = firebase.firestore().collection('studentAlternatives')
            ref.add({
                uid: newKey,
                quizUid: this.state.questions[0].quizUid,
                alternativeUid: item.uid,
                studentUid: currentUser.uid,
                isRight: item.isRight,
                data: new Date()
            })
                .then((response) => {
                    console.log('alternativa armazenada')
                }).catch((error) => {
                    alert(error.message)
                })

            if (item.isRight) {
                alert("Resposta correta.")
                let correct = this.state.corrects + 1;
                this.setState({ corrects: correct })

            } else {
                alert("Resposta errada.")
            }

        }
    }
    changeQuestion = () => {
        let number = this.state.numberQuestion + 1;

        if (number <= this.state.questions.length - 1) {
            this.setState({ numberQuestion: number })
            this.loadAlternatives(this.state.questions[this.state.numberQuestion].uid)
        }

        if (number == this.state.questions.length) {
            this.setState({ total: this.state.questions.length })
            this.setState({ finished: true })
        }
        this.setState({ checked: false })
    }

    verifyAnswerQuestion = (alternativeUid) => {
        const { currentUser } = firebase.auth();

        let answer = this.state.answersStudents.find(function (element) {
            return element.alternativeUid == alternativeUid
                && element.studentUid == currentUser.uid
        });

        return answer;
    }

    render() {
        let btnPassQuestion = null;
        let questionView = null;

        if (this.state.checked && !this.state.finished) {
            btnPassQuestion = <Icon
                raised
                containerStyle={{ backgroundColor: '#AFAFAF' }}
                type='font-awesome'
                name='arrow-right'
                color='#f1f1f1'
                onPress={() => this.changeQuestion()}
            />
        }

        if (this.state.finished) {
            questionView = <Text style={styles.baseText}>Seu resultado: {this.state.corrects}/{this.state.total} </Text>
        }

        var loadingDiv;
        if (this.state.loading == true) {
            loadingDiv = <View style={{ padding: 10, marginVertical: 20 }}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            loadingDiv = null
        }

        if (!this.state.finished) {
            questionView =
                <View>
                    <View>
                        <Card wrapperStyle={styles.questionWrapper}>
                            <Text>{this.state.questions[this.state.numberQuestion].question}</Text>
                        </Card>
                        <Text h4 style={{ alignSelf: 'center', fontWeight: '800', marginVertical: 20 }}>ALTERNATIVAS</Text>
                    </View>

                    <FlatList
                    data={this.state.alternatives}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback onPress={() => this.verifyAlternative(item)}>
                            <Card flexDirection="row" style={{ color: Constants.Colors.Primary }}>
                                <Icon
                                    raised
                                    containerStyle={{ backgroundColor: '#AFAFAF' }}
                                    name='class'
                                    color='#f1f1f1'
                                />
                                <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                                    <Text
                                        fontFamily='montserrat_semi_bold'
                                        style={{ color: Constants.Colors.Primary }}
                                        h5>{item.alternative}</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
                    )}
                />
                </View>

                {loadingDiv}

        }
        return (
            <View>
                <ScrollView>
                    {questionView}
                    {btnPassQuestion}
                </ScrollView>
            </View>
        )
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
    },
    baseText: {
        color: Constants.Colors.Primary,
        paddingHorizontal: 20,
        paddingTop: 20,
        fontFamily: "montserrat_bold"
    }
});
