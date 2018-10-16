import React from 'react';
import { StyleSheet, ScrollView, Image, View, ActivityIndicator, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
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
            classUid: this.props.classroom.uid,
            refreshing: false,
            loading: true,
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
            this.setState({ quizes: array, refreshing: false, loading: false})
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

        var emptyDiv;
        if(this.state.quizes.length == 0 && !this.state.loading) {
            emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Nada de questionários por aqui.</Text>
                        <Image 
                        style={styles.emptyIcon} 
                        resizeMode='contain'
                        source={require('../../assets/img/pencils.png')}
                        />
                    </View>
        } else {
            emptyDiv = null;
        }

        var loadingDiv;
        if(this.state.loading == true) {
            loadingDiv = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            loadingDiv = null
        }

        return(
            <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
            }>

                { newQuiz }

                { loadingDiv }
                { emptyDiv }

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
