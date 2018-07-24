import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'

export class LoginForm extends React.Component {
    
    render() { 
        return(
            <View style={styles.container}>

                <FormValidationMessage>Usuário e/ou senha incorreto(s)</FormValidationMessage>

                <FormLabel>EMAIL</FormLabel>
                <FormInput
                keyboardType='email-address' />
                
                <FormLabel>SENHA</FormLabel>
                <FormInput />

                <View style={styles.options}>

                </View>

                <Button
                    large
                    backgroundColor='#FFCC00'
                    color='#9C00FF'
                    rightIcon={{name: 'chevron-right', color: '#9C00FF'}}
                    title='ENTRAR'
                    fontWeight='800' />

                <Button
                    title="Cadastre-se"
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        padding: 20
    },
    label: {
        color:'#FFCC00'
    },
    options: {

    }
});