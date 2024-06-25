using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using ChurchAWSLambda.Models;
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
        Console.WriteLine("Lambda function start");
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
        /*if (request.PathParameters != null)
        {
            if (request.PathParameters.ContainsKey("userID"))
            {
                userID = request.PathParameters["userID"];
            }
        }

        if (request.RouteKey.Contains("GET /AllMembers"))
        {*/
        // Get all members
        var members = await dbContext.ScanAsync<Member>(default).GetRemainingAsync();
        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
            Body = JsonSerializer.Serialize(members),
            StatusCode = 200
        };

        /*} else if (request.RouteKey.Contains("GET /Member") && userID != null)
        {
            Console.WriteLine($"Getting member of ID {userID}");
            var member = await dbContext.LoadAsync<Member>(userID, userID);

            // Make sure this member is already in the database
            if (member == null)
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
        } else if (request.RouteKey.Contains("DELETE /Member") && userID != null)
        {
            var member = await dbContext.LoadAsync<Member>(userID);

            // Make sure this member is already in the database
            if (member == null)
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
        else if (request.RouteKey.Contains("PUT /Member") && request.Body != null)
        {
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

        return new APIGatewayHttpApiV2ProxyResponse
        {
            Body = "Bad Request",
            StatusCode = 400
        };*/
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
