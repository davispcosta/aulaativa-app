import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Header} from '../sections/Header.js'

export class Login extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Header message="Press to Login" />
                <Text style={{flex:8}}>This is Login!</Text>
                <Text style={{flex:6}}>This is Login!</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1
    }
});