import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView } from 'react-native';
import { LoginForm } from './LoginForm';
import { Constants } from '../../Constants';

export class Login extends React.Component {

    render() { 
        return(
            <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
                <View style={styles.cardContainer}>

                    <View style={styles.logoContainer} >
                        <Image 
                        style={styles.logo} 
                        resizeMode='contain'
                        source={require('../../assets/img/logo.png')}
                        />
                    </View>
                    
                    <View style={styles.formContainer}>
                        <LoginForm navigation={this.props.navigation} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: Constants.Colors.Primary,
        padding: 20,
        paddingTop: 40,
    },
    cardContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 30,
    },
    formContainer: {
        flex: 2,
    },
    logo: {
        flex: 1,
        width: 150,
    }
});