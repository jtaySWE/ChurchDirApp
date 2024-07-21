import { StyleSheet, View } from 'react-native';
import { Input, Text } from '@rneui/themed';
import { useController } from 'react-hook-form';


export default function InputComp({name, control, placeholder, defValue, isPassword = false, isReadOnly = false}) {
    const {field} = useController({
      control,
      defaultValue: defValue,
      name
    })
    return (
      <View style={styles.input}>
      <Text style={styles.label}>{placeholder}</Text>
      <Input 
        value={field.value}
        onChangeText={field.onChange}
        placeholder={placeholder} 
        secureTextEntry={isPassword}
        readOnly={isReadOnly}
        />
        </View>
      )
  }

  const styles = StyleSheet.create({
    label: {
      marginLeft: 8
    },
    input: {
      marginBottom: 8
    }
  });