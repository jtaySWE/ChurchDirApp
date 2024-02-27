import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';

export default function Member() {
  const {control, handleSubmit} = useForm()
  const onSubmit = (data) => {

  }

  return (
    <View style={styles.container}>
        <ScrollView>
        <Input name="givenName" control={control} placeholder="Given name"/>
        <Input name="surname" control={control} placeholder="Surname"/>
        <Input name="email" control={control} placeholder="Email"/>
        <Input name="phone" control={control} placeholder="Phone"/>
        <Input name="address" control={control} placeholder="Address"/>
        <Button 
        title="Submit"
        onPress={handleSubmit(onSubmit)}
        />
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch'
  }
});
