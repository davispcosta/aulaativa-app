import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, FlatList } from 'react-native';
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
                <ScrollView>
                    <Card wrapperStyle={styles.questionWrapper}>
                        <Text>Lorem ipslum dolor sit amet, consectetur adipiscing elit?</Text>
                    </Card>
                    <Text h4 style={{alignSelf: 'center', fontWeight: '800', marginVertical: 20}}>ALTERNATIVAS</Text>
                    <FlatList
                    data={alternatives}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => (
                        <Card flexDirection='row' wrapperStyle={{alignItems:'center'}}>
                            <Text h3 style={{color:'#9C00FF', marginRight: 20}}>{item.letter}</Text>
                            <Text>{item.answer}</Text>
                        </Card>
                    )}
                    />
                </ScrollView>
            </View>
        );  
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
    questionWrapper: {
        padding: 20,
        borderWidth: 2,
        borderColor: '#9C00FF',
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
    id: 1,
    letter: 'B',
    answer: "Claro"
},{
    id: 2,
    letter: 'C',
    answer: "Às Vezes"
},{
    id: 3,
    letter: 'D',
    answer: "Não"
}]