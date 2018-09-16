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

  render() {
    var leftAction = null
    if(this.props.goBack == true) {
      leftAction = <TouchableWithoutFeedback
        onPress={() => this.goBack()}>
        <Icon name='arrow-back' color='#fff'></Icon>
      </TouchableWithoutFeedback>
    } else if (this.props.logOut == true) {

    }

    return (
        <Header
            leftComponent={leftAction}
            backgroundColor={Constants.Colors.Primary}
            centerComponent={{ text: 'APIS1', style: { color: '#fff', fontFamily: "montserrat_bold" } }}
        />
    );
  }
}