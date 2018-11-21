import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, View, ScrollView, Picker, Alert, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, FormInput, Icon } from 'react-native-elements';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions: this.props.questions,
            powers: this.props.powers,
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
        ref = firebase.firestore().collection("alternatives")
        let array = []
        ref.where("questionUid", "==", uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (d) {
                array.push(d.data());
            })
            array.forEach(function (obj) { obj.checked = false })
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

    verifyAlternative = (item, index) => {
        const { currentUser } = firebase.auth();

        var newKey = firebase.database().ref().child('studentAlternatives').push().key;

        let answer = this.verifyAnswerQuestion(item.uid);

        if (answer == null) {
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

            var array = [...this.state.alternatives]
            array[index].checked = !array[index].checked;
            this.setState({alternatives: array})
            console.log(this.state.alternatives)

            if (item.isRight) {
                Alert.alert("Correto!", "Uhuul, você acertou essa!", [{text: 'Próxima', onPress: () => this.changeQuestion() }], { cancelable: false})
                let correct = this.state.corrects + 1;
                this.setState({ corrects: correct })
            } else {
                Alert.alert("Errado!", "Vish, quem sabe na próxima!", [{text: 'Próxima', onPress: () => { this.changeQuestion() }}])
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

    getAlternativeCard = (item, index) => {
        
        if(item.checked) {
            return <Card flexDirection="row" style={{ color: Constants.Colors.Primary}}>
                <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                    <Text
                        fontFamily='montserrat_semi_bold'
                        style={{ color: Constants.Colors.Primary }}
                        h5>{item.alternative}</Text>
                </View>
            </Card>
        } else {
            return <Card flexDirection="row" style={{ color: Constants.Colors.Primary }}>    
                <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                    <Text
                        fontFamily='montserrat_semi_bold'
                        style={{ color: Constants.Colors.Primary }}
                        h5>{item.alternative}</Text>
                </View>
            </Card>
        }
    }

    colar = () => {
        console.log('COLAR')
    }

    ajudaDosUniversitarios = () => {
        console.log('ajudaDosUniversitarios')
    }

    menosUm = () => {
        let alt = this.state.alternatives.filter(a => a.isRight == false)
        if(alt.length == 0) {
            alert("Inválido", "Não foi possível usar esse poder aqui")
        } else {
            var alternatives = this.state.alternatives.filter(a => a.uid != alt[0].uid)
        this.setState({ alternatives: alternatives})
        }  
        
    }

    naMetade = () => {
        let alt = this.state.alternatives.filter(a => a.isRight == false);
        let number = Math.floor(alt.length/2);
        var alternatives = this.state.alternatives;
        for(i = 0; i<number; i++) {
            alternatives = alternatives.filter(a => a.uid != alt[i].uid)
        }
        this.setState({ alternatives: alternatives})
    }

    duasCaras = () => {
        let wrong = this.state.alternatives.filter(a => a.isRight == false)
        let right = this.state.alternatives.filter(a => a.isRight == true)
        var alternatives = []
        if(wrong.length == 0 || right.length == 0) {
            alert("Inválido", "Não foi possível usar esse poder aqui")
        } else {
            alternatives.push(wrong[0]);
            alternatives.push(right[0]);
            this.setState({ alternatives: alternatives})
        }        
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
                    renderItem={({ item, index }) => (
                        <TouchableWithoutFeedback onPress={() => this.verifyAlternative(item, index)}>
                            {this.getAlternativeCard(item)}                    
                        </TouchableWithoutFeedback>
                    )}
                />
                </View>

                {loadingDiv}
        }
        return (
            <View style={{flex: 1, height: '100%'}}>
                <View flexDirection='row' style={{ height: 100, backgroundColor: 'red', justifyContent: 'space-around' }}>
                    <TouchableWithoutFeedback
                        onPress={() => this.ajudaDosUniversitarios()}
                    >
                        <Icon
                            type='entypo'
                            name='copy'
                            color='#f1f1f1'
                            onPress={() => this.colar()}
                        />
                        <Text h5>0</Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.ajudaDosUniversitarios()}
                    >
                        <Icon
                            type='font-awesome'
                            name='university'
                            color='#f1f1f1'
                        />
                        <Text h5>0</Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.duasCaras()}
                    >
                        <Icon
                            type='font-awesome'
                            name='users'
                            color='#f1f1f1'
                        />
                        <Text h5>0</Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.naMetade()}
                    >
                        <Icon
                            type='font-awesome'
                            name='scissors'
                            color='#f1f1f1'                        
                        />
                        <Text h5>0</Text>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.menosUm()}
                    >
                        <Icon
                            type='font-awesome'
                            name='minus'
                            color='#f1f1f1'                        
                        />

                        <Text h5>0</Text>
                    </TouchableWithoutFeedback>
                </View>

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
