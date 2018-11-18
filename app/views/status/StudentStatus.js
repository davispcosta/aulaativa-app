import React from 'react';
import { StyleSheet, ScrollView, View, Image, ActivityIndicator, FlatList } from 'react-native';
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
            loading: true,
            status: {},
            achievements: []
        }
    }

    componentDidMount = () => {
        this.loadStatus()    
    }

    loadStatus = () => {
        const { currentUser } = firebase.auth();

        ref = firebase.firestore().collection("subscriptions").where("classUid", "==", this.state.classUid)
        ref.where("studentUid", "==", currentUser.uid).get().then(function (querySnapshot) {
            var status = {}
            querySnapshot.forEach(function (doc) {
                status = doc.data();
            })
            this.setState({ status: status, loading: false }, () => { console.log(this.state.status)})
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
            .then((querySnapshot) => {
                querySnapshot.forEach(function (doc) {
                    ref.doc(doc.id).update({ qntAbsence: qntAbsence + 1 })
                })
                this.setState({loading: true})
                this.loadStatus()
            })
    }

    generateFaults(classFaults, statusFaults) {
        const faults = [];
        var lifes = classFaults - statusFaults
        for (let i = 0; i < lifes; i++) {
            faults.push(
                <Icon
                    key={i}
                    name="favorite"
                    color="#FF412F"
                />
            );
        }
        for (let i = lifes; i < classFaults; i++) {
            faults.push(
                <Icon
                    key={i}
                    name="favorite"
                    color="#FFFFFF"
                />
            );
        }
        return faults;
    }

    render() {
        var content = null;
        if(this.state.loading == true) {
            content = <View style={{ padding: 10, marginVertical: 20}}><ActivityIndicator size="large" color="#0000ff" /></View>
        } else {
            content = <View style={{alignItems: 'center',}}>

                <Text style={styles.subtitle} h4>EXPERIÊNCIA</Text>
                <Text h3 style={{marginBottom: 20, color: Constants.Colors.Primary}}>{this.state.status.exp} xp</Text>

                <Text style={styles.subtitle} h4>{this.state.status.qntAbsence} FALTAS</Text>
                <View style={styles.faults}>                        
                    {this.generateFaults(this.props.classroom.qntAbsence, this.state.status.qntAbsence)}                        
                </View>
                <Button
                    title="Adicionar Falta"
                    titleStyle={{ fontWeight: '700' }}
                    buttonStyle={{ marginTop: 20, paddingHorizontal: 30, backgroundColor: Constants.Colors.Primary }}
                    onPress={() => this.addFault(this.state.status.qntAbsence)}
                />
            </View>
        }

        return (
            <View style={styles.container}>
                {content}
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