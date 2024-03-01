import { Button } from "react-native"
import Member from "../Screens/Member"
import renderer from "react-test-renderer"

test('Renders button for sign up', () => {
   const render = renderer.create(<Member isSignUp={false}/>).root
   expect(render.findByType(Button).props.title).toBe('Save')
})