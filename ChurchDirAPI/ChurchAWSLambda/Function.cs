using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using ChurchAWSLambda.Models;
using JWTTokenLib;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace ChurchAWSLambda;

public class Function
{

    /// <summary>
    /// Gets all members
    /// </summary>
    /// <param name="request">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);
        Dictionary<string, string> respHeader = new Dictionary<string, string>()
        {
            { "Access-Control-Allow-Origin", "http://localhost:8081"},
            {"Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Site, Platforms, Version" },
            {"Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE" }
        };

        string token;
        request.Headers.TryGetValue("Authorization", out token);

        // Validate token
        try
        {
            JwtSecurityToken jwtToken = JWTUtils.ConvertStringToToken(token);
            DecodedToken decodedToken = JWTUtils.DecodeJwt(jwtToken);

            // Check if it's valid and not expired
            DateTime currTime = DateTime.Now;
            if (currTime < decodedToken.ValidFrom || currTime >= decodedToken.Expiration)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = "Token is not valid or already expired!",
                    StatusCode = 400
                };
            }

            // Check user's group in token payload to see if he's admin
            using (JsonDocument doc = JsonDocument.Parse(decodedToken.Payload))
            {
                JsonElement root = doc.RootElement;
                JsonElement userGroups = root.GetProperty("cognito:groups");
                for (int i = 0; i < userGroups.GetArrayLength(); i++)
                {
                    if (userGroups[i].ValueEquals("admins"))
                    {
                        break;
                    } else if (i == userGroups.GetArrayLength() - 1)
                    {
                        return new APIGatewayHttpApiV2ProxyResponse
                        {
                            Body = "User must be an admin!",
                            StatusCode = 400
                        };
                    }
                }
            }

        } catch (Exception ex)
        {
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "Not a token!",
                StatusCode = 400
            };
        }

        // Get all members
        var members = await dbContext.ScanAsync<Member>(default).GetRemainingAsync();
        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
            Body = JsonSerializer.Serialize(members),
            StatusCode = 200
        };
    }

    /// <summary>
    /// Gets a member by user ID
    /// </summary>
    /// <param name="request">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> GetMemberHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);
        string userID = null;
        Dictionary<string, string> respHeader = new Dictionary<string, string>()
        {
            { "Access-Control-Allow-Origin", "http://localhost:8081"},
            {"Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Site, Platforms, Version" },
            {"Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE" }
        };

        // Get user ID if in path parameter
        if (request.PathParameters != null)
        {
            if (request.PathParameters.ContainsKey("userID"))
            {
                userID = request.PathParameters["userID"];
            }
        }
        var member = await dbContext.LoadAsync<Member>(userID, userID);

        // Make sure this member is already in the database
        if (member == null || userID == null)
        {
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Headers = respHeader,
                Body = $"The member with user ID {userID} does not exists.",
                StatusCode = 400
            };
        }

        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
            Body = JsonSerializer.Serialize(member),
            StatusCode = 200
        };
    }

    /// <summary>
    /// Deletes member by user ID
    /// </summary>
    /// <param name="request">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> DelMemberHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);
        string userID = null;
        Dictionary<string, string> respHeader = new Dictionary<string, string>()
        {
            { "Access-Control-Allow-Origin", "http://localhost:8081"},
            {"Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Site, Platforms, Version" },
            {"Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE" }
        };

        // Get user ID if in path parameter
        if (request.PathParameters != null)
        {
            if (request.PathParameters.ContainsKey("userID"))
            {
                userID = request.PathParameters["userID"];
            }
        }
        var member = await dbContext.LoadAsync<Member>(userID);

        // Make sure this member is already in the database
        if (member == null || userID == null)
        {
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = $"The member with user ID {userID} does not exists.",
                StatusCode = 400
            };
        }

        await dbContext.DeleteAsync(member);
        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
            Body = $"Member with user ID {member.UserID} removed successfully",
            StatusCode = 200
        };
    }

    /// <summary>
    /// Updates a member's details
    /// </summary>
    /// <param name="request">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> UpdateMemHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);
        Dictionary<string, string> respHeader = new Dictionary<string, string>()
        {
            { "Access-Control-Allow-Origin", "http://localhost:8081"},
            {"Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Site, Platforms, Version" },
            {"Access-Control-Allow-Methods", "OPTIONS,GET,POST,PUT,DELETE" }
        };
        
        var currMember = JsonSerializer.Deserialize<Member>(request.Body);
        var member = await dbContext.LoadAsync<Member>(currMember.PK, currMember.SK);

        // Make sure this member is in the database, to modify his/her data
        if (member == null)
        {
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = $"The member with user ID {currMember.PK} does not exists.",
                StatusCode = 400
            };
        }
        await dbContext.SaveAsync(currMember);

        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
            Body = JsonSerializer.Serialize(currMember),
            StatusCode = 200
        };
    }

    public async Task<JsonElement> SignUpHandler(JsonElement input, ILambdaContext context)
    {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);
        var request = input.GetProperty("request");
        var userAttributes = request.GetProperty("userAttributes");
        string email = userAttributes.GetProperty("email").GetString();
        string phone = userAttributes.GetProperty("phone_number").GetString();
        string givenName = userAttributes.GetProperty("given_name").GetString();
        string surname = userAttributes.GetProperty("family_name").GetString();
        string address = userAttributes.GetProperty("address").GetString();
        string userID = userAttributes.GetProperty("sub").GetString();

        var newMember = new Member()
        {
            PK = userID,
            SK = userID,
            UserID = userID,
            GivenName = givenName,
            Surname = surname,
            Email = email,
            Phone = phone,
            Address = address
        };
        await dbContext.SaveAsync(newMember);

        return input;
    }
}
