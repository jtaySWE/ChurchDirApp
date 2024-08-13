import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme, Button } from '@rneui/themed';
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

    const { theme } = useTheme();

    const styles = StyleSheet.create({
        viewContainer: {
            flex: 2,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row'
        }
    });

    return(
        <View style={styles.viewContainer}>
            <input type='file' 
                ref={filePicker}
                onChange={handleFileUpload}
                style={{display: 'none'}}/>
            <Button onPress={() => filePicker.current.click()}
                    icon={{
                        type: 'simple-line-icon', 
                        name: 'doc', 
                        color: theme.colors.white
                    }}
                    title="Select File">
            </Button>
            <Button onPress={handleMembersUpload}
                    icon={{
                        type: 'simple-line-icon', 
                        name: 'cloud-upload',
                        color: theme.colors.white
                    }}
                    disabled={!fileData}
                    title="Upload">
            </Button>
        </View>
    )
}