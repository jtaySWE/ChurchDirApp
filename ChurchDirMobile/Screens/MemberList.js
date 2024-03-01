import { SectionList } from "react-native";


export default function MemberList() {

    // We get first letter of name from member
    function getFirstLetterFrom(obj) {
      const name = obj.givenName + ' ' + obj.surname
      return name.slice(0, 1).toUpperCase();
    }

    const fetchedData = []

    const list = fetchedData
      .reduce(function (list, dataObj, index) {
          let listItem = list.find((item) => item.title && item.title === getFirstLetterFrom(dataObj));
          if (!listItem) {
            list.push({"title": getFirstLetterFrom(dataObj), "data": [dataObj]})
          } else {
            listItem.data.push(dataObj)
          }

          return list;
      }, []);

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