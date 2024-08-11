import { ScrollView, StyleSheet, View } from 'react-native';
import { Icon, useTheme } from '@rneui/themed';
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
        iconStyle: {
            backgroundColor: theme.colors.primary,
            borderRadius: 32,
            height: 64,
            width: 64,
            justifyContent: 'center'
        },
        viewContainer: {
            flex: 2,
            justifyContent: 'space-evenly',
            flexDirection: 'row'
        }
    });

    return(
        <View>
            <View style={styles.viewContainer}>
                <input type='file' 
                ref={filePicker}
                onChange={handleFileUpload}
                style={{display: 'none'}}/>
                <Icon onPress={() => filePicker.current.click()} 
                type='simple-line-icon' 
                name='doc' 
                style={styles.iconStyle}
                color={theme.colors.white}/>
                <Icon onPress={handleMembersUpload} 
                type='simple-line-icon' 
                name='cloud-upload' 
                style={styles.iconStyle}
                color={theme.colors.white}/>
            </View>
        </View>
    )
}