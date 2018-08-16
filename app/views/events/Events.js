import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text } from 'react-native-elements'

export class Events extends React.Component {

    static navigationOptions = {
        header: null
    }

    render() { 
        return(
            <View style={styles.container}>

                <FlatList
                data={events}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <Card title={item.title}>
                        <Text>{item.description}</Text>
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

const events = [{
    id: 0,
    title: 'PROVA VP1',
    description: 'Prova na quinta-feira com conteúdo de diagrama de classes.',
    date: '16/08/2018'   
},{
    id: 1,
    title: 'ENTREGA DE TRABALHO',
    description: 'Entrega de trabalho com todos os diagramas feitos e aplicados.',
    date: '18/08/2018' 
},{
    id: 2,
    title: 'AULA DE GIT',
    description: 'Treinamento para todos que não possuem conhecimento em GIT.',
    date: '20/08/2018'    
}]