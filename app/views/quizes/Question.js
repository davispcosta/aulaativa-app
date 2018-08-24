import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text } from 'react-native-elements'

export class Question extends React.Component {

    static navigationOption = {
        header: null
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: this.onPress }}
                    backgroundColor='#9C00FF'
                    centerComponent={{ text: 'APIS1', style: { color: '#fff', fontWeight: "800" } }}
                />
                <Text style={styles.question}>Você tem uma pergunta?</Text>
                <FlatList
                data={alternatives}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <Card title={item.letter}>
                        <Text>{item.answer}</Text>
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
    question: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 10,
        fontSize: 18
    },
    alternative: {

    }
});

const alternatives = [{
    id: 0,
    letter: 'A',
    answer: "Tenho Sim"
},
{
    id: 0,
    letter: 'B',
    answer: "Claro"
},{
    id: 0,
    letter: 'C',
    answer: "Às Vezes"
},{
    id: 0,
    letter: 'D',
    answer: "Não"
}]