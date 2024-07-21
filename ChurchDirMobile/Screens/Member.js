import { useForm } from 'react-hook-form';
import InputComp from '../Components/InputComp.js';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card } from '@rneui/themed';
import React, { useEffect } from 'react';
import { updateUserAttributes } from 'aws-amplify/auth';
import { apiUrl } from "../config.js";
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * Shows details of a member
 * @param userID the ID of member to show
 * @returns 
 */
export default function Member({userID, readOnly = false}) {
  const {control, handleSubmit, setValue} = useForm()
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
    fetchAuthSession().
    then(resp => 
      fetch(getUserUrl, 
        {
          method: "GET",
          headers: new Headers([
            ["Authorization", resp.tokens.idToken]
        ])
        })
    ).then(res => res.json())
    .then(result => {
      setGivenName(result.GivenName)
      setSurname(result.Surname)
      setEmail(result.Email)
      setPhone(result.Phone)
      setAddress(result.Address)
    })
    .catch(error => {console.error(error)})
  }
  
  const onSubmit = (data) => {

    // Put in user's ID before sending PUT request
    data["UserID"] = userID
    data["PK"] = userID
    data["SK"] = userID

    fetchAuthSession().
    then(resp => fetch(updateUrl, 
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: new Headers([
          ["Authorization", resp.tokens.idToken]
      ])
      }))
      .then(resp => {
        if (resp.ok) {
          updateUserAttributes({userAttributes: { email: data["Email"]}})
        }
      })
      .catch(error => {
        console.error(error)
      })
  }

  return (
    <View style={styles.container}>
        <ScrollView>
          <Card>
            <InputComp name="GivenName" control={control} placeholder="Given name" defValue={givenName} isReadOnly={readOnly}/>
            <InputComp name="Surname" control={control} placeholder="Surname" defValue={surname} isReadOnly={readOnly}/>
            <InputComp name="Email" control={control} placeholder="Email" defValue={email} isReadOnly={true}/>
            <InputComp name="Phone" control={control} placeholder="Phone" defValue={phone} isReadOnly={readOnly}/>
            <InputComp name="Address" control={control} placeholder="Address" defValue={address} isReadOnly={readOnly}/>
            {!readOnly && <Button
            style={styles.button}
            title="Save"
            onPress={handleSubmit(onSubmit)}
            />}
        </Card>
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  },
  button: {
    marginTop: 32
  }
});
