import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text } from 'react-native-elements'
import Spinner from 'react-native-loading-spinner-overlay'
import Login from './Login'

import * as firebase from 'firebase';

export class Register extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            password: ''
        }
    }

    register = () => {
        this.setState({ loading: true})

        try {

            if(this.state.password.length < 6) {
                alert("A senha deve ser de no mínimo 6 dígitos")
                return;
            }

            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({ loading: false})
            this.props.navigation.navigate('LoginScreen', { screen: Login})
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
                    onChangeText={(email) => this.setState({email})}/>
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <FormInput placeholder="Senha"
                    onChangeText={(password) => this.setState({password})}/>
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <Button
                    small
                    backgroundColor='#9C00FF'
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
        color: '#9C00FF',
        alignSelf: 'center',
        marginTop: 20,
    },
    registerBtn: {
        marginTop: 40
    }
});