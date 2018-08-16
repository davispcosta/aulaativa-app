import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Header, Card, ListItem, Text } from 'react-native-elements'

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
                        <Text>{item.professor}</Text>
                        <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.alunos} ALUNOS</Text>
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
        professor: 'Eduardo Mendes',
        alunos: 15
    },
    {
        id:1,
        title: 'POO',
        professor: 'Eduardo Mendes',
        alunos: 9
    },
    {
        id:2,
        title: 'Estágio 3',
        professor: 'Vitor Almeida',
        alunos: 6
    }
]