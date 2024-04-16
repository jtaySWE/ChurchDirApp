import { SectionList, View, Text, StyleSheet, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

export default function MemberList() {

  const navigation = useNavigation()
  const onSelectMember = (username) => {
    navigation.navigate("Profile", {selectedUser: username})
  }

  // We get first letter of name from member
  function getFirstLetterFrom(obj) {
    const name = obj.GivenName + ' ' + obj.Surname
    return name.slice(0, 1).toUpperCase();
  }

  const apiUrl = "https://3o3fpw8jb6.execute-api.ap-southeast-2.amazonaws.com/"
  const getMembersUrl = apiUrl + "AllMembers"
  const [list, setList] = React.useState([])

  useEffect( () => {
    fetch(getMembersUrl)
    .then(res => res.json())
    .then(result => {
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
    }).catch(error => {
      alert(error)
    });
}, [])

  return (
    <SectionList style={styles.listContainer}
        sections={list}
        renderItem={({item}) => (
            <Pressable onPress={() => onSelectMember(item.Username)}
            style={({pressed}) => [{
              backgroundColor: pressed ? '#f0fbff' : 'white'
            }]}>
              <View style={styles.itemContainer}>
                  <Text>{item.GivenName + ' ' + item.Surname}</Text>
              </View>
            </Pressable>
          )}
          renderSectionHeader={({section: {title, data}}) => (
            data.length > 0 && (<Text style={styles.headerSection}>{title}</Text>)
          )}
    />
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    height: 44,
    padding: 8,
    fontSize: 16
  },
  headerSection: {
    backgroundColor: "lightgrey",
    color: "black",
    fontWeight: 'bold',
    fontSize: 12,
    height: 20
  },
  listContainer: {
    backgroundColor: "white"
  }
});