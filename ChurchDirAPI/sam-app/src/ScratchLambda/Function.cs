using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Nodes;
using System.Text.Json;
using System.Threading.Tasks;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using ScratchLambda.Models;

using Amazon.Lambda.Core;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace ScratchLambda;

public class Function
{

    /// <summary>
    /// Gets all members
    /// </summary>
    /// <param name="input"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        Console.WriteLine("Testing lambda");
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);
        string userID = null;
        var members = await dbContext.ScanAsync<Member>(default).GetRemainingAsync();
        return new APIGatewayHttpApiV2ProxyResponse
        {
            Body = JsonSerializer.Serialize(members),
            StatusCode = 200
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
        {
            // Get all members
            var members = await dbContext.ScanAsync<Member>(default).GetRemainingAsync();
            return new APIGatewayHttpApiV2ProxyResponse
            {
                //Headers = respHeader,
                Body = JsonSerializer.Serialize(members),
                StatusCode = 200
            };

        }
        else if (request.RouteKey.Contains("GET /Member") && userID != null)
        {
            Console.WriteLine($"Getting member of ID {userID}");
            var member = await dbContext.LoadAsync<Member>(userID, userID);

            // Make sure this member is already in the database
            if (member == null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    //Headers = respHeader,
                    Body = $"The member with user ID {userID} does not exists.",
                    StatusCode = 400
                };
            }

            return new APIGatewayHttpApiV2ProxyResponse
            {
                //Headers = respHeader,
                Body = JsonSerializer.Serialize(member),
                StatusCode = 200
            };
        }
        else if (request.RouteKey.Contains("POST /Member") && request.Body != null)
        {
            var newMember = JsonSerializer.Deserialize<Member>(request.Body);
            var member = await dbContext.LoadAsync<Member>(newMember.PK, newMember.SK);

            // Make sure this member is not already in the database, so that we can add new member
            if (member != null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = $"The member with user ID {newMember.PK} already exists.",
                    StatusCode = 400
                };
            }
            await dbContext.SaveAsync(newMember);

            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = JsonSerializer.Serialize(newMember),
                StatusCode = 201
            };
        }
        else if (request.RouteKey.Contains("DELETE /Member") && userID != null)
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
                //Headers = respHeader,
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
                //Headers = respHeader,
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
}