import { SectionList , View, Text } from "react-native";
import React from "react";

export default function MemberList() {

    // We get first letter of name from member
    function getFirstLetterFrom(obj) {
      const name = obj.GivenName + ' ' + obj.Surname
      return name.slice(0, 1).toUpperCase();
    }

    const apiUrl = "https://3o3fpw8jb6.execute-api.ap-southeast-2.amazonaws.com/"
    const getMembersUrl = apiUrl + "AllMembers"
    const [list, setList] = React.useState([])

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

    return (
        <SectionList
            sections={list}
            renderItem={({item}) => (
                <View>
                  <Text>{item.GivenName + ' ' + item.Surname}</Text>
                </View>
              )}
              renderSectionHeader={({section: {title, data}}) => (
                data.length > 0 && (<Text>{title}</Text>)
              )}
        />
    )
}