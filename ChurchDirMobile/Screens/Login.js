import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import Member from './Member';
import React from 'react';

export default function Login({handleLogin}) {
  const {control, handleSubmit} = useForm()
  const [isRegistering, setRegistering] = React.useState(false)
  const apiUrl = "http://localhost:5087/"
  const loginUrl = apiUrl + "SignIn"
  
  const onSubmit = (data) => {
    /*fetch(loginUrl, {
      method: "POST",
      body: data
    }).then(res => {
      if (res.ok) {
        handleLogin()
      }
    })*/
    handleLogin()
  }

  const onSignUp = () => {
    setRegistering(true)
  }

  return (
    <View style={styles.container}>
      { isRegistering ? 
      <Member isSignUp={true}/>
      : <ScrollView>
        <Input name="username" control={control} placeholder="Username"/>
        <Input name="password" control={control} placeholder="Password"/>
        <Button 
        title="Login"
        onPress={handleSubmit(onSubmit)}
        />
        <Button 
        title="Sign Up"
        onPress={onSignUp}
        />
        </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  }
});
