import { StyleSheet } from 'react-native';
import { Input } from '@rneui/themed';
import { useController } from 'react-hook-form';


export default function InputComp({name, control, placeholder, defValue, isPassword = false, isReadOnly = false}) {
    const {field} = useController({
      control,
      defaultValue: defValue,
      name
    })
    return (
      <Input 
        value={field.value}
        onChangeText={field.onChange}
        placeholder={placeholder} 
        style={styles.input}
        secureTextEntry={isPassword}
        readOnly={isReadOnly}
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