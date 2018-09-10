import React from 'react';
import { StyleSheet, ScrollView, View, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Card, Button, Text, Icon } from 'react-native-elements';
import { Rank } from './Rank';
import { Profile } from '../profile/Profile';
import { NewNotification } from './NewNotification';

export class Board extends React.Component {
    
    constructor() {
        super();
        this.state = {
            isProfessor: false
        }
    }

    render() {
        const isProfessor = this.state.isProfessor;
        let profCard = null;
        let newOnMural = null;

        if(isProfessor) {
            newOnMural = <Button
                            title="ADICIONAR NO MURAL" 
                            titleStyle={{ fontWeight: '700'}}
                            buttonStyle={{marginTop: 20, backgroundColor: "#9C00FF"}}
                            onPress={() => this.props.navigation.navigate('NewNotification', { screen: NewNotification})}
                        />
        } else {
            profCard = <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('Profile', { screen: Profile})}>
                            <Card flexDirection="row" wrapperStyle={{alignItems: 'center',}}>
                                <Icon
                                    raised
                                    containerStyle={{backgroundColor:'#AFAFAF'}}
                                    name='user'
                                    type='font-awesome'
                                    color='#f1f1f1'
                                />

                                <View style={{marginLeft: 20}}>
                                    <Text>Professor</Text>
                                    <Text h4>Adriano Augusto</Text>
                                </View>
                            </Card>
                        </TouchableWithoutFeedback>
        }

        return(
            <ScrollView style={styles.container}>

                {profCard}
                <TouchableWithoutFeedback
                onPress={() => this.props.navigation.navigate('Rank', { screen: Rank})}>
                    
                    <Card containerStyle={{marginBottom: 20, backgroundColor: '#9C00FF'}} wrapperStyle={styles.rankBtn}
                    flexDirection='row'>
                        <Icon color='#f1f1f1' type='font-awesome' name='trophy'/>
                        <Text h3 style={{color: "white", fontWeight: 'bold',}}>RANK</Text>
                        <Icon color='#f1f1f1' type='materialicons' name='keyboard-arrow-right' />
                    </Card>

                </TouchableWithoutFeedback>

                <Text h5 style={styles.subtitle}>MURAL</Text>

                {newOnMural}

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
    rankBtn: {
        padding: 10,
        justifyContent: 'space-around',
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