import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import InputComp from '../Components/InputComp';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import Member from './Member';
import React from 'react';

export default function Login({handleLogin}) {
  const {control, handleSubmit} = useForm()
  const [isRegistering, setRegistering] = React.useState(false)
  const apiUrl = "https://3o3fpw8jb6.execute-api.ap-southeast-2.amazonaws.com/"
  const loginUrl = apiUrl + "SignIn"
  
  const onSubmit = (data) => {

    fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
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
        <InputComp name="username" control={control} placeholder="Username" defValue=""/>
        <InputComp name="password" control={control} placeholder="Password" defValue="" isPassword={true}/>
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
