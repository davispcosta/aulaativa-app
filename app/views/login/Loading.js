import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import * as firebase from 'firebase';

export default class Loading extends React.Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
          this.props.navigation.navigate(user ? 'Classes' : 'Login')
        })
    }

    render() {
        return (
        <View style={styles.container}>
            <Text>Carregando...</Text>
            <ActivityIndicator size="large" />
        </View>
        )
    }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})