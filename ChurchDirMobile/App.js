import { Button, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';
import Login from './Screens/Login';
import React from 'react';
import { SimpleLineIcons } from '@expo/vector-icons';

export default function App() {

  const Stack = createNativeStackNavigator()
  const Tab = createBottomTabNavigator()
  const [isSignedIn, setSignIn] = React.useState(false)
  const [loggedUser, setUser] = React.useState("")

  const loginMember = (user) => {
    setUser(user)
    setSignIn(true)
  }

  const logoutMember = () => {
    setSignIn(false)
  }

  function MainScreen() {
    return (
      <Tab.Navigator 
      initialRouteName='Home'
      >
        <Tab.Screen name='Home' children={() => (<Member isSignUp={false} handleSignUp={null} 
        loggedUsername={loggedUser}/>)}
        options={
          {
            headerRight: () => (<SimpleLineIcons.Button name='logout' 
              onPress={logoutMember} color="black" backgroundColor="white"/>)
          }
        }/>
        <Tab.Screen name='Members' children={() => (<MemberList/>)}/>
      </Tab.Navigator>
    )
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeContainer}>
        {isSignedIn ? 
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen name='Main' component={MainScreen} options={{headerShown: false}}/>
            <Stack.Screen name='Profile' component={MemberProfile}/>
          </Stack.Navigator>
        </NavigationContainer> : 
        <Login handleLogin={loginMember}/>}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

function MemberProfile({navigation, route}) {
  return (
    <Member isSignUp={false} handleSignUp={null} loggedUsername={route.params.selectedUser}/>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  }
});
