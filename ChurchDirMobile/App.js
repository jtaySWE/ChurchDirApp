import { StatusBar } from 'expo-status-bar';
import { useController, useForm } from 'react-hook-form';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

const Input = ({name, control, placeholder}) => {
  const {field} = useController({
    control,
    defaultValue: '',
    name
  })
  return (
    <TextInput 
      value={field.value}
      onChangeText={field.onChange}
      placeholder={placeholder} 
      style={styles.input}
      />
    )
}

export default function App() {
  const {control, handleSubmit} = useForm()
  const onSubmit = (data) => {

  }

  return (
    <View style={styles.container}>
      <Text>Welcome!</Text>
      <Input name="givenName" control={control} placeholder="Given name"/>
      <Input name="surname" control={control} placeholder="Surname"/>
      <Input name="email" control={control} placeholder="Email"/>
      <Input name="phone" control={control} placeholder="Phone"/>
      <Input name="address" control={control} placeholder="Address"/>
      <StatusBar style="auto" />
      <Button 
      title="Submit"
      onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }
});
