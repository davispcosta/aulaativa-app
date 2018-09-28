import React from 'react';
import { StyleSheet, Image, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Button, Text, Card } from 'react-native-elements'
import { HeaderSection } from '../../sections/HeaderSection'
import { Constants } from '../../Constants';

export class ChooseRegister extends React.Component {

    render() { 
        return(
            <View style={{flex: 1}}>

                <HeaderSection navigation={this.props.navigation} goBack={true} />

                <ScrollView style={styles.container}>
                    <Text h2 style={styles.title}>Que tipo de usuário você é?</Text>

                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.push('RegisterScreen', { rule: 'Professor'})}
                    >
                    <Card
                    wrapperStyle={{alignItems: 'center', justifyContent: 'space-around'}}
                    containerStyle={{backgroundColor: Constants.Colors.Primary}}
                    flexDirection="row"
                    >   
                        <Image 
                        style={styles.icon} 
                        resizeMode='contain'
                        source={require('../../assets/img/professor.png')}
                        />
                        <Text style={{color: 'white'}} h4>Professor</Text>
                    </Card>
                    </TouchableWithoutFeedback>
                    
                    <TouchableWithoutFeedback
                    onPress={() => this.props.navigation.push('RegisterScreen', { rule: 'Student'})}
                    >
                    <Card
                    wrapperStyle={{alignItems: 'center', justifyContent: 'space-around'}}
                    containerStyle={{backgroundColor: Constants.Colors.Primary}}
                    flexDirection="row"
                    >   
                        <Image 
                        style={styles.icon} 
                        resizeMode='contain'
                        source={require('../../assets/img/student.png')}
                        />
                        <Text style={{color: 'white'}} h4>Aluno</Text>
                    </Card>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 20,
        paddingHorizontal: 20
    },
    title: {
        color: Constants.Colors.Primary,
        alignSelf: 'center',
        marginTop: 20,
    },
    icon: {
      width: 50  
    },
    btn: {
        marginTop: 30
    }
});