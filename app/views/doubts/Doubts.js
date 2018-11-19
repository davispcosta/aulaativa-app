import React from 'react';
import { StyleSheet, ScrollView, Image, View, FlatList, RefreshControl, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements'
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class Doubts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classUid: this.props.classroom.uid,
            refreshing: false,
            loading: true,
            doubts: [],
            users: []
        }
    }

    componentDidMount = () => {
        this.setState({ loading: true})
        this.loadDoubts()    
    }

    loadDoubts = () => {
        const { currentUser } = firebase.auth();
        
        ref = firebase.firestore().collection("doubts")
        let array = []
        let users = []
        ref.where("classUid", "==", this.state.classUid).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let doubt = doc.data()
                if(doubt.userUid) {
                    firebase.firestore().collection('users').where("uid", "==", doubt.userUid).get().then( snapshot => {
                        let user;
                        snapshot.forEach((doc) => {
                            user = doc.data();
                        })
                        users.push(user);
                        array.push(doubt);
                        this.setState({ doubts: array, users: users, refreshing: false, loading: false })  
                    })
                }
            })
        }).catch(function (error) {
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

        var emptyDiv;
        if(this.state.doubts.length == 0 && !this.state.loading) {
            emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Parece que ninguém aqui tem dúvidas.</Text>
                        <Image 
                        style={styles.emptyIcon} 
                        resizeMode='contain'
                        source={require('../../assets/img/doubt.png')}
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

                <Button
                    title="NOVA DÚVIDA" 
                    titleStyle={{ fontWeight: '700'}}
                    buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                    onPress={() => this.props.navigation.navigate('NewDoubt', { classUid: this.state.classUid, user: this.state.user, onNavigateBack: this.componentDidMount})}
                />

                { loadingDiv }

                { emptyDiv }
                    
                <FlatList
                data={this.state.doubts}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item, index}) => (
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('Doubt', { user: this.state.user, doubt: item })}
                    >
                    <Card wrapperStyle={{paddingVertical: 10}}>
                        <Text style={{fontFamily: 'montserrat_bold', textAlign: 'center', marginBottom: 10}}>{item.title}</Text>
                        <Text style={{textAlign: 'right', fontSize: 10, fontWeight: '400'}}>Feito por:</Text>
                        <Text style={{textAlign: 'right', fontWeight: '800'}}>{this.state.users[index].name}</Text>                        
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
    emptyIcon: {
        width: 100
    }
});