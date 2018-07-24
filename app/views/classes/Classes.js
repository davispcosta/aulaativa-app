import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Header, Card, ListItem, } from 'react-native-elements'

export class Classes extends React.Component {

    static navigationOptions = {
        header: null
    }

    onPress = () => {
        this.props.navigation.toggleDrawer();
    }
    
    render() { 
        return(
            <View style={styles.container}>

                <Header
                    backgroundColor='#9C00FF'
                    leftComponent={{ icon: 'menu', color: '#fff', onPress: this.onPress }}
                    centerComponent={{ text: 'TURMAS', style: { color: '#fff' } }}
                    />

                <FlatList
                data={classes}
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

const classes = [
    {
        id:0,
        title: 'APIS 1',
        description: 'Eduardo Mendes'
    },
    {
        id:1,
        title: 'POO',
        description: 'Eduardo Mendes'
    },
    {
        id:2,
        title: 'Estágio 3',
        description: 'Vitor Almeida'
    }
]