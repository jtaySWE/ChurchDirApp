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
import { ThemeProvider, createTheme, Icon, useTheme } from '@rneui/themed';

Amplify.configure(amplifyconfig);

const themes = createTheme({
  lightColors: {
    primary: '#003f5c',
    secondary: '#bc5090',
    success: '#ffa600',
    background: '#ddd'
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
    const { theme } = useTheme();
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
        headerStyle: {backgroundColor: theme.colors.secondary},
        tabBarInactiveTintColor: theme.colors.black,
        tabBarActiveTintColor: theme.colors.white,
        tabBarActiveBackgroundColor: theme.colors.primary,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Members: 'people',
            Import: 'folder-alt'
          };
    
          return (
            <Icon
              color={color}
              size={size}
              name={icons[route.name]}
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
        <ThemeProvider theme={themes}>
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
