import { SectionList , View, Text } from "react-native";
import React from "react";

export default function MemberList() {

    // We get first letter of name from member
    function getFirstLetterFrom(obj) {
      const name = obj.givenName + ' ' + obj.surname
      return name.slice(0, 1).toUpperCase();
    }

    const apiUrl = "http://localhost:5087/"
    const getMembersUrl = apiUrl + "api/Members"
    const [list, setList] = React.useState([])

    fetch(getMembersUrl)
    .then(res => res.json())
    .then(result => {
      result.sort((a, b) => {
        return (a.givenName + ' ' + a.surname).toLowerCase()
        .localeCompare((b.givenName + ' ' + b.surname).toLowerCase())
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

    return (
        <SectionList
            sections={list}
            renderItem={({item}) => (
                <View>
                  <Text>{item.givenName + ' ' + item.surname}</Text>
                </View>
              )}
              renderSectionHeader={({section: {title, data}}) => (
                data.length > 0 && (<Text>{title}</Text>)
              )}
        />
    )
}