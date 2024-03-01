import { Keyboard, SafeAreaView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Member from './Screens/Member';
import MemberList from './Screens/MemberList';

function MemberScreen() {
  return (<Member isSignUp={false}/>)
}

function MemberListScreen() {
  return (<MemberList/>)
}

export default function App() {

  const Tab = createBottomTabNavigator()

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeContainer}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name='Home' component={MemberScreen}/>
            <Tab.Screen name='Members' component={MemberListScreen}/>
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  }
});
