import { Button, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';
import Login from './Screens/Login';
import React from 'react';
import { SimpleLineIcons } from '@expo/vector-icons';

export default function App() {

  const Tab = createBottomTabNavigator()
  const [isSignedIn, setSignIn] = React.useState(false)
  
  const loginMember = () => {
    setSignIn(true)
  }

  const logoutMember = () => {
    setSignIn(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeContainer}>
        {isSignedIn ? 
        <NavigationContainer>
          <Tab.Navigator 
          initialRouteName='Home'
          >
            <Tab.Screen name='Home' children={() => (<Member isSignUp={false}/>)}
            options={
              {
                headerRight: () => (<SimpleLineIcons.Button name='logout' 
                  onPress={logoutMember} color="black" backgroundColor="white"/>)
              }
            }/>
            <Tab.Screen name='Members' children={() => (<MemberList/>)}/>
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
