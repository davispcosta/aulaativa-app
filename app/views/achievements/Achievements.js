import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, FlatList, RefreshControl } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import { Constants } from '../../Constants';
import { HeaderSection } from '../../sections/HeaderSection';
import * as firebase from 'firebase';
import { ProfessorAchievements } from './ProfessorAchievements';
import { StudentAchievements } from './StudentAchievements';

export class Achievements extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: this.props.navigation.state.params.user,
        classroom: this.props.navigation.state.params.classroom,
    }
  }

  render() {

    var screen = null;
    if(this.state.user.role == "Professor") {
      screen = <ProfessorAchievements user={this.state.user} navigation={this.props.navigation} classroom={this.state.classroom} />
    } else if (this.state.user.role == "Student") {
      screen = <StudentAchievements user={this.state.user} navigation={this.props.navigation} classroom={this.state.classroom}/>
    }
    return (
      <View style={styles.container}>
        <HeaderSection navigation={this.props.navigation} goBack={true} />

        <ScrollView>
          { screen }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1
  },
  emptyIcon: {
      width: 100
  },
  baseText: {
      color: Constants.Colors.Primary,
      paddingHorizontal: 20,
      paddingTop: 20,
      fontFamily: "montserrat_bold"
  }
});
