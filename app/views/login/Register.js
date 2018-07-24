import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text } from 'react-native-elements'

export class Register extends React.Component {

    render() { 
        return(
            <View style={styles.container}>
                <View style={styles.cardContainer}>

                    <Text h2 style={styles.title}>CADASTRO</Text>
                    
                    <FormLabel>NOME</FormLabel>
                    <FormInput />
                    <FormValidationMessage>Campo inválido</FormValidationMessage>

                    <FormLabel>EMAIL</FormLabel>
                    <FormInput />
                    <FormValidationMessage>Campo inválido</FormValidationMessage>

                    <FormLabel>SENHA</FormLabel>
                    <FormInput />
                    <FormValidationMessage>Campo inválido</FormValidationMessage>

                    <FormLabel>CONFIRMAR SENHA</FormLabel>
                    <FormInput />
                    <FormValidationMessage>Campo inválido</FormValidationMessage>

                    <Button
                    large
                    backgroundColor='#FFCC00'
                    color='#9C00FF'
                    rightIcon={{name: 'chevron-right', color: '#9C00FF'}}
                    title='CONTINUAR'
                    fontWeight='800' />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: '#9C00FF',
        padding: 20,
        paddingTop: 40,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    title: {
        color: '#9C00FF',
        alignSelf: 'center',
        marginTop: 20,
    }
});