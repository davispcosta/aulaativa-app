import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
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
            loading: true,
            questions: []
        }
        this.loadQuestions()
    }

    loadQuestions = () => {
        ref = firebase.firestore().collection("questions")
        let array = []
        ref.where("quizUid", "==", this.state.quizUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ questions: array, refreshing: false, loading: false})
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

    var content = null;
    if(this.state.loading == true) {
        content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
    } else {
        if(this.state.questions.length == 0) {
            content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Você não possui questões adicionadas ainda.</Text>
                <Image 
                style={styles.emptyIcon} 
                resizeMode='contain'
                source={require('../../assets/img/pencils.png')}
                />
            </View>
        } else {
            content = <FlatList
                data={this.state.questions}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('EditQuestion', { questionUid: item.uid })}>
                    <Card>
                        <Text style={{ alignSelf: 'center', fontFamily: 'montserrat_bold', paddingVertical: 20,}}>{item.question}</Text>
                        {/* <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.done} / {item.questions}</Text> */}
                    </Card>
                    </TouchableWithoutFeedback>
                )}
                />
        }
    }

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

                { content }

                
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
