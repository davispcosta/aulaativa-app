import React from 'react';
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Text, Icon } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
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
            loadingRank: false
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
            this.setState({ rank: array.reverse(), refreshing: false, loadingBoard: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    render() { 
        return(
            <View style={styles.container}>
                <HeaderSection navigation={this.props.navigation} goBack={true} />
                <ScrollView>

                    <Text style={{alignSelf: 'center', marginTop: 10,}} h2>RANK</Text>

                    <FlatList
                    data={this.state.rank}
                    keyExtractor={item => item.title}
                    renderItem={({item, index}) => (
                        <Card flexDirection='row' wrapperStyle={styles.studentCard}>
                            <Text h3>{index+1}º</Text> 
                            <Text>{item.name}</Text>
                            <Text>{item.exp}exp</Text> 
                        </Card>
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