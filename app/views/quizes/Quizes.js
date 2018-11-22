import React from 'react';
import { StyleSheet, ScrollView, Image, View, ActivityIndicator, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, Icon } from 'react-native-elements';
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
        ref.where("classUid", "==", this.state.classUid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                array.push(doc.data());
            })
            this.setState({ quizes: array, refreshing: false, loading: false })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true })
        this.loadQuizes()
    }

    clickOnQuestion = (navigation, item) => {
        if (this.state.user.role == "Professor") {
            navigation.navigate("EditQuiz", { quizUid: item.uid })
        } else {
            navigation.navigate("Questions", { quiz: item })
        }
    }

    reports = (navigation, uid) => {
        navigation.navigate("Reports", { quizUid: uid });
    }

    getBtnReport = (item) => {
        var report = null;
        if (this.state.user.role == "Professor") {
            report = <Icon
                raised
                containerStyle={{ backgroundColor: '#fff' }}
                type='entypo'
                name='pie-chart'
                color={Constants.Colors.Primary}
                onPress={() => this.reports(this.props.navigation, item.uid)}
            />
        }
        return report;
    }

    render() {
        
        let newQuiz = null;
        if (this.state.user.role == "Professor") {
            newQuiz = <Button
                title="ADICIONAR QUIZ"
                titleStyle={{ fontWeight: '700' }}
                buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                onPress={() => this.props.navigation.navigate('NewQuiz', { classUid: this.state.classUid })}
            />
        }

        var content = null;
        if (this.state.loading == true) {
            content = <View style={{ padding: 10, marginVertical: 20 }}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if (this.state.quizes.length == 0) {
                content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30 }} h4>Sem questionários ainda.</Text>
                    <Image
                        style={styles.emptyIcon}
                        resizeMode='contain'
                        source={require('../../assets/img/pencils.png')}
                    />
                </View>
            } else {
                content = <FlatList
                    data={this.state.quizes}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({ item }) => (
                        <TouchableWithoutFeedback
                            onPress={() => this.clickOnQuestion(this.props.navigation, item)}>
                            <Card wrapperStyle={{ paddingVertical: 20, alignItems: 'center' }}>
                                <Text h5 style={{ fontFamily: 'montserrat_bold', }}>{item.title}</Text>
                                {/* {this.getBtnReport(item)}                                */}
                            </Card>
                        </TouchableWithoutFeedback>
                    )}
                />
            }
        }

        return (
            <ScrollView style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                }>

                {newQuiz}

                {content}               
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
