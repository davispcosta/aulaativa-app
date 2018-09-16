import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { FormLabel, FormInput, FormValidationMessage, Button, Text } from 'react-native-elements'
import { Register} from './Register'
import { Constants } from '../../Constants';

export class ChooseRegister extends React.Component {

    render() { 
        return(
            <ScrollView style={styles.container}>
                <Text h2 style={styles.title}>Que tipo de usuário você é?</Text>
                <Button
                large
                backgroundColor={Constants.Colors.Primary}
                fontWeight='800'
                buttonStyle={styles.btn} title='PROFESSOR'
                onPress={() => this.props.navigation.push('RegisterScreen', { rule: 'Professor'})}
                />
                
                <Button
                large
                backgroundColor={Constants.Colors.Primary}
                fontWeight='800'
                buttonStyle={styles.btn} title='ALUNO'
                onPress={() => this.props.navigation.push('RegisterScreen', { rule: 'Student'})}
                />
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
    title: {
        color: Constants.Colors.Primary,
        alignSelf: 'center',
        marginTop: 20,
    },
    btn: {
        marginTop: 30
    }
});