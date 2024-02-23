using Amazon.DynamoDBv2.DataModel;
using System.Text.Json.Serialization;

namespace APIBackend.Models
{
    [DynamoDBTable("members")]
    public class Member
    {
        [DynamoDBHashKey("pk")]
        public string pk => Id;

        [DynamoDBRangeKey("sk")]
        public string sk => Surname;

        [DynamoDBProperty("id")]
        public string Id { get; set; }

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
    }
}
