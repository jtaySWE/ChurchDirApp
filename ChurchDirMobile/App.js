import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';
import ImportDirectory from './Screens/ImportDirectory';
import React, { useEffect } from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';
import amplifyconfig from './src/amplifyconfiguration.json';
import { fetchAuthSession } from 'aws-amplify/auth';
import { ThemeProvider, createTheme, Icon } from '@rneui/themed';

Amplify.configure(amplifyconfig);

const theme = createTheme({
  lightColors: {
    secondary: '#d1dbe4',
    primary: '#7593af',
    success: "#476f95"
  },
  darkColors: {
    primary: '#194a7a',
  },
  mode: 'light',
  /*components: {
    Card: {
      containerStyle: {
        backgroundColor: '#476f95'
      }
    }
  }**/
});

export default function App() {
  const Stack = createNativeStackNavigator()
  
  function MainScreen() {
    const Tab = createBottomTabNavigator()
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [isAdmin, setIsAdmin] = React.useState(false)
    
    useEffect(() => {
      fetchAuthSession().
      then(session => {
      setIsAdmin(session.tokens.idToken.payload['cognito:groups'].includes('admins'))
      })}, [])

    return (
      <Tab.Navigator 
      initialRouteName='Home'
      screenOptions={({route}) => ({
        headerRight: () => (<Icon name='logout' 
        onPress={signOut} type='simple-line-icon' style={styles.iconStyle}/>),
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Members: 'people',
            Import: 'folder-alt'
          };
    
          return (
            <Icon
              name={icons[route.name]}
              color={color}
              size={size}
              type='simple-line-icon'
            />
          );
        }
      })}
      >
        <Tab.Screen name='Home' children={() => (<Member userID={user.userId}/>)}/>
        {isAdmin && (<Tab.Screen name='Members' children={() => (<MemberList/>)}/>)}
        {isAdmin && (<Tab.Screen name='Import' children={() => (<ImportDirectory/>)}/>)}
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
        <ThemeProvider theme={theme}>
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
        </ThemeProvider>
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
  },
  iconStyle: {
    marginRight: 8
  }
});
