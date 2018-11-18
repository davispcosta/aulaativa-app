import React from 'react';
import { StyleSheet, ScrollView, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Icon, Button } from 'react-native-elements'
import * as firebase from 'firebase';
import { Constants } from '../../Constants';

export class StudentStatus extends React.Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);
        this.state = {
            classUid: this.props.classUid,
            user: {},
            status: {},
            achievements: []
        }
    }

    componentDidMount = () => {
        this.loadStatus()    
    }

    loadStatus = () => {
        console.log('status')
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("subscriptions").where("classUid", "==", this.state.classUid)
        ref.where("studentUid", "==", currentUser.uid).get().then(function (querySnapshot) {
            var status = {}
            querySnapshot.forEach(function (doc) {
                status = doc.data();
            })
            this.setState({ status: status }, () => { console.log(this.state.status)})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    addFault = (qntAbsence) => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("subscriptions")
        ref.where("classUid", "==", this.state.classUid)
            .where("studentUid", "==", currentUser.uid)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    ref.doc(doc.id).update({ qntAbsence: qntAbsence + 1 })
                })
            })
    }

    generateFaults(classFaults, statusFaults) {
        const faults = [];
        for (let i = 0; i < classFaults; i++) {
            faults.push(
                <Icon
                    key={i}
                    name="favorite"
                    color="#FF412F"
                />
            );
        }
        return faults;
    }

    render() {
        let screen = null;

        screen =
            <View style={{alignItems: 'center',}}>
                <Text style={styles.subtitle} h4>EXPERIÊNCIA</Text>
                <View style={styles.xpBar}></View>
                <Text h5>{this.state.status.exp} xp</Text>
                <Text style={styles.subtitle} h4>{this.state.status.qntAbsence} FALTAS</Text>
                <View style={styles.faults}>                        
                    {this.generateFaults(this.props.classroom.qntAbsence, this.state.status.qntAbsence)}                        
                </View>
                <Button
                    title="Adicionar falta"
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{ marginTop: 20, backgroundColor: Constants.Colors.Primary }}
                    onPress={() => this.addFault(this.state.status.qntAbsence)}
                />
                <Text style={styles.subtitle} h4>CONQUISTAS</Text>
                <FlatList
                    data={this.state.achievements}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <Card title={item.title}>
                        </Card>
                    )}
                />
            </View>

        return (
            <View style={styles.container}>
                {screen}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    xpBar: {
        width: "80%",
        height: 5,
        backgroundColor: "#000",
        borderRadius: 5,
    },
    faults: {
        flexDirection: 'row'
    },
    subtitle: {
        marginTop: 20,
        marginBottom: 5,
    }
});