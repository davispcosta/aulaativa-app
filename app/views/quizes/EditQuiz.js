import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';

export class EditQuiz extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            quizUid: this.props.navigation.state.params.quizUid,
            refreshing: false,
            questions: []
        }
    this.loadQuestions()
    }

    loadQuestions = () => {
        const { currentUser } = firebase.auth();
        
        ref = firebase.firestore().collection("questions")
        let array = []
        ref.where("quizUid", "==", this.state.quizUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ questions: array, refreshing: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadQuestions()
    }

  render() {
    return(
        <View style={styles.container}>
            <HeaderSection navigation={this.props.navigation} goBack={true} />

            <ScrollView 
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
            }>

                <Button
                    title="ADICIONAR QUESTÃO" 
                    titleStyle={{ fontWeight: '700'}}
                    buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                    onPress={() => this.props.navigation.navigate('NewQuestion', { quizUid: this.state.quizUid})}
                />

                <FlatList
                data={this.state.questions}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('EditQuestion', { questionUid: item.uid })}>
                    <Card title={item.question} >
                        {/* <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.done} / {item.questions}</Text> */}
                    </Card>
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
});
