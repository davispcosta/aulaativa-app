import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import { ChooseRegister } from './ChooseRegister'
import { Classes } from '../classes/Classes'

export class LoginForm extends React.Component {
    
    render() { 
        return(
            <View style={styles.container}>

                {/* <FormValidationMessage>Usuário e/ou senha incorreto(s)</FormValidationMessage> */}

                <FormInput
                placeholder='Email'
                keyboardType='email-address' />
                
                <FormInput 
                placeholder='Senha'
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
                    onPress={() => this.props.navigation.navigate('Classes', { screen: Classes})}
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