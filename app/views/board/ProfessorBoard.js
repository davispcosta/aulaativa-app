import React from 'react';
import { StyleSheet, ScrollView, View, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class ProfessorBoard extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.user,
            classroom: this.props.classroom,
            loadingBoard: true,
            refreshing: false,
            notifications: []
        }
    }

    componentDidMount = () => {
        this.setState({loadingBoard: true})
        this.loadNotifications()
        this.loadClass()
    }

    loadClass = () => {
        ref = firebase.firestore().collection("classes")
        ref.where("uid", "==", this.props.classroom.uid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                classroom = doc.data();
            })
            this.setState({classroom: classroom})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadNotifications = () => {
        ref = firebase.firestore().collection("notifications")
        let array = []
        ref.where("classUid", "==", this.state.classroom.uid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ notifications: array, refreshing: false, loadingBoard: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadNotifications()
    }

    render() {        
        var content = null;
        if(this.state.loadingBoard == true) {
            content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.notifications.length == 0) {
                content = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Informe seus alunos</Text>
                    <Image 
                    style={styles.emptyIcon} 
                    resizeMode='contain'
                    source={require('../../assets/img/notifications.png')}
                    />
                </View>
            } else {
                content = <FlatList
                data={this.state.notifications}
                style={styles.list}
                keyExtractor={item => item.uid.toString()}
                renderItem={({item}) => (
                    <Card title={item.title}>
                        <Text>{item.description}</Text>
                    </Card>
                )}
                />
            }
        }

        return(
            <ScrollView 
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
                }>
               
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                
                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('Rank', { classroom: this.state.classroom })}>
                        <View
                        style={{marginVertical: 20}} wrapperStyle={styles.rankBtn}
                        flexDirection='column' alignItems='center'>
                            <Icon color={Constants.Colors.Primary} type='font-awesome' name='trophy'/>
                            <Text h5 style={{color: Constants.Colors.Primary, fontWeight: 'bold',}}>RANK</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('Achievements', { classroom: this.state.classroom, user: this.state.user })}>                    
                        <View style={{marginVertical: 20}} wrapperStyle={styles.rankBtn}
                        flexDirection='column'>
                            <Icon color={Constants.Colors.Primary} type='ionicon' name='ios-medal'/>
                            <Text h5 style={{color: Constants.Colors.Primary, fontWeight: 'bold',}}>CONQUISTAS</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('EditClass', { classroom: this.state.classroom, onNavigateBack: this.componentDidMount })}>                    
                        <View style={{marginVertical: 20}} wrapperStyle={styles.rankBtn}
                        flexDirection='column'>
                            <Icon color={Constants.Colors.Primary} type='foundation' name='pencil'/>
                            <Text h5 style={{color: Constants.Colors.Primary, fontWeight: 'bold',}}>EDITAR</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>

                <Text h5 style={styles.subtitle}>MURAL</Text>

                <Button
                    title="ADICIONAR NO MURAL" 
                    titleStyle={{ fontWeight: '700'}}
                    buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                    onPress={() => this.props.navigation.navigate('NewNotification', { classroom: this.state.classroom, onNavigateBack: this.componentDidMount})}
                />
                
                { content }
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    rankBtn: {
        padding: 10,
        justifyContent: 'space-around',
    },
    subtitle: {
        alignSelf: 'center',
        fontFamily: 'montserrat_bold',
    }, 
    list: {
        marginBottom: 20
    },
    emptyIcon: {
        width: 200
    }
});