import { Button } from "react-native"
import Member from "../Screens/Member"
import renderer from "react-test-renderer"
import fetchMock from "jest-fetch-mock"

fetchMock.enableMocks()

beforeEach(() => {
   fetchMock.resetMocks()
})

test('Renders button for sign up', () => {
   const render = renderer.create(<Member isSignUp={false}/>).root
   expect(render.findByType(Button).props.title).toBe('Save')
})

test('Fetches all members', async () => {
   const allMembers = [{
      Username: "testuser",
      Password: "testpwd",
      GivenName: "alex",
      Surname: "tenz",
      Address: "45 wantirna",
      Phone: "0423333678",
      Email: "test@gmail.com"
   },{
      Username: "testuser2",
      Password: "testpwd2",
      GivenName: "sam",
      Surname: "ben",
      Address: "45 geelong",
      Phone: "0423456789",
      Email: "test2@gmail.com"
   }]
   const apiUrl = "https://3o3fpw8jb6.execute-api.ap-southeast-2.amazonaws.com/AllMembers"
   fetchMock.mockResponseOnce(JSON.stringify(allMembers))

   fetch(apiUrl)
   .then(res => res.json())
   .then(data => {
      expect(data).toEqual(allMembers)
   })
})