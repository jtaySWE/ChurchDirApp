import { StyleSheet, TextInput } from 'react-native';
import { useController } from 'react-hook-form';


export default function Input({name, control, placeholder, defValue, isPassword = false}) {
    const {field} = useController({
      control,
      defaultValue: defValue,
      name
    })
    return (
      <TextInput 
        value={field.value}
        onChangeText={field.onChange}
        placeholder={placeholder} 
        style={styles.input}
        secureTextEntry={isPassword}
        />
      )
  }

  const styles = StyleSheet.create({
    input: {
      height: 48,
      margin: 8,
      borderWidth: 1,
      padding: 10,
      borderRadius: 8
    }
  });