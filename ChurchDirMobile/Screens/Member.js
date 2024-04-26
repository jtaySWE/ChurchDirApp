import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import { updateUserAttributes } from 'aws-amplify/auth';

/**
 * Shows details of a member
 * @param loggedUsername the username of member to show
 * @returns 
 */
export default function Member({loggedUsername}) {
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

  // Used for placing in user details after just signing in
  useEffect(() => {
    setValue("GivenName", givenName)
    setValue("Surname", surname)
    setValue("Email", email)
    setValue("Phone", phone)
    setValue("Address", address)
  }, [givenName, surname, email, phone, address])

  if (loggedUsername) {
    fetch(getUserUrl)
    .then(res => res.json())
    .then(result => {
      setGivenName(result.GivenName)
      setSurname(result.Surname)
      setEmail(result.Email)
      setPhone(result.Phone)
      setAddress(result.Address)
    })
  }
  
  const onSubmit = (data) => {
    data["Username"] = loggedUsername
    const updateUserInfo = {
      userAttributes: {
        given_name: data.GivenName,
        family_name: data.Surname,
        phone_number: data.Phone,
        address: data.Address
      }
    }
    updateUserAttributes(updateUserInfo)
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

  return (
    <View style={styles.container}>
        <ScrollView>
        <Input name="GivenName" control={control} placeholder="Given name" defValue={givenName}/>
        <Input name="Surname" control={control} placeholder="Surname" defValue={surname}/>
        <Input name="Email" control={control} placeholder="Email" defValue={email}/>
        <Input name="Phone" control={control} placeholder="Phone" defValue={phone}/>
        <Input name="Address" control={control} placeholder="Address" defValue={address}/>
        <Button 
        title="Save"
        onPress={handleSubmit(onSubmit)}
        />
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
