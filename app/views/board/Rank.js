import React from 'react';
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, FlatList } from 'react-native';
import { Card, Text, Icon } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'

export class Rank extends React.Component {

    static navigationOptions = {
        header: null
    }

    goBack = () => {
        this.props.navigation.goBack()
    }

    render() { 
        return(
            <View style={styles.container}>
                <HeaderSection navigation={this.props.navigation} goBack={true} />
                <ScrollView>

                    <Text style={{alignSelf: 'center', marginTop: 10,}} h2>RANK</Text>

                    <FlatList
                    data={students}
                    keyExtractor={item => item.title}
                    renderItem={({item}) => (
                        <Card flexDirection='row' wrapperStyle={styles.studentCard}>
                            <Icon
                                raised
                                containerStyle={{backgroundColor:'#AFAFAF'}}
                                name='user'
                                type='font-awesome'
                                color='#f1f1f1'
                            /> 
                            <Text>Davi P. Costa</Text>
                            <Text>1º</Text> 
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
    studentCard: {
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

const students = [{
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
},{
    id: 4,
    title: 'Lorem Ipslum'   
},]