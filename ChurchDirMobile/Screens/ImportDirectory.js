import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme, Button, Text } from '@rneui/themed';
import React, { useEffect, useRef } from 'react';
import { apiUrl } from "../config.js";
import { fetchAuthSession } from 'aws-amplify/auth';
import * as XLSX from 'xlsx';
import { pickSingle, types } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

export default function ImportDirectory() {

    const [fileData, setFileData] = React.useState(null)
    const [filename, setFilename] = React.useState("")
    const filePicker = useRef(null)

    useEffect(() => {
        if (fileData) {
            alert(fileData[0].email)
        }
    }, [fileData])

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFilename(file.name)
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

    const chooseFile = async () => {
        try {

            // Open file picker
            const result = await pickSingle({
              mode: 'open',
              type: types.xlsx
            })
            
            // Read file before reading the data from excel spreadsheet
            await RNFS.readFile(result.uri, 'base64').then(data => {
                setFilename(result.name)
                const workbook = XLSX.read(data, {type: 'base64'});
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet);
                setFileData(sheetData);
            }).catch(err => {
                alert(err)
            });
          } catch (err) {
            alert("Problem opening file: " + err)
          }
    }

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
            flex: 1,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap'
        }
    });

    return(
        <View style={styles.viewContainer}>
            {/*<input type='file' 
                ref={filePicker}
                onChange={handleFileUpload}
                style={{display: 'none'}}/>*/}
            <Button onPress={chooseFile}
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
            <Text style={{marginLeft: 8}}>{filename}</Text>
        </View>
    )
}