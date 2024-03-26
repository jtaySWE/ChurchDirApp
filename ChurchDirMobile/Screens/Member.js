import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

export default function Member({isSignUp, handleSignUp, loggedUsername}) {
  const {control, handleSubmit, setValue} = useForm()
  const apiUrl = "http://localhost:5087/"
  const signUpUrl = apiUrl + "SignUp"
  const updateUrl = apiUrl + "UpdateMember"
  const getUserUrl = apiUrl + "GetMember/" + loggedUsername

  const [givenName, setGivenName] = React.useState("")
  const [surname, setSurname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  let passwordFromUser = ""

  // Used for placing in user details after just signing in
  useEffect(() => {
    setValue("givenName", givenName)
    setValue("surname", surname)
    setValue("email", email)
    setValue("phone", phone)
    setValue("address", address)
  })

  // If not for signing up, load in details of logged in member
  if (!isSignUp && loggedUsername) {
    fetch(getUserUrl)
    .then(res => res.json())
    .then(result => {
      setGivenName(result.givenName)
      setSurname(result.surname)
      setEmail(result.email)
      setPhone(result.phone)
      setAddress(result.address)
      passwordFromUser = result.password
    })
  }
  
  const onSubmit = (data) => {
    const confirmPwd = data["confirmPwd"]
    delete data["confirmPwd"]
    data["isAdmin"] = true
    
    if (isSignUp) {
      // Check if password matches
      if (data["password"] == confirmPwd) {
        fetch(signUpUrl, 
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)

          }).then(res => {
            if (res.ok) {
              handleSignUp()
            }
          })
          .catch(error => {
            alert(error)
          })
      } else {
        alert("Make sure your confirmed password matches!")
      }
    } else {
      // Filling in current username and password before updating member
      data["username"] = loggedUsername
      data["password"] = passwordFromUser
      fetch(updateUrl, 
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }).catch(error => {
          alert(error)
        })
    }
  }

  return (
    <View style={styles.container}>
        <ScrollView>
        <Input name="givenName" control={control} placeholder="Given name" defValue={givenName}/>
        <Input name="surname" control={control} placeholder="Surname" defValue={surname}/>
        <Input name="email" control={control} placeholder="Email" defValue={email}/>
        <Input name="phone" control={control} placeholder="Phone" defValue={phone}/>
        <Input name="address" control={control} placeholder="Address" defValue={address}/>
        {isSignUp && <Input name="username" control={control} placeholder="Username" defValue=""/>}
        {isSignUp && <Input name="password" control={control} placeholder="Password" defValue=""/>}
        {isSignUp && <Input name="confirmPwd" control={control} placeholder="Confirm Password" defValue=""/>}
        <Button 
        title={isSignUp ? "Register" : "Save"}
        onPress={handleSubmit(onSubmit)}
        />
        {isSignUp && <Button title="Cancel"
        onPress={handleSignUp}/>}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  }
});
