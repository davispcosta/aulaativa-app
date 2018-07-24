import React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { Header } from 'react-native-elements';

import { Board } from '../views/board/Board'
import { Doubts } from '../views/doubts/Doubts'
import { Events } from '../views/events/Events'
import { Missions } from '../views/missions/Missions'
import { Quizes } from '../views/quizes/Quizes'


import BottomNavigation, { IconTab, Badge, FullTab } from 'react-native-material-bottom-navigation'  

export class MaterialTabs extends React.Component {

    tabs = [
        {
          id: 0,
          key: 'board',
          icon: 'book',
          label: 'Quadro',
          barColor: '#388E3C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          id: 1,
          key: 'missions',
          icon: 'flag',
          label: 'Missões',
          barColor: '#B71C1C',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          id: 2,
          key: 'events',
          icon: 'calendar',
          label: 'Eventos',
          barColor: '#00796B',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        }, 
        {
            id: 3,
            key: 'quizes',
            icon: 'spellcheck',
            label: 'Quizes',
            barColor: '#FFA000',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },{
            id: 4,
            key: 'doubts',
            icon: 'comment-question',
            label: 'Dúvidas',
            barColor: '#2196F3',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
    ]

    views = [<Board navigation={this.props.navigation}/>, 
    <Missions />, 
    <Events />, 
    < Quizes/>, 
    <Doubts />]

    state = {
        activeTab: this.tabs[0],
        activeView: 0
    }

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

    onPress = () => {
      this.props.navigation.navigate('Classes')
    }
  
    render() {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <Header
                leftComponent={{ icon: 'arrow-back', color: '#fff', onPress: this.onPress }}
                backgroundColor='#9C00FF'
                centerComponent={{ text: 'APIS1', style: { color: '#fff' } }}
            />
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