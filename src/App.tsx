import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './ui/home/HomeScreen';
import CatViewer from './ui/cat/CatViewer';
import UsersScreen from './ui/user/UsersScreen';
import UserDetails from './ui/user/UserDetails';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '🐄💨' }} />
        <Stack.Screen name="CatViewer" component={CatViewer} options={{ title: '🐈🐈‍⬛🐈' }} />
        <Stack.Screen name="UsersViewer" component={UsersScreen} options={{ title: 'Users' }} />
        <Stack.Screen name="UserDetails" component={UserDetails} options={{ title: 'John Doe' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
