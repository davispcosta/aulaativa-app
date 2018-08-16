import React from 'react';
import { StyleSheet, ScrollView, Image, KeyboardAvoidingView, FlatList, Alert } from 'react-native';
import { Header, Card, Button, Text } from 'react-native-elements';
import { Rank } from './Rank';

export class Board extends React.Component {

    render() { 
        return(
            <ScrollView style={styles.container}>
                <Card title='Professor' containerStyle={styles.ProfCard} titleStyle={styles.ProfCardTitle}>
                    <Text>Adriano Augusto</Text>
                </Card>

                <Button
                    buttonStyle={styles.rankBtn}
                    large
                    fontWeight="800"
                    rightIcon={{name: 'arrow-forward'}}
                    backgroundColor='#9C00FF'
                    title='RANK'
                    onPress={() => this.props.navigation.navigate('Rank', { screen: Rank})}
                />

                <Text h4 style={styles.subtitle}>MURAL</Text>

                <FlatList
                data={news}
                style={styles.list}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <Card title={item.title}>
                        <Text>{item.description}</Text>
                        <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.date}</Text>
                    </Card>
                )}
                />

            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
    },
    ProfCardTitle: {
        alignSelf: 'flex-start',
    },
    rankBtn: {
        margin: 20,
        justifyContent: 'space-around'
    },
    subtitle: {
        alignSelf: 'center',
    }, 
    list: {
        marginBottom: 20
    },
});

const news = [{
    id: 0,
    title: 'Mudança de Sala',
    description: 'Apartir da próxima aula iremos ter aula na sala 41.',
    date: '16/08/2018' 
},{
    id: 1,
    title: 'Feriado',
    description: 'Por motivos do feriado, não haverá aula na próxima quinta.',
    date: '12/08/2018',  
},{
    id: 2,
    title: 'Adiar Entrega',
    description: 'A pedidos, o trabalho poderá ser entregue até sexta.',
    date: '10/08/2018'    
}]