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
            alternatives: [],
            numberQuestion: 0,
            corrects: 0,
            total: 0,
            checked: false,
            isCorrect: false,
            answersStudents: [],
            quiz: this.props.quiz,
            answerCorrect: null,
            loading: true,
            finished: false,
            answer: ''
        }
        if(this.props.quiz.type == 1) {
            this.loadAlternatives(this.state.questions[this.state.numberQuestion].uid);
        }
        console.log(this.props.quiz)
    }

    loadAlternatives = (uid) => {
        ref = firebase.firestore().collection("alternatives")
        let array = []
        ref.where("questionUid", "==", uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (d) {
                array.push(d.data());
            })
            array.forEach(function (obj) { obj.checked = false })
            this.setState({ alternatives: array, loading: false }, () => {
                console.log('this.state.alternatives')
                console.log(this.state.alternatives)
            })
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
        ref = firebase.firestore().collection("studentAlternatives")
        let array = []
        if(this.state.qntColar != 0) {
            ref.where("quizUid", "==", this.state.questions[0].uid)
            .get().then(function (querySnapshot) {
                querySnapshot.forEach(function (d) {
                    array.push(d.data());
                })                
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
            var answers = []
            this.state.alternatives.forEach((alternativa) => {
                let answer = array.filter(a => a.alternativeUid == alternativa.uid)
                answer.forEach(a => {
                    answers.push(a)
                })
            });
            console.log(answers)
            if(answers.length == 0) {
                alert("Inválido - Não foi possível usar esse poder aqui")
            } else {        
                let quiz = this.state.quiz;
                quiz.qntColar -= 1;
                this.setState({ quiz: quiz})    
                let alternative = this.state.alternatives.filter(a => a.uid == answers[0].alternativeUid)
                alert("A alternativa respondida por um dos alunos foi: " + alternative[0].alternative)
            }
        } else {
            alert("Sem esse poder")
        }        
    }

    ajudaDosUniversitarios = () => {
        if(this.state.qntUniversitarios != 0) {
            ref = firebase.firestore().collection("studentAlternatives")
            let array = []
            ref.where("quizUid", "==", this.state.questions[0].uid)
                .get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (d) {
                        array.push(d.data());
                    })                
                }.bind(this)).catch(function (error) {
                    console.log(error)
                    alert(error.message)
                })
            var answers = []
            let answerTxt = ''
            this.state.alternatives.forEach((alternativa) => {
                let answer = array.filter(a => a.alternativeUid == alternativa.uid)  
                answerTxt += '  Alternativa: ' + alternativa.alternative + '\n'
                answerTxt += '  Quantidade: ' + answer.length + '\n'
                answerTxt += '-------------- \n'
                if(answer.length == 0)          
                    answers.push(answer)
            });
            alert(answerTxt)
            let quiz = this.state.quiz;
            quiz.qntUniversitarios -= 1;
            this.setState({ quiz: quiz})
        } else {
            alert("Sem esse poder")
        }
        
    }

    menosUm = () => {
        if(this.state.menosUm != 0) {
            let alt = this.state.alternatives.filter(a => a.isRight == false)
            if(alt.length == 0) {
                alert("Inválido", "Não foi possível usar esse poder aqui")
            } else {
                var alternatives = this.state.alternatives.filter(a => a.uid != alt[0].uid)
            let quiz = this.state.quiz;
            quiz.qntMenosUm -= 1;
            this.setState({ alternatives: alternatives, quiz: quiz})
            }  
        } else {
            alert("Sem esse poder")
        }       
    }

    naMetade = () => {
        if(this.state.naMetade != 0) {
            let alt = this.state.alternatives.filter(a => a.isRight == false);
            let number = Math.floor(alt.length/2);
            var alternatives = this.state.alternatives;
            for(i = 0; i<number; i++) {
                alternatives = alternatives.filter(a => a.uid != alt[i].uid)
            }
            let quiz = this.state.quiz;
            quiz.qntMetade -= 1;
            this.setState({ alternatives: alternatives, quiz: quiz})
        } else {
            alert("Sem esse poder")
        }        
    }

    duasCaras = () => {
        if(this.state.duasCaras != 0) {
            let wrong = this.state.alternatives.filter(a => a.isRight == false)
            let right = this.state.alternatives.filter(a => a.isRight == true)
            var alternatives = []
            if(wrong.length == 0 || right.length == 0) {
                alert("Inválido", "Não foi possível usar esse poder aqui")
            } else {
                alternatives.push(wrong[0]);
                alternatives.push(right[0]);
                let quiz = this.state.quiz;
                quiz.qntDuasCaras -= 1;
                this.setState({ alternatives: alternatives, quiz: quiz })
            }      
        } else {
            alert("Sem esse poder")
        }          
    }

    saveResposta = () => {
        const { currentUser } = firebase.auth();
        
        var newKey = firebase.database().ref().child('studentAlternatives').push().key;

        ref = firebase.firestore().collection('studentAlternatives')
        ref.add({
            uid: newKey,
            quizUid: this.state.questions[0].quizUid,
            studentUid: currentUser.uid,
            data: new Date(),
            answer: this.state.answer
        })
        .then((response) => {
            console.log('alternativa armazenada')
            this.setState({answer: ''})
            this.changeQuestion()
        }).catch((error) => {
            alert(error.message)
        })
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
            if(this.state.questions[this.state.numberQuestion].type == 0) {
            questionView =
                <View>
                    <View>
                        <Card wrapperStyle={styles.questionWrapper}>
                            <Text>{this.state.questions[this.state.numberQuestion].question}</Text>
                        </Card>
                        <Text h4 style={{ alignSelf: 'center', marginVertical: 20 }}>ALTERNATIVAS</Text>
                    </View>

                    <FormInput placeholder="Resposta"
                    onChangeText={(answer) => this.setState({answer})}
                    />
                    
                    <Button
                        title="RESPONDER" 
                        titleStyle={{ fontWeight: '700'}}
                        buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                        onPress={() => this.saveResposta()}
                    />
                </View>
            } else if(this.state.questions[this.state.numberQuestion].type == 1) {
            questionView =
                <View>
                    <View>
                        <Card wrapperStyle={styles.questionWrapper}>
                            <Text>{this.state.questions[this.state.numberQuestion].question}</Text>
                        </Card>
                        <Text h4 style={{ alignSelf: 'center', marginVertical: 20 }}>ALTERNATIVAS</Text>
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
        }
        return (
            <View style={{flex: 1, height: '100%'}}>
                <View flexDirection='row' style={{ height: 100, backgroundColor: 'red', justifyContent: 'space-around' }}>
                    <TouchableWithoutFeedback
                        onPress={() => this.colar()}
                    >
                        <View justifyContent="center" style={{paddingTop: 20}}>
                        <Icon
                            type='entypo'
                            name='copy'
                            color='#f1f1f1'
                        />
                        <Text h5 style={{marginTop: 10, color: "#fff", fontFamily: 'montserrat_bold'}}>{this.state.quiz.qntColar}</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.ajudaDosUniversitarios()}
                    >
                        <View justifyContent="center" style={{paddingTop: 20}}>
                        <Icon
                            type='font-awesome'
                            name='university'
                            color='#f1f1f1'
                        />
                        <Text h5 style={{marginTop: 10, color: "#fff", fontFamily: 'montserrat_bold'}}>{this.state.quiz.qntUniversitarios}</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.duasCaras()}
                    >
                        <View justifyContent="center" style={{paddingTop: 20}}>
                        <Icon
                            type='font-awesome'
                            name='users'
                            color='#f1f1f1'
                        />
                        <Text h5 style={{marginTop: 10, color: "#fff", fontFamily: 'montserrat_bold'}}>{this.state.quiz.qntDuasCaras}</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.naMetade()}
                    >
                        <View justifyContent="center" style={{paddingTop: 20}}>
                        <Icon
                            type='font-awesome'
                            name='scissors'
                            color='#f1f1f1'                        
                        />
                        <Text h5 style={{marginTop: 10, color: "#fff", fontFamily: 'montserrat_bold'}}>{this.state.quiz.qntMetade}</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                        onPress={() => this.menosUm()}
                    >
                        <View justifyContent="center" style={{paddingTop: 20}}>
                        <Icon
                            type='font-awesome'
                            name='minus'
                            color='#f1f1f1'                        
                        />                        
                        <Text h5 style={{marginTop: 10, color: "#fff", fontFamily: 'montserrat_bold'}}>{this.state.quiz.qntMenosUm}</Text>
                        </View>
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
