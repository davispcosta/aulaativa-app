import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import { ChooseRegister } from './ChooseRegister'
import { Classes } from '../classes/Classes'

import * as firebase from 'firebase';

export class LoginForm extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    login = (navigation) => {
        try {
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(user){
                console.log(user)
                navigation.navigate('Classes', { screen: Classes})
            }).catch(function (error) {
                console.log(error)
                alert(error.message)
            })
        } catch(error) {
            console.log(error.toString())
        }
    }
    
    render() { 
        return(
            <View style={styles.container}>

                {/* <FormValidationMessage>Usuário e/ou senha incorreto(s)</FormValidationMessage> */}

                <FormInput
                placeholder='Email'
                onChangeText={(email) => this.setState({email})}
                keyboardType='email-address' />
                
                <FormInput 
                placeholder='Senha'
                onChangeText={(password) => this.setState({password})}
                />

                <View style={styles.options}>

                </View>

                <Button
                    small
                    buttonStyle={styles.enterBtn}
                    backgroundColor='#9C00FF'
                    color='#FFFFFF'
                    rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                    title='ENTRAR'
                    rounded={true}
                    onPress={() => this.login(this.props.navigation)}
                    fontWeight='800' />

                <Button
                    title="Não possui conta? Cadastre-se"
                    backgroundColor={"#1fe0"}
                    color='#9C00FF'
                    onPress={() => this.props.navigation.navigate('ChooseRegisterScreen', { screen: ChooseRegister})}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        padding: 30
    },
    label: {
        color:'#FFCC00'
    },
    enterBtn: {
        marginVertical: 20
    },
    options: {

    }
});