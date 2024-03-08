using Amazon.DynamoDBv2.DataModel;

namespace APIBackend.Models;

[DynamoDBTable("members")]
public class Member
{
    [DynamoDBHashKey("username")]
    public string? Username { get; set; }

    [DynamoDBProperty("password")]
    public string? Password { get; set; }

    [DynamoDBProperty("givenName")]
    public string? GivenName { get; set; }

    [DynamoDBProperty("surname")]
    public string? Surname { get; set; }

    [DynamoDBProperty("email")]
    public string? Email { get; set; }

    [DynamoDBProperty("phone")]
    public string? Phone { get; set; }

    [DynamoDBProperty("address")]
    public string? Address { get; set; }

    [DynamoDBProperty("isAdmin")]
    public bool IsAdmin { get; set; }
}
