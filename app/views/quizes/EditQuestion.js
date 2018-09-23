import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Picker, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button, FormInput } from 'react-native-elements';
import { HeaderSection } from '../../sections/HeaderSection';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class EditQuestion extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            questionUid: this.props.navigation.state.params.questionUid,
            refreshing: false,
            isRight: false,
            alternative: '',
            alternatives: []
        }
    this.loadAlternatives()
    }

    newAlternative = () => {
        const { currentUser } = firebase.auth();
    
        var newKey = firebase.database().ref().child('alternatives').push().key;
    
        ref = firebase.firestore().collection('alternatives') 
        ref.add({ uid: newKey, 
            alternative: this.state.alternative,
            isRight: this.state.isRight, 
            questionUid: this.state.questionUid
        }).then((response) => {
            this.setState({ alternative: '', isRight: false })
            this.loadAlternatives();
        }).catch((error) => {
            alert(error.message)
        })
    }

    loadAlternatives = () => {
        const { currentUser } = firebase.auth();
        
        ref = firebase.firestore().collection("alternatives")
        let array = []
        ref.where("questionUid", "==", this.state.questionUid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ alternatives: array, refreshing: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadAlternatives()
    }

  render() {
    return(
        <View style={styles.container}>
            <HeaderSection navigation={this.props.navigation} goBack={true} />

            <ScrollView 
            refreshControl={
                <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
            }>
                <FormInput placeholder="Alternativa"
                    onChangeText={(alternative) => this.setState({alternative})}
                />

                <Picker
                    selectedValue={this.state.isRight}
                    onValueChange={(isRight) => this.setState({isRight})}
                >
                    <Picker.Item label="Correto" value={true}/>
                    <Picker.Item label="Errado" value={false}/>
                </Picker>

                <Button
                    small
                    backgroundColor={Constants.Colors.Primary}
                    color='#FFFFFF'
                    buttonStyle={styles.registerBtn}
                    onPress={ () => this.newAlternative()}
                    rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                    title='ADICIONAR'
                    rounded={true}
                    fontWeight='800' />

                <FlatList
                data={this.state.alternatives}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                    onPress={() => console.log(item.alternative)}>
                    <Card title={item.alternative} >
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