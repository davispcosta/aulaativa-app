import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header } from 'react-native-elements'

export class Rank extends React.Component {

    static navigationOptions = {
        header: null
    }

    render() { 
        return(
            <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'arrow-back', color: '#fff' }}
                    backgroundColor='#9C00FF'
                    centerComponent={{ text: 'APIS1', style: { color: '#fff' } }}
                />

                <FlatList
                data={students}
                keyExtractor={item => item.title}
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

const students = [{
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