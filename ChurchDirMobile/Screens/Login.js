import { StatusBar } from 'expo-status-bar';
import { useForm } from 'react-hook-form';
import Input from '../Components/Input';
import { Button, ScrollView, StyleSheet, View } from 'react-native';

export default function Login({navigation}) {
  const {control, handleSubmit} = useForm()
  const onSubmit = (data) => {
    
  }

  return (
    <View style={styles.container}>
        <ScrollView>
        <Input name="username" control={control} placeholder="Username"/>
        <Input name="password" control={control} placeholder="Password"/>
        <Button 
        title="Login"
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
