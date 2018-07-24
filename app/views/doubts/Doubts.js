import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header } from 'react-native-elements'


export class Doubts extends React.Component {

    static navigationOptions = {
        header: null
    }

    render() { 
        return(
            <View style={styles.container}>
                <FlatList
                data={doubts}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <Card title={item.title}>

                    </Card>
                )}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
});

const doubts = [{
    id: 0,
    title: 'Lorem Ipslum'   
},{
    id: 1,
    title: 'Lorem Ipslum'   
},{
    id: 2,
    title: 'Lorem Ipslum'   
},{
    id: 3,
    title: 'Lorem Ipslum'   
},{
    id: 4,
    title: 'Lorem Ipslum'   
},]