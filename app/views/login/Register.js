import React from 'react';
import { StyleSheet, View, ScrollView, Picker, Image } from 'react-native';
import { FormInput, Button, Text } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';
import { Constants } from '../../Constants';


export class Register extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            instituitions: [],            
            loading: false,
            email: '',
            name: '',
            password: '',
            instituitionUid: '',
            avatar: 1,
            role: this.props.navigation.state.params.role
        }

        this.loadInstituitions()
    }

    loadInstituitions = () => {
        ref = firebase.firestore().collection('instituitions')
        let array = []
        ref.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                array.push(doc.data());
            })
            this.setState({ instituitions: array})
        }.bind(this)).catch(function (error) {
            console.log(error)
            alert(error.message)
        })
    }

    componentWillUnmount = () => {}

    register = () => {
        this.setState({ loading: true})

        try {
            if(this.state.password.length < 6) {
                alert("A senha deve ser de no mínimo 6 dígitos")
                return;
            }
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((authData) => {

                ref = firebase.firestore().collection('users') 
                ref.add({ email: this.state.email, name: this.state.name, role: this.state.role, avatar: this.state.avatar, uid: authData.user.uid, instituitionUid: this.state.instituitionUid }).then((response) => {
                    this.props.navigation.push('Classes')
                }).catch((error) => {
                    alert(error.message)
                })
                
            }).catch((error) => {
                alert(error.message)
            })
        } catch(error) {
            console.log(error.toString())
        }
    }

    render() { 
        let items = avatars.map( (avatar) => {
            return <Picker.Item key={avatar['value']} value={avatar['value']} label={avatar['label']} />
        });

        return(
            <View style={{flex: 1}} >
                <HeaderSection navigation={this.props.navigation} goBack={true} />

                <ScrollView style={styles.container} keyboardShouldPersistTaps={"always"}>
                    <View style={styles.cardContainer}>
                        <Spinner visible={false} textContent={"Carregando..."} textStyle={{ color: '#FFF'}} />
                        <Text h2 style={styles.title}>CADASTRO</Text>

                        <FormInput placeholder="Email"
                        autoCapitalize="none"
                        keyboardType='email-address'
                        onChangeText={(email) => this.setState({email})}/>

                        <FormInput placeholder="Nome"
                        onChangeText={(name) => this.setState({name})}/>
                        {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                        <FormInput placeholder="Senha"
                        autoCapitalize="none"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({password})}/>
                        {/* <FormValidationMessage>Campo inválido</FormValidationMessage> */}

                        <Text h5 style={styles.baseText}>
                            Escolha seu avatar:
                        </Text>
                        <Image 
                        style={styles.icon} 
                        resizeMode='contain'
                        source={avatars[this.state.avatar - 1]['image']}
                        />

                        <Picker
                            selectedValue={this.state.avatar}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({avatar: itemValue})}>
                            { items }
                        </Picker>                        

                        <Text h5 style={styles.baseText}>
                            Escolha sua instituição:
                        </Text>
                        <Picker
                            style={styles.pickerBase}
                            selectedValue = {this.state.instituitionUid}
                            onValueChange={(itemValue, itemIndex) => this.setState({instituitionUid: itemValue})}>
                            {this.state.instituitions.map((item, key) => {
                                return (<Picker.Item label = {item.name} value = {item.uid} key = {key}/>)
                            })}
                        </Picker>

                        <Button
                        small
                        backgroundColor={Constants.Colors.Primary}
                        color='#FFFFFF'
                        buttonStyle={styles.registerBtn}
                        rightIcon={{name: 'chevron-right', color: '#FFFFFF'}}
                        title='CONTINUAR'
                        rounded={true}
                        onPress={() => this.register()}
                        fontWeight='800' />

                    </View>
                </ScrollView>
            </View>
        );
    }
}

const avatars = [{
    label: '1',
    value: 1,
    image: require('../../assets/img/avatars/1.png')
},
{
    label: '2',
    value: 2,
    image: require('../../assets/img/avatars/2.png')
},
{
    label: '3',
    value: 3,
    image: require('../../assets/img/avatars/3.png')
}, 
{
  label: '4',
  value: 4,
  image: require('../../assets/img/avatars/4.png')
},
{
  label: '5',
  value: 5,
  image: require('../../assets/img/avatars/5.png')
}]

const styles = StyleSheet.create({ 
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 20,
        paddingHorizontal: 20        
    },
    icon: {
        width: 100,
        height: 100,
        marginVertical: 20,
    },
    cardContainer: {
        flex: 1,
        marginBottom: 50,
        backgroundColor: '#FFF',
    },
    title: {
        color: Constants.Colors.Primary,
        alignSelf: 'center',
        marginTop: 20
    },
    registerBtn: {
        marginTop: 40
    },
    baseText: {
        color: Constants.Colors.Primary,
        paddingHorizontal: 20,
        paddingTop: 20,
        fontFamily: "montserrat_bold"
    },
    pickerBase: {
        paddingHorizontal: 20,
        height: 50, 
        width: 300
    }
});