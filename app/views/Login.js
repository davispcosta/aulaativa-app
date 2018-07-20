import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

import {Header} from '../sections/Header.js'
import { Menu } from '../sections/Menu.js';

export class Login extends React.Component {
    static navigationOptions = {
        header: null
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={styles.container}>
                <Header message="Press to Login" />
                <Text style={{flex:8}}>This is Content!</Text>
                <Menu navigate={navigate} />
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1
    }
});