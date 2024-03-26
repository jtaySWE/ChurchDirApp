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
    let reqData = new FormData()

    for(const field of Object.keys(data)) {
      reqData.append(field, data[field])
    }

    fetch(loginUrl, {
      method: "POST",
      body: reqData
    }).then(res => {
      if (res.ok) {
        handleLogin(data.username)
      }
    }).catch(error => {
      alert(error)
    })
  }

  const onSignUp = () => {
    setRegistering(true)
  }

  const onRegistered = () => {
    setRegistering(false)
  }

  return (
    <View style={styles.container}>
      { isRegistering ? 
      <Member isSignUp={true} handleSignUp={onRegistered} loggedUsername=""/>
      : <ScrollView>
        <Input name="username" control={control} placeholder="Username" defValue=""/>
        <Input name="password" control={control} placeholder="Password" defValue=""/>
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
