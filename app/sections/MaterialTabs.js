import React from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native'
import Icon from '@expo/vector-icons/MaterialCommunityIcons'
import { Header } from 'react-native-elements';

import { Board } from '../views/board/Board'
import { Doubts } from '../views/doubts/Doubts'
import { Events } from '../views/events/Events'
import { Status } from '../views/status/Status'
import { Quizes } from '../views/quizes/Quizes'


import BottomNavigation, { IconTab, Badge, FullTab } from 'react-native-material-bottom-navigation'  

export class MaterialTabs extends React.Component {

    tabs = [
        {
          id: 0,
          key: 'board',
          icon: 'book',
          label: 'Quadro',
          barColor: '#9C00FF',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          id: 1,
          key: 'events',
          icon: 'calendar',
          label: 'Eventos',
          barColor: '#9C00FF',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        },
        {
          id: 2,
          key: 'status',
          icon: 'face',
          label: 'Status',
          barColor: '#9C00FF',
          pressColor: 'rgba(255, 255, 255, 0.16)'
        }, 
        {
            id: 3,
            key: 'quizes',
            icon: 'spellcheck',
            label: 'Quizes',
            barColor: '#9C00FF',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        },{
            id: 4,
            key: 'doubts',
            icon: 'comment-question',
            label: 'Dúvidas',
            barColor: '#9C00FF',
            pressColor: 'rgba(255, 255, 255, 0.16)'
        }
    ]

    views = [<Board navigation={this.props.navigation}/>, 
    <Events navigation={this.props.navigation}/>,
    <Status  navigation={this.props.navigation} />, 
    <Quizes navigation={this.props.navigation} />, 
    <Doubts  navigation={this.props.navigation} />]

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
                centerComponent={{ text: 'APIS1', style: { color: '#fff', fontWeight: "800" } }}
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