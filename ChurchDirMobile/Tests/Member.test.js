import Member from "../Screens/Member"
import { render } from '@testing-library/react-native';

test('Renders button for sign up', () => {
   const {getByText} = render(<Member isSignUp={false}/>)
   expect(getByText("Save")).toBeInDocument()
})