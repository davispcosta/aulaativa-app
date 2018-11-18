import React from 'react';
import { Image, StyleSheet, View, ScrollView, Alert, FlatList, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native';;
import { Card, Text, Icon, Button } from 'react-native-elements';
import { HeaderSection } from '../../sections/HeaderSection';
import { Constants } from '../../Constants';
import * as firebase from 'firebase';

export class ProfessorClasses extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            classes: []
        }
        this.loadClasses()
    }

    loadClasses = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("classes")
        let array = []
        ref.where("professorUid", "==", currentUser.uid).get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                array.push(doc.data());
            })
            this.setState({ classes: array, refreshing: false, loading: false })
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })

    }

    getClasses = (item) => {
        if(item.active) {
            return <Card flexDirection="row" wrapperStyle={{alignItems: 'center'}}>
                <Icon                                
                    name='class'
                    color={Constants.Colors.Primary}
                />
                <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                    <Text
                        fontFamily='montserrat_semi_bold'
                        style={{ color: Constants.Colors.Primary }}
                        h5>{item.name}</Text>
                </View>
            </Card>
        } else {
            return <Card flexDirection="row" wrapperStyle={{alignItems: 'center'}}>
                <Icon                                
                    name='class'
                    color={Constants.Colors.Gray}
                />
                <View style={{ marginLeft: 20, width: 0, flexGrow: 1, flex: 1 }}>
                    <Text
                        fontFamily='montserrat_semi_bold'
                        style={{ color: Constants.Colors.Gray }}
                        h5>{item.name}</Text>
                </View>
            </Card>
        }        
    }

    render() {
        var classes = null;
        if (this.state.loading == true) {
            classes = <View style={{ padding: 10, marginVertical: 20 }}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            if(this.state.classes.length == 0) {
                classes = <View style={{ marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: Constants.Colors.Primary, textAlign: 'center', marginBottom: 30 }} h4>Você não possui classes adicionadas ainda.</Text>
                <Image
                    style={styles.emptyIcon}
                    resizeMode='contain'
                    source={require('../../assets/img/pencils.png')}
                />
                </View>
            } else {
                classes = <FlatList
                data={this.state.classes}
                keyExtractor={item => item.uid.toString()}
                renderItem={({ item }) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('MaterialTabs', { user: this.props.user, classroom: item })}
                    >
                        { this.getClasses(item)}
                    </TouchableWithoutFeedback>
                )} />
            }
        }
        return (
            <ScrollView>
                <Button
                    title="NOVA TURMA"
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                    onPress={() => this.props.navigation.navigate('NewClass', { instituitionUid: this.props.user.instituitionUid })}
                />
                <View>
                    <Text style={styles.baseText} h5> Minhas disciplinas: </Text>
                    { classes }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    emptyIcon: {
        width: 100
    },
    baseText: {
        color: Constants.Colors.Primary,
        paddingHorizontal: 20,
        paddingTop: 20,
        fontFamily: "montserrat_bold"
    }
});