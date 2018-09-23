import React from 'react';
import { StyleSheet, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Quizes extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classUid: this.props.classUid,
            refreshing: false,
            quizes: []
        }
        this.loadQuizes()
    }

    loadQuizes = () => {
        const { currentUser } = firebase.auth();
        
        ref = firebase.firestore().collection("quizes")
        let array = []
        ref.where("classUid", "==", this.state.classUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ quizes: array, refreshing: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadQuizes()
    }

    clickOnQuestion = (navigation, item) => {
        if(this.state.user.role == "Professor") {
            navigation.navigate("EditQuiz", { quizUid: item.uid})
        } else {
            navigation.navigate("Question", { quizUid: item.uid})
        }
    }

    render() {
        let newQuiz = null;
        if(this.state.user.role == "Professor") {
            newQuiz = <Button
                            title="ADICIONAR QUIZ" 
                            titleStyle={{ fontWeight: '700'}}
                            buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                            onPress={() => this.props.navigation.navigate('NewQuiz', { classUid: this.state.classUid})}
                        />
        }
        return(
            <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
            }>

                { newQuiz }

                <FlatList
                data={this.state.quizes}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.clickOnQuestion(this.props.navigation, item)}>
                    <Card title={item.title} >
                        {/* <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.done} / {item.questions}</Text> */}
                    </Card>
                    </TouchableWithoutFeedback>
                )}
                />
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
});
