import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import Input from './Components/Input';
import { Button, Keyboard, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

export default function App() {
  const {control, handleSubmit} = useForm()
  const onSubmit = (data) => {

  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeContainer}>
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
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'stretch'
  }
});
