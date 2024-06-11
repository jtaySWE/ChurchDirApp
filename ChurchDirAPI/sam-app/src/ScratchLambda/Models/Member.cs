using Amazon.DynamoDBv2.DataModel;

namespace ScratchLambda.Models;

[DynamoDBTable("ChurchMemberProd")]
public class Member
{
    [DynamoDBHashKey("pk")]
    public string? PK { get; set; }

    [DynamoDBRangeKey("sk")]
    public string? SK { get; set; }

    [DynamoDBProperty("userID")]
    public string? UserID { get; set; }

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
}
