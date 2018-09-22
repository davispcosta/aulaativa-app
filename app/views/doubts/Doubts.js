import React from 'react';
import { StyleSheet, ScrollView, Image, KeyboardAvoidingView, FlatList, RefreshControl, TouchableWithoutFeedback } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Doubts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classUid: this.props.classUid,
            refreshing: false,
            doubts: []
        }
        this.loadDoubts()
    }

    loadDoubts = () => {
        const { currentUser } = firebase.auth();
        
        ref = firebase.firestore().collection("doubts")
        let array = []
        ref.where("classUid", "==", this.state.classUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ doubts: array, refreshing: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadDoubts()
    }

    static navigationOptions = {
        header: null
    }

    render() { 
        return(
            
            <ScrollView style={styles.container} 
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
            }>

                <Button
                    title="NOVA DÚVIDA" 
                    titleStyle={{ fontWeight: '700'}}
                    buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                    onPress={() => this.props.navigation.navigate('NewDoubt', { classUid: this.state.classUid})}
                />
                    
                <FlatList
                data={this.state.doubts}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('Doubt', { user: this.state.user, doubt: item })}
                    >
                    <Card title={item.title}>
                        {/* <Text>{item.answers} RESPOSTAS</Text>
                        <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.date}</Text> */}
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