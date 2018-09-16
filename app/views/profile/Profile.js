import React, { Component } from 'react';
import { StyleSheet, View, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { Header, Text, Icon, Card } from 'react-native-elements'
import { Constants } from '../../Constants';

export class Profile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={styles.container}>

        <Header
          leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: this.goBack }}
          backgroundColor={Constants.Colors.Primary}
          centerComponent={{ text: 'APIS1', style: { color: '#fff' } }}
        />

        <ScrollView>

          <View style={styles.imgContainer}>
            <Icon type='font-awesome' name='user' color='#f1f1f1' size={50} />
          </View>
          
          <View style={{paddingLeft: 20, marginVertical: 20}}>
            <Text h3>Adriano Augusto</Text>
            <Text h4>Contato</Text>
            <Text>adriano@gmail.com</Text>
            <Text>(85) 985489885</Text>
          </View>

          <Text h4 style={{alignSelf: 'center',}}>Disciplinas</Text>

          <FlatList
            data={classes}
            keyExtractor={item => item.id.toString()}
            renderItem={({item}) => (
              <Card flexDirection="row">
                <Icon
                  raised
                  containerStyle={{backgroundColor:'#AFAFAF'}}
                  name='class'
                  color='#f1f1f1'
                />
                <View style={{marginLeft: 20}}>
                  <Text
                    style={{fontFamily: 'montserrat'}}
                    h4>{item.title}</Text>
                  <Text>{item.professor}</Text>
                  <Text style={{color: "gray"}}>{item.alunos} ALUNOS</Text>
                </View>
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
  imgContainer: {
    width: '100%',
    backgroundColor: 'grey',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  }
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
