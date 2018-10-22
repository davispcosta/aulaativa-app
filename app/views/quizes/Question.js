import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection';

export class Question extends React.Component {

    static navigationOption = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            quizUid: this.props.navigation.state.params.quizUid,
            questions: [],
            allAlternatives: []
        };
    }

    loadQuestions = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("questions")
        let array = []
        ref.where("quizUid", "==", this.state.quizUid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                array.push(doc.data());
            })
            this.setState({ questions: array, refreshing: false, loading: false }, () => this.loadAlternatives())
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadAlternatives = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("alternatives")
        let array = []
        this.state.questions.forEach(function (doc) {
            ref.where("questionUid", "==", doc.uid).get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    array.push(doc.data());
                })
                this.setState({ allAlternatives: array, refreshing: false, loading: false }, () => this.mountQuiz())
            }.bind(this)).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
        })
    }

    alternativesInYourQuestions = (uid) => {
        let array = []
        this.state.answers.forEach(function (doc){
            if(doc.questionUid == uid){
                array.push(doc);
            }
        })
        return array;
    }

    verifyAlternative = (item) => {
        if(item.isRight){
            //pintar a alternativa de verde
        } else {
            //pintar a alternativa de vermelho
        }

        //bloquear troca de alternativa
    }

    render() {
        return (
            <View style={styles.container}>
                <HeaderSection navigation={this.props.navigation} goBack={true} />
                <ScrollView>
                    <FlatList
                        data={this.state.classes}
                        keyExtractor={item => item.uid.toString()}
                        renderItem={({ item }) => (
                            <TouchableWithoutFeedback
                                onPress={() => this.props.navigation.navigate('MaterialTabs', { user: this.state.user, classroom: item })}>
                                <Card wrapperStyle={styles.questionWrapper}>
                                    <Text onPress={this.verifyAlternative(item)}>{item.question}</Text>
                                </Card>                    
                                <FlatList
                                    data={this.alternativesInYourQuestions(item.uid)}
                                    keyExtractor={itemAlternative => item.uid.toString()}
                                    renderItem={({ itemAlternative }) => (
                                            <Card wrapperStyle={styles.questionWrapper}>
                                                <Text>{itemAlternative.alternative}</Text>
                                            </Card>
                                    )}
                                />
                            </TouchableWithoutFeedback>
                        )}
                    />
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
