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
    /// A simple function that takes a string and does a ToUpper
    /// </summary>
    /// <param name="request">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> FunctionHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
    {
        AmazonDynamoDBClient client = new AmazonDynamoDBClient();
        DynamoDBContext dbContext = new DynamoDBContext(client);

        if (request.RouteKey.Contains("GET /AllMembers"))
        {
            var members = await dbContext.ScanAsync<Member>(default).GetRemainingAsync();
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = JsonSerializer.Serialize(members),
                StatusCode = 200
            };

        } else if (request.RouteKey.Contains("GET /Member") && request.PathParameters["username"] != null)
        {
            var member = await dbContext.LoadAsync<Member>(request.PathParameters["username"]);

            // Make sure this member is already in the database
            if (member == null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = $"The member with username {request.PathParameters["username"]} does not exists.",
                    StatusCode = 400
                };
            }

            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = JsonSerializer.Serialize(member),
                StatusCode = 200
            };
        } else if (request.RouteKey.Contains("POST /Member") && request.Body != null)
        {
            var newMember = JsonSerializer.Deserialize<Member>(request.Body);
            var member = await dbContext.LoadAsync<Member>(newMember.PK);

            // Make sure this member is not already in the database
            if (member != null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = $"The member with username {newMember.PK} already exists.",
                    StatusCode = 400
                };
            }
            await dbContext.SaveAsync(newMember);

            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = JsonSerializer.Serialize(newMember),
                StatusCode = 201
            };
        } else if (request.RouteKey.Contains("POST /SignIn") && request.Body != null)
        {
            JsonNode newMember = JsonNode.Parse(request.Body);
            var member = await dbContext.LoadAsync<Member>(newMember["username"].GetValue<string>());

            // Make sure this member is already in the database
            if (member == null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = "Incorrect username.",
                    StatusCode = 400
                };
            }

            // Check that password is correct
            if (member.Password != newMember["password"].GetValue<string>())
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = "Incorrect password.",
                    StatusCode = 400
                };
            }

            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = JsonSerializer.Serialize(member),
                StatusCode = 201
            };
        } else if (request.RouteKey.Contains("DELETE /Member") && request.PathParameters["username"] != null)
        {
            var member = await dbContext.LoadAsync<Member>(request.PathParameters["username"]);

            // Make sure this member is already in the database
            if (member == null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = $"The member with username {request.PathParameters["username"]} does not exists.",
                    StatusCode = 400
                };
            }

            await dbContext.DeleteAsync(member);
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = $"Member with username {member.Username} removed successfully",
                StatusCode = 200
            };
        }
        else if (request.RouteKey.Contains("PUT /ChangePwd") && request.Body != null)
        {
            JsonNode newMember = JsonNode.Parse(request.Body);
            var member = await dbContext.LoadAsync<Member>(newMember["username"].GetValue<string>());

            // Make sure this member is already in the database
            if (member == null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = $"Member with username {newMember["username"].GetValue<string>()} does not exist.",
                    StatusCode = 400
                };
            }

            // Check that password is correct
            member.Password = newMember["password"].GetValue<string>();

            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "Password changed successfully!",
                StatusCode = 201
            };
        }
        else if (request.RouteKey.Contains("PUT /Member") && request.Body != null)
        {
            var currMember = JsonSerializer.Deserialize<Member>(request.Body);
            var member = await dbContext.LoadAsync<Member>(currMember.PK);

            // Make sure this member is in the database
            if (member == null)
            {
                return new APIGatewayHttpApiV2ProxyResponse
                {
                    Body = $"The member with username {currMember.PK} does not exists.",
                    StatusCode = 400
                };
            }
            await dbContext.SaveAsync(currMember);

            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = JsonSerializer.Serialize(currMember),
                StatusCode = 201
            };
        }

        return new APIGatewayHttpApiV2ProxyResponse
        {
            Body = "Bad Request",
            StatusCode = 400
        };
    }
}
