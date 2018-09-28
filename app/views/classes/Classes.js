import React from 'react';
import { StyleSheet, View, ScrollView, Image, FlatList, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { Card, Text, Icon, Button } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
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
            refreshing: false,
            loading: true,
            user: {}
        }
        this.loadUser()
    }

    loadUser = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("users")
        ref.where("uid", "==", currentUser.uid).get().then(function(querySnapshot) {
            var user = {}
            querySnapshot.forEach(function(doc) {
                user = doc.data();
            })
            this.setState({ user: user }, () => this.loadClasses())
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    loadClasses = () => {
        const { currentUser } = firebase.auth();

        let table;
        let uid;
        if(this.state.user.role == "Professor") {
            table = "classes"
            uid = "professorUid"
        } else {
            table = "subscriptions"
            uid = "studentUid"
        }

        ref = firebase.firestore().collection(table)
        let array = []
        ref.where(uid, "==", currentUser.uid).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ classes: array, refreshing: false, loading: false})
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
        
        var btnNew;

        if(this.state.user.role == "Professor") {
            btnNew = <Button
            title="NOVA TURMA" 
            titleStyle={{ fontWeight: '700'}}
            buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
            onPress={() => this.props.navigation.navigate('NewClass')}
            />
        } else if(this.state.user.role == "Student") {
            btnNew = <Button
            title="INSCREVER-SE EM NOVA TURMA" 
            titleStyle={{ fontWeight: '700'}}
            buttonStyle={{marginTop: 20, backgroundColor: Constants.Colors.Primary}}
            onPress={() => this.props.navigation.navigate('SubscribeClass', { studentUid: this.state.user.uid })}
            />
        }

        var emptyDiv;
        if(this.state.classes.length == 0 && !this.state.loading) {
            emptyDiv = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30}} h4>Você não possui classes adicionadas ainda.</Text>
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
            <View style={styles.container}>

                <HeaderSection navigation={this.props.navigation} logOut={true} goToProfile={true}/>

                { btnNew }

                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh}/>
                    }
                >

                    { loadingDiv }

                    { emptyDiv }

                    <FlatList
                    data={this.state.classes}
                    keyExtractor={item => item.uid.toString()}
                    renderItem={({item}) => (
                        <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('MaterialTabs', { user: this.state.user, classUid: this.state.user.role == "Professor" ? item.uid.toString() : item.classUid.toString() })}
                        >
                        <Card flexDirection="row">
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
    emptyIcon: {
        width: 100
    }
});