import React from 'react';
import { StyleSheet, View, ScrollView, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Header, Card, Text, Icon, Button } from 'react-native-elements'
import { Constants } from '../../Constants'
import * as firebase from 'firebase';

export class Classes extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            classes: [],
            refreshing: false
        }
        this.loadClasses()
    }

    logOut = (navigation) => {
        try {
            firebase.auth().signOut().then(function(){
                navigation.navigate('LoginScreen')
            }).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
        } catch(error) {
            console.log(error.toString())
        }
    }

    loadClasses = () => {
        const { currentUser } = firebase.auth();
        console.log('CURRENT')
        console.log(currentUser.uid)

        ref = firebase.firestore().collection("classes")
        let array = []
        ref.where("professorUid", "==", currentUser.uid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ classes: array, refreshing: false})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    onRefresh = () => {
        this.setState({ refreshing: true})
        this.loadClasses()
    }
    
    render() { 
        return(
            <View style={styles.container}>

                <Header
                    backgroundColor={Constants.Colors.Primary}
                    leftComponent={
                        <Icon type='material-community' 
                        name='exit-to-app' color='#f1f1f1'
                        onPress={() => this.logOut(this.props.navigation)}
                        />}
                    centerComponent={{ text: 'TURMAS', style: { color: '#fff', fontFamily: 'montserrat_bold' }  }}
                    rightComponent={
                        <Icon type='font-awesome' 
                        name='user' color='#f1f1f1'
                        onPress={() => this.props.navigation.navigate('Profile')}
                        />}
                    />

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
                    }
                >

                    <Button
                        title="NOVA TURMA" 
                        titleStyle={{ fontWeight: '700'}}
                        buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
                        onPress={() => this.props.navigation.navigate('NewClass')}
                    />

                    <FlatList
                    data={this.state.classes}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('MaterialTabs')}
                        >
                        <Card
                            flexDirection="row"
                        >
                            <Icon
                                raised
                                containerStyle={{backgroundColor:'#AFAFAF'}}
                                name='class'
                                color='#f1f1f1'
                                />
                            <View style={{marginLeft: 20, width: 0, flexGrow: 1, flex: 1}}>
                                <Text
                                fontFamily='montserrat_semi_bold'
                                style={{color: Constants.Colors.Primary}}
                                h5>{item.name}</Text>
                                {/* <Text>{item.professor}</Text> */}
                                {/* <Text style={{color: "gray"}}>{item.alunos} alunos</Text> */}
                            </View>
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
        flex: 1
    },
});