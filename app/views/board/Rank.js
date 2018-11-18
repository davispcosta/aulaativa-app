import React from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, FlatList } from 'react-native';
import { Card, Text, Icon } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants'
import * as firebase from 'firebase';

export class Rank extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            rank: [],
            refreshing: false,
            loading: true
        }
        this.loadRank()
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    loadRank = () => {
        ref = firebase.firestore().collection("subscriptions")
        let array = []
        ref.where("classUid", "==", this.props.navigation.state.params.classroom.uid).orderBy("exp").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ rank: array.reverse(), refreshing: false, loading: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    render() {
        
        var content = null;
        if(this.state.loading == true) {
            content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.rank.length == 0 ) {
                content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Não há alunos na turma ainda.</Text>
    
                </View>
            } else {
                content = <FlatList
                data={this.state.rank}
                keyExtractor={item => item.uid}
                renderItem={({item, index}) => (
                    <Card flexDirection='row' wrapperStyle={styles.studentCard}>
                        <Text h3>{index+1}º</Text> 
                        <Text>{item.name}</Text>
                        <Text>{item.exp} exp</Text> 
                    </Card>
                )}
                />
            }
        }

        return(
            <View style={styles.container}>
                <HeaderSection navigation={this.props.navigation} goBack={true} />
                <ScrollView>
                    <Text style={{alignSelf: 'center', marginTop: 10,}} h2>RANK</Text>
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
    studentCard: {
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

const students = [{
    id: 0,
    title: 'Lorem Ipslum'   
},{
    id: 1,
    title: 'Lorem Ipslum'   
},{
    id: 2,
    title: 'Lorem Ipslum'   
},{
    id: 3,
    title: 'Lorem Ipslum'   
},{
    id: 4,
    title: 'Lorem Ipslum'   
},{
    id: 4,
    title: 'Lorem Ipslum'   
},]