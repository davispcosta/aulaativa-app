import React from 'react';
import { StyleSheet, View, Image, FlatList, TouchableWithoutFeedback } from 'react-native';
import { Header, Card, ListItem, Text, Icon, Button } from 'react-native-elements'
import { MaterialTabs } from '../../sections/MaterialTabs';
import { NewClass } from './NewClass'
import { Profile } from '../profile/Profile'

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
                    centerComponent={{ text: 'TURMAS', style: { color: '#fff', fontWeight: "800" }  }}
                    rightComponent={
                    <Icon type='font-awesome' 
                    name='user' color='#f1f1f1'
                    onPress={() => this.props.navigation.navigate('Profile', { screen: Profile})}
                    />}
                    />

                <Button
                    title="NOVA TURMA" 
                    titleStyle={{ fontWeight: '700'}}
                    buttonStyle={{marginTop: 20, backgroundColor: "#9C00FF"}}
                    onPress={() => this.props.navigation.navigate('NewClass', { screen: NewClass})}
                />

                <FlatList
                data={classes}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.navigate('MaterialTabs', { screen: MaterialTabs})}
                    >
                    <Card
                        flexDirection="row"
                    >
                        <Icon
                            raised
                            containerStyle={{backgroundColor:'#AFAFAF'}}
                            name='class'
                            color='#f1f1f1'
                            />
                         <View style={{marginLeft: 20}}>
                            <Text
                            style={{fontFamily: 'Montserrat'}}
                            h4>{item.title}</Text>
                            <Text>{item.professor}</Text>
                            <Text style={{color: "gray"}}>{item.alunos} ALUNOS</Text>
                        </View>
                    </Card>
                    </TouchableWithoutFeedback>
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