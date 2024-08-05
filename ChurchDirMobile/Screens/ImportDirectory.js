import { ScrollView, StyleSheet, View } from 'react-native';
import { Button } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { apiUrl } from "../config.js";
import { fetchAuthSession } from 'aws-amplify/auth';
import * as XLSX from 'xlsx';

export default function ImportDirectory() {

    const [fileData, setFileData] = React.useState(null)
    const filePicker = useRef(null)

    useEffect(() => {
        console.log(fileData)
    }, [fileData])

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.onload = (event) => {
          const workbook = XLSX.read(event.target.result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = XLSX.utils.sheet_to_json(sheet);
    
          setFileData(sheetData);
        };
    
        reader.readAsArrayBuffer(file);
    };

    const handleMembersUpload = () => {
        const uploadMembersUrl = apiUrl + "Member"
        if (fileData) {
            fetchAuthSession().
            then(resp => fetch(uploadMembersUrl, 
            {
                method: "POST",
                body: JSON.stringify(fileData),
                headers: new Headers([
                ["Authorization", resp.tokens.idToken]
            ])
            }))
            .then(resp => {
                if (resp.ok) {
                    alert("Members uploaded successfully!")
                }
            })
            .catch(error => {
                console.error(error)
            })
        }
    }

    return(
        <View style={styles.container}>
            <ScrollView>
                <input type='file' 
                ref={filePicker}
                onChange={handleFileUpload}
                style={{display: 'none'}}/>
                <Button title='Open file' onPress={() => filePicker.current.click()}/>
                <Button title='Upload members' onPress={handleMembersUpload}/>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'stretch'
    }
  });