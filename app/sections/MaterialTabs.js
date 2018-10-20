import React from 'react';
import { View } from 'react-native'
import { Constants } from '../Constants'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'

import { Board } from '../views/board/Board'
import { Doubts } from '../views/doubts/Doubts'
import { Events } from '../views/events/Events'
import { Status } from '../views/status/Status'
import { Quizes } from '../views/quizes/Quizes'


import BottomNavigation, { IconTab, Badge, FullTab } from 'react-native-material-bottom-navigation'  
import { HeaderSection } from './HeaderSection';

export class MaterialTabs extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        activeTab: this.tabs[0],
        activeView: 0
      }
    }

    tabs = [
      {
        id: 0,
        key: 'board',
        icon: 'book',
        label: 'Quadro',
        barColor: Constants.Colors.Primary,
        pressColor: 'rgba(255, 255, 255, 0.16)'
      },
      {
        id: 1,
        key: 'events',
        icon: 'calendar',
        label: 'Eventos',
        barColor: Constants.Colors.Primary,
        pressColor: 'rgba(255, 255, 255, 0.16)'
      },
      {
        id: 2,
        key: 'status',
        icon: 'face',
        label: 'Status',
        barColor: Constants.Colors.Primary,
        pressColor: 'rgba(255, 255, 255, 0.16)'
      }, 
      {
          id: 3,
          key: 'quizes',
          icon: 'spellcheck',
          label: 'Quizes',
          barColor: Constants.Colors.Primary,
          pressColor: 'rgba(255, 255, 255, 0.16)'
      },{
          id: 4,
          key: 'doubts',
          icon: 'comment-question',
          label: 'Dúvidas',
          barColor: Constants.Colors.Primary,
          pressColor: 'rgba(255, 255, 255, 0.16)'
      }
    ]

    views = [
    <Board 
      navigation={this.props.navigation} 
      user={this.props.navigation.state.params.user}
      classroom={this.props.navigation.state.params.classroom}/>, 
    <Events 
      navigation={this.props.navigation}
      user={this.props.navigation.state.params.user}
      classroom={this.props.navigation.state.params.classroom}/>, 
    <Status 
      navigation={this.props.navigation}
      user={this.props.navigation.state.params.user}
      classroom={this.props.navigation.state.params.classroom}/>,  
    <Quizes 
      navigation={this.props.navigation}
      user={this.props.navigation.state.params.user}
      classroom={this.props.navigation.state.params.classroom}/>, 
    <Doubts 
      navigation={this.props.navigation}
      user={this.props.navigation.state.params.user}
      classroom={this.props.navigation.state.params.classroom}/>
    ]

    renderIcon = icon => ({ isActive }) => (
      <Icon size={24} color="white" name={icon} />
    )
  
    renderTab = ({ tab, isActive }) => (
        <IconTab
        isActive={isActive}
        showBadge={tab.key === ''}
        renderBadge={() => <Badge></Badge>}
        key={tab.key}
        label={tab.label}
        renderIcon={this.renderIcon(tab.icon)}
      />
    )

    render() {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <HeaderSection title={this.props.navigation.state.params.classroom.name} navigation={this.props.navigation} goBack={true} />
            {this.views[this.state.activeView]}
          </View>
          <BottomNavigation
          tabs={this.tabs}
          activeTab={this.state.activeTab.key}
          onTabPress={newTab => this.setState({ activeTab: newTab, activeView: newTab.id })}
          renderTab={this.renderTab}
          useLayoutAnimation
        />
        </View>
      )
    }
  }