import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';

/**
 * Shows details of a member
 * @param userID the ID of member to show
 * @returns 
 */
export default function Member({userID, readOnly = false}) {
  const {control, handleSubmit, setValue} = useForm()
  const apiUrl = "https://3o3fpw8jb6.execute-api.ap-southeast-2.amazonaws.com/"
  const updateUrl = apiUrl + "Member"
  const getUserUrl = apiUrl + "Member/" + userID

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

  if (userID) {
    fetch(getUserUrl)
    .then(res => res.json())
    .then(result => {
      setGivenName(result.GivenName)
      setSurname(result.Surname)
      setEmail(result.Email)
      setPhone(result.Phone)
      setAddress(result.Address)
    })
    .catch(error => {alert(error)})
  }
  
  const onSubmit = (data) => {

    // Put in user's ID before sending PUT request
    data["UserID"] = userID
    data["PK"] = userID
    data["SK"] = userID

    fetch(updateUrl, 
      {
        method: "PUT",
        body: JSON.stringify(data)
      }).catch(error => {
        alert(error)
      })
  }

  return (
    <View style={styles.container}>
        <ScrollView>
        <Input name="GivenName" control={control} placeholder="Given name" defValue={givenName} isReadOnly={readOnly}/>
        <Input name="Surname" control={control} placeholder="Surname" defValue={surname} isReadOnly={readOnly}/>
        <Input name="Email" control={control} placeholder="Email" defValue={email} isReadOnly={readOnly}/>
        <Input name="Phone" control={control} placeholder="Phone" defValue={phone} isReadOnly={readOnly}/>
        <Input name="Address" control={control} placeholder="Address" defValue={address} isReadOnly={readOnly}/>
        { !readOnly && <Button 
        title="Save"
        onPress={handleSubmit(onSubmit)}
        />}
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
