import { Button, Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';
import React from 'react';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

import awsExports from './src/aws-exports';
Amplify.configure(awsExports);

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
    const {signOut, user} = useAuthenticator((context) => [context.user])
    return (
      <Tab.Navigator 
      initialRouteName='Home'
      >
        <Tab.Screen name='Home' children={() => (<Member isSignUp={false} handleSignUp={null} 
        loggedUsername={loggedUser}/>)}
        options={
          {
            headerRight: () => (<SimpleLineIcons.Button name='logout' 
              onPress={signOut} color="black" backgroundColor="white"/>)
          }
        }/>
        <Tab.Screen name='Members' children={() => (<MemberList/>)}/>
      </Tab.Navigator>
    )
  }

  return (
    <Authenticator.Provider>
      <Authenticator>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeContainer}>
            <NavigationContainer>
              <Stack.Navigator initialRouteName='Main'>
                <Stack.Screen name='Main' component={MainScreen} options={{headerShown: false}}/>
                <Stack.Screen name='Profile' component={MemberProfile}/>
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Authenticator>
    </Authenticator.Provider>
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
