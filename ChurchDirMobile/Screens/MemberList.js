import { SectionList, View, StyleSheet, Pressable } from "react-native";
import { Text, ListItem } from "@rneui/themed";
import React, { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { apiUrl} from "../config.js";
import { fetchAuthSession } from 'aws-amplify/auth';
import { useTheme } from '@rneui/themed';

export default function MemberList() {

  const navigation = useNavigation()
  const onSelectMember = (userID) => {
    navigation.navigate("Profile", {selectedUser: userID})
  }

  // We get first letter of name from member
  function getFirstLetterFrom(obj) {
    const name = obj.GivenName + ' ' + obj.Surname
    return name.slice(0, 1).toUpperCase();
  }

  const getMembersUrl = apiUrl + "AllMembers"
  //const getMembersUrl =  "https://5swtdybofi.execute-api.ap-southeast-2.amazonaws.com/Prod/members"
  const [list, setList] = React.useState([])

  useEffect( () => {
    fetchAuthSession().
    then(session => fetch(getMembersUrl, {
      method: "GET",
      headers: new Headers([
        ["Authorization", session.tokens.idToken.toString()]
    ])
    }))
    .then(res => res.json())
    .then(result => {
      if (result) {
        if (result.error) {
          console.log(result.error)
          return
        }

        result.sort((a, b) => {
          return (a.GivenName + ' ' + a.Surname).toLowerCase()
          .localeCompare((b.GivenName + ' ' + b.Surname).toLowerCase())
        })

        // Put list of all members into sections by name
        setList(result
          .reduce(function (list, dataObj, index) {
              let listItem = list.find((item) => item.title && item.title === getFirstLetterFrom(dataObj));
              if (!listItem) {
                list.push({"title": getFirstLetterFrom(dataObj), "data": [dataObj]})
              } else {
                listItem.data.push(dataObj)
              }

              return list;
          }, []))
      }
    }).catch(error => console.error(error));
  }, [])

  const { theme } = useTheme();

  const styles = StyleSheet.create({
    itemContainer: {
      borderBottomWidth: 1,
      height: 44,
      padding: 8,
      fontSize: 16
    },
    headerSection: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      height: 26,
      paddingLeft: 16,
      paddingTop: 3
    },
    listContainer: {
      backgroundColor: "white"
    }
  });

  return (
    <SectionList
        sections={list}
        renderItem={({item}) => (
            <ListItem bottomDivider onPress={() => onSelectMember(item.UserID)}
            style={({pressed}) => [{
              backgroundColor: pressed ? '#f0fbff' : 'white'
            }]}>
              <ListItem.Content>
                <ListItem.Title>{item.GivenName + ' ' + item.Surname}</ListItem.Title>
                <ListItem.Subtitle>{item.Email}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Content right>
                <ListItem.Subtitle>{item.Phone}</ListItem.Subtitle>
              </ListItem.Content>
              <ListItem.Chevron/>
            </ListItem>
        )}
        renderSectionHeader={({section: {title, data}}) => (
          data.length > 0 && (<Text style={styles.headerSection}>{title}</Text>)
        )}
    />
  )
}