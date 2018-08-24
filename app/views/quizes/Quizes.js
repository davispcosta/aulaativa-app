import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Button } from 'react-native-elements'
import Question from './Question'

export class Quizes extends React.Component {

    static navigationOptions = {
        header: null
    }

    render() { 
        return(
            <View style={styles.container}>

                <FlatList
                data={quizes}
                keyExtractor={item => item.id.toString()}
                renderItem={({item}) => (
                    <Card title={item.title} >
                        <Text style={{color: "gray", alignSelf: "flex-end"}}>{item.done} / {item.questions}</Text>
                        <Button
                            rightIcon={{name: 'arrow-forward'}}
                            backgroundColor='#9C00FF'
                            title='COMEÇAR'
                            onPress={() => this.props.navigation.navigate('Question', { screen: Question})}
                        />
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

const quizes = [{
    id: 0,
    title: 'Revisão VP1',
    questions: 15,
    done: 5
},{
    id: 1,
    title: 'Questionário Diagrama de Classes',
    questions: 15,
    done: 5
},{
    id: 2,
    title: 'Enquete de Introdução',
    questions: 15,
    done: 5
}]