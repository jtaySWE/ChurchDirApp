using Amazon.DynamoDBv2.DataModel;
using System.Text.Json.Serialization;

namespace APIBackend.Models
{
    [DynamoDBTable("members")]
    public class Member
    {
        [DynamoDBHashKey("pk")]
        public string pk => Username;

        [DynamoDBRangeKey("sk")]
        public string sk => Surname;

        [DynamoDBProperty("username")]
        public string Username { get; set; }

        [DynamoDBProperty("password")]
        public string Password { get; set; }

        [DynamoDBProperty("givenName")]
        public string GivenName { get; set; }

        [DynamoDBProperty("surname")]
        public string Surname { get; set; }

        [DynamoDBProperty("email")]
        public string Email { get; set; }

        [DynamoDBProperty("phone")]
        public string Phone { get; set; }

        [DynamoDBProperty("address")]
        public string Address { get; set; }

        [DynamoDBProperty("isAdmin")]
        public bool IsAdmin { get; set; }
    }
}
