import { Button } from "react-native"
//import Member from "../Screens/Member"
import renderer from "react-test-renderer"
import fetchMock from "jest-fetch-mock"
import { render, screen } from "@testing-library/react-native"

fetchMock.enableMocks()

beforeEach(() => {
   fetchMock.resetMocks()
})

/*test('Renders button for saving user info', () => {
   render(<Member/>)
   expect(screen.getByRole('button')).toBeOnTheScreen()
})*/

test('Fetches all members', async () => {
   const allMembers = [{
      PK: "testuser",
      SK: "testuser",
      UserID: "testuser",
      GivenName: "alex",
      Surname: "tenz",
      Address: "45 wantirna",
      Phone: "0423333678",
      Email: "test@gmail.com"
   },{
      PK: "testuser2",
      SK: "testuser2",
      UserID: "testuser2",
      GivenName: "sam",
      Surname: "ben",
      Address: "45 geelong",
      Phone: "0423456789",
      Email: "test2@gmail.com"
   }]
   const apiUrl = "https://s1ce829s18.execute-api.ap-southeast-2.amazonaws.com/AllMembers"
   fetchMock.mockResponseOnce(JSON.stringify(allMembers))

   fetch(apiUrl)
   .then(res => res.json())
   .then(data => {
      expect(data).toEqual(allMembers)
   })
})