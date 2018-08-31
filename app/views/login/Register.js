import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text } from 'react-native-elements'

export class Register extends React.Component {

    render() { 
        return(
            <ScrollView style={styles.container}>
                <View style={styles.cardContainer}>

                    <Text h2 style={styles.title}>CADASTRO</Text>
                    
                    <FormInput placeholder="Nome" />
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <FormInput placeholder="Email" />
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <FormInput placeholder="Senha"/>
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <FormInput placeholder="Confirmar Senha" />
                    {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                    <Button
                    small
                    backgroundColor='#9C00FF'
                    color='#FFFFFF'
                    buttonStyle={styles.registerBtn}
                    rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                    title='CONTINUAR'
                    rounded={true}
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