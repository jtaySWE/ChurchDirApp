import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';
import React from 'react';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';

import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

export default function App() {
  const Stack = createNativeStackNavigator()
  
  function MainScreen() {
    const Tab = createBottomTabNavigator()
    const { user, signOut } = useAuthenticator((context) => [context.user]);

    return (
      <Tab.Navigator 
      initialRouteName='Home'
      >
        <Tab.Screen name='Home' component={() => (<Member userID={user.userId}/>)}
        options={
          {
            headerRight: () => (<Icon.Button name='logout' 
              onPress={signOut} color="black" backgroundColor="white"/>)
          }
        }/>
        <Tab.Screen name='Members' component={() => (<MemberList/>)}/>
      </Tab.Navigator>
    )
  }

  return (
    <Authenticator.Provider>
      <Authenticator
      components={{
          SignUp: ({ fields, ...props }) => (
            <Authenticator.SignUp
              {...props}
              fields={[...fields,
                {
                  name: 'address',
                  label: 'Address',
                  type: 'default',
                  placeholder: 'Enter your address'
                }
              ]}
            />
          )
        }}>
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
    <Member userID={route.params.selectedUser} readOnly={true}/>
  )
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  }
});
