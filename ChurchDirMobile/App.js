import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';
import Login from './Screens/Login';
import React from 'react';

function MemberScreen() {
  return (<Member isSignUp={false}/>)
}

function MemberListScreen() {
  return (<MemberList/>)
}

export default function App() {

  const Tab = createBottomTabNavigator()
  const [isSignedIn, setSignIn] = React.useState(false)
  const loginMember = () => {
    setSignIn(true)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeContainer}>
        {isSignedIn ? 
        <NavigationContainer>
          <Tab.Navigator initialRouteName='Home'>
            <Tab.Screen name='Home' component={MemberScreen}/>
            <Tab.Screen name='Members' component={MemberListScreen}/>
          </Tab.Navigator>
        </NavigationContainer> : 
        <Login handleLogin={loginMember}/>}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  }
});
