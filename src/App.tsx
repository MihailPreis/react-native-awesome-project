import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './ui/home/HomeScreen';
import CatViewer from './ui/cat/CatViewer';
import UsersScreen from './ui/user/UsersScreen';
import UserDetails from './ui/user/UserDetails';
import RNShake from 'react-native-shake';
import DevMenuScreen from './ui/devmenu/DevMenuScreen';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();

function Main({ navigation, route }) {

  useEffect(() => {
    let shakeHandler = () => navigation.navigate('DevMenu');
    RNShake.addEventListener('ShakeEvent', shakeHandler);
    return () => RNShake.removeEventListener('ShakeEvent', shakeHandler);
  }, [])

  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen name="Home" component={HomeScreen} options={{ title: '🐄💨' }} />
      <MainStack.Screen name="CatViewer" component={CatViewer} options={{ title: '🐈🐈‍⬛🐈' }} />
      <MainStack.Screen name="UsersViewer" component={UsersScreen} options={{ title: 'Users' }} />
      <MainStack.Screen name="UserDetails" component={UserDetails} options={{ title: 'John Doe' }} />
    </MainStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal" initialRouteName="Main">
        <RootStack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <RootStack.Screen name="DevMenu" component={DevMenuScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
