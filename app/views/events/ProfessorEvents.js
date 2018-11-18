import React from 'react';
import { StyleSheet, ScrollView, Image, View, ActivityIndicator, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import {  Card, Button, Text, Icon } from 'react-native-elements';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class ProfessorEvents extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classUid: this.props.classUid,
            refreshing: false,
            loading: true,
            events: []
        }
        this.loadEvents()
    }

    loadEvents = () => {        
        ref = firebase.firestore().collection("events")
        let array = []
        ref.where("classUid", "==", this.state.classUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ events: array, refreshing: false, loading: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadEvents()
    }

    render() {
        var content;
        if(this.state.loading == true) {
            content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.events.length == 0 ) {
                content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Nenhum evento ou atividade agendados!</Text>
                        <Image 
                        style={styles.emptyIcon} 
                        resizeMode='contain'
                        source={require('../../assets/img/flag.png')}
                        />
                    </View>
            } else {
                content = <FlatList
                    data={this.state.events}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('EventToStudents', { event: item, user: this.state.user })}>
                        <Card title={item.title}>
                            <Text>{item.description}</Text>
                            {/* <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.date}</Text> */}
                        </Card>
                        </TouchableWithoutFeedback>
                    )}
                    />
            }
        }

        return(
            <ScrollView style={styles.container} 
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
            }>

                <Button
                    title="ADICIONAR ATIVIDADE" 
                    titleStyle={{ fontWeight: '700'}}
                    buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                    onPress={() => this.props.navigation.navigate('NewEvent', { classUid: this.state.classUid})}
                />

                { content }

            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
});