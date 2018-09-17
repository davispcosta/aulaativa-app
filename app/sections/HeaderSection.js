import React, { Component } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { Header, Icon } from 'react-native-elements';
import { Constants } from '../Constants';

export class HeaderSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  logOut = (navigation) => {
    try {
      firebase.auth().signOut().then(function(){
          navigation.navigate('LoginScreen')
      }).catch(function (error) {
          console.log(error)
          alert(error.message)
      })
    } catch(error) {
      console.log(error.toString())
    }
}


  render() {
    var leftAction = null
    if(this.props.goBack == true) {
      leftAction = <TouchableWithoutFeedback
        onPress={() => this.goBack()}>
        <Icon name='arrow-back' color='#fff'></Icon>
      </TouchableWithoutFeedback>
    } else if (this.props.logOut == true) {
      leftAction = <TouchableWithoutFeedback
        onPress={() => this.logOut()}>
        <Icon type='material-community' name='exit-to-app' color='#f1f1f1'></Icon>
      </TouchableWithoutFeedback>
    }

    var rightAction = null
    if(this.props.goToProfile == true) {
      rightAction = <TouchableWithoutFeedback
        onPress={() =>  this.props.navigation.navigate('Profile')}>
        <Icon type='font-awesome' name='user' color='#f1f1f1'></Icon>
      </TouchableWithoutFeedback>
    }

    return (
        <Header
            leftComponent={leftAction}
            backgroundColor={Constants.Colors.Primary}
            centerComponent={{ text: 'APIS1', style: { color: '#fff', fontFamily: "montserrat_bold" } }}
            rightComponent={rightAction}
        />
    );
  }
}