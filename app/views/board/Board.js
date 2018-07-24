import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList, Alert } from 'react-native';
import { Header, Card, Button, Text } from 'react-native-elements';
import { Rank } from './Rank';

export class Board extends React.Component {

    render() { 
        return(
            <View style={styles.container}>
                <Card title='MESTRE'>
                    <Text>Adriano Augusto</Text>
                </Card>

                <Button
                    style={styles.rankBtn}
                    large
                    icon={{name: 'whatshot'}}
                    rightIcon={{name: 'play-arrow'}}
                    backgroundColor='#9C00FF'
                    title='RANK'
                    onPress={() => this.props.navigation.navigate('Rank', { screen: Rank})}
                />

                <Text h3 style={styles.title}>MURAL</Text>

                <FlatList
                data={news}
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
    title: {
        alignSelf: 'center',
    }, 
    rankBtn: {
    }
});

const news = [{
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