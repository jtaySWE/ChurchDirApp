import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

export default function Member({isSignUp, handleSignUp, loggedUsername}) {
  const {control, handleSubmit, setValue} = useForm()
  const apiUrl = "https://3o3fpw8jb6.execute-api.ap-southeast-2.amazonaws.com/"
  const signUpUrl = apiUrl + "Member"
  const updateUrl = apiUrl + "Member"
  const getUserUrl = apiUrl + "Member/" + loggedUsername

  const [givenName, setGivenName] = React.useState("")
  const [surname, setSurname] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [address, setAddress] = React.useState("")
  let passwordFromUser = ""

  // Used for placing in user details after just signing in
  useEffect(() => {
    setValue("GivenName", givenName)
    setValue("Surname", surname)
    setValue("Email", email)
    setValue("Phone", phone)
    setValue("Address", address)
  }, [givenName, surname, email, phone, address])

  // If not for signing up, load in details of logged in member
  if (!isSignUp && loggedUsername) {
    fetch(getUserUrl)
    .then(res => res.json())
    .then(result => {
      setGivenName(result.GivenName)
      setSurname(result.Surname)
      setEmail(result.Email)
      setPhone(result.Phone)
      setAddress(result.Address)
      passwordFromUser = result.Password
    })
  }
  
  const onSubmit = (data) => {
    const confirmPwd = data["confirmPwd"]
    delete data["confirmPwd"]
    data["IsAdmin"] = true
    
    if (isSignUp) {
      // Check if password matches
      if (data["Password"] == confirmPwd) {
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
      data["Username"] = loggedUsername
      data["Password"] = passwordFromUser
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
        <Input name="GivenName" control={control} placeholder="Given name" defValue={givenName}/>
        <Input name="Surname" control={control} placeholder="Surname" defValue={surname}/>
        <Input name="Email" control={control} placeholder="Email" defValue={email}/>
        <Input name="Phone" control={control} placeholder="Phone" defValue={phone}/>
        <Input name="Address" control={control} placeholder="Address" defValue={address}/>
        {isSignUp && <Input name="Username" control={control} placeholder="Username" defValue=""/>}
        {isSignUp && <Input name="Password" control={control} placeholder="Password" defValue=""/>}
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
