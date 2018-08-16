import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Icon } from 'react-native-elements'


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
                        <Text>{item.answers} RESPOSTAS</Text>
                        <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.date}</Text>
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
    title: 'O que é a relação de associação no diagrama de classes?',
    answers: 15,
    date: '12/08/2018'   
},{
    id: 1,
    title: 'Onde irá ser a próxima aula?',
    answers: 2,
    date: '15/07/2018'
}]