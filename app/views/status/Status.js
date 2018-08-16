import React from 'react';
import { StyleSheet, View, Image, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Header, Text, Icon } from 'react-native-elements'

export class Status extends React.Component {

    static navigationOptions = {
        header: null
    }

    generateFaults() {
        const faults = [];
        for(let i=0; i<10; i++) {
            faults.push(
                <Icon
                    key={i} 
                    name="favorite"
                    color="#FF412F"
                />
            );
        }
        return faults;
    }
    
    render() { 
        return(
            <View style={styles.container}>
                <Text style={styles.subtitle} h4>EXPERIÊNCIA</Text>
                <View style={styles.xpBar}></View>
                <Text h5>220 xp</Text>
                <Text style={styles.subtitle} h4>FALTAS</Text>
                <View style={styles.faults}>
                    {this.generateFaults()}
                </View>
                <Text style={styles.subtitle} h4>CONQUISTAS</Text>
                <FlatList
                data={achievements}
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
        alignItems: 'center',
    },
    subtitle: {
        margin: 20,
    },
    xpBar: {
        width: "80%",
        height: 5,
        backgroundColor: "#000",
        borderRadius: 5,
    },
    faults: {
        flexDirection: 'row'
    }
});

const achievements = [{
    id: 0,
    title: 'Trabalho Entregue',   
},{
    id: 1,
    title: 'Ponto Na VP1',
}]