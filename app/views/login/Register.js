import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import * as firebase from 'firebase';
import { Constants } from '../../Constants';

export class Register extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            name: '',
            password: '',
            rule: this.props.navigation.state.params.rule
        }
    }

    componentWillUnmount = () => {
        
    }

    register = () => {
        this.setState({ loading: true})

        try {
            if(this.state.password.length < 6) {
                alert("A senha deve ser de no mínimo 6 dígitos")
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((authData) => {

                ref = firebase.firestore().collection('users') 
                ref.add({ email: this.state.email, name: this.state.name, rule: this.state.rule, uid: authData.user.uid }).then((response) => {
                    this.props.navigation.push('Classes')
                }).catch((error) => {
                    alert(error.message)
                })
                
            }).catch((error) => {
                alert(error.message)
            })
        } catch(error) {
            console.log(error.toString())
        }
    }

    render() { 
        return(
            <ScrollView style={styles.container}>
                <View style={styles.cardContainer}>
                    <Spinner visible={false} textContent={"Carregando..."} textStyle={{ color: '#FFF'}} />
                    <Text h2 style={styles.title}>CADASTRO</Text>

                    <FormInput placeholder="Email"
                    autoCapitalize="none"
                    keyboardType='email-address'
                    onChangeText={(email) => this.setState({email})}/>

                    <FormInput placeholder="Nome"
                    onChangeText={(name) => this.setState({name})}/>
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <FormInput placeholder="Senha"
                    autoCapitalize="none"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({password})}/>
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <Button
                    small
                    backgroundColor={Constants.Colors.Primary}
                    color='#FFFFFF'
                    buttonStyle={styles.registerBtn}
                    rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                    title='CONTINUAR'
                    rounded={true}
                    onPress={() => this.register()}
                    fontWeight='800' />

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 60,
        paddingHorizontal: 20
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    title: {
        color: Constants.Colors.Primary,
        alignSelf: 'center',
        marginTop: 20,
    },
    registerBtn: {
        marginTop: 40
    }
});