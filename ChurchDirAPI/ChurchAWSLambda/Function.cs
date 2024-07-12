using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.Core;
using ChurchAWSLambda.Models;
using JWTTokenLib;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
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
        JwtSecurityToken jwtToken;
        DecodedToken decodedToken;
        request.Headers.TryGetValue("Authorization", out token);
        context.Logger.LogLine(JsonSerializer.Serialize(request));

        // Validate token
        try
        {
            jwtToken = JWTUtils.ConvertStringToToken(token);
            decodedToken = JWTUtils.DecodeJwt(jwtToken);
        } catch (Exception ex)
        {
            context.Logger.LogLine("Seen as invalid token");
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Not a token!\"}",
                StatusCode = 400
            };
        }

        // Check if it's valid and not expired
        DateTime currTime = DateTime.Now;
        if (currTime < decodedToken.ValidFrom || currTime >= decodedToken.Expiration)
        {
            context.Logger.LogLine("Token can't be used");
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Token is not valid or already expired!\"}",
                StatusCode = 400
            };
        }

        // Check user's group in token payload to see if he's admin
        try
        {
            // Decode payload
            byte[] payloadData = Convert.FromBase64String(decodedToken.Payload);
            string decodedPayload = Encoding.UTF8.GetString(payloadData);
            context.Logger.LogLine("Parsing payload");
            
            using (JsonDocument doc = JsonDocument.Parse(decodedPayload))
            {
                context.Logger.LogLine("Retrieving user group");
                JsonElement root = doc.RootElement;
                JsonElement userGroups = root.GetProperty("cognito:groups");
                for (int i = 0; i < userGroups.GetArrayLength(); i++)
                {
                    if (userGroups[i].ValueEquals("admins"))
                    {
                        break;
                    }
                    else if (i == userGroups.GetArrayLength() - 1)
                    {
                        context.Logger.LogLine("User not admin according to token");
                        return new APIGatewayHttpApiV2ProxyResponse
                        {
                            Body = "{\"error\": \"User must be an admin!\"}",
                            StatusCode = 400
                        };
                    }
                }
            }
        } catch (Exception ex)
        {
            context.Logger.LogLine("Can't parse payload");
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Error in using token payload!\"}",
                StatusCode = 400
            };
        }

        // Get all members
        var members = await dbContext.ScanAsync<Member>(default).GetRemainingAsync();
        context.Logger.LogLine("Success in getting members");
        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
            Body = JsonSerializer.Serialize(members),
            StatusCode = 200
        };
    }

    /// <summary>
    /// Uploads new members
    /// </summary>
    /// <param name="request">The event for the Lambda function handler to process.</param>
    /// <param name="context">The ILambdaContext that provides methods for logging and describing the Lambda environment.</param>
    /// <returns></returns>
    public async Task<APIGatewayHttpApiV2ProxyResponse> UploadMembersHandler(APIGatewayHttpApiV2ProxyRequest request, ILambdaContext context)
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
        JwtSecurityToken jwtToken;
        DecodedToken decodedToken;
        request.Headers.TryGetValue("Authorization", out token);
        context.Logger.LogLine(JsonSerializer.Serialize(request));

        // Validate token
        try
        {
            jwtToken = JWTUtils.ConvertStringToToken(token);
            decodedToken = JWTUtils.DecodeJwt(jwtToken);
        }
        catch (Exception ex)
        {
            context.Logger.LogLine("Seen as invalid token");
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Not a token!\"}",
                StatusCode = 400
            };
        }

        // Check if it's valid and not expired
        DateTime currTime = DateTime.Now;
        if (currTime < decodedToken.ValidFrom || currTime >= decodedToken.Expiration)
        {
            context.Logger.LogLine("Token can't be used");
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Token is not valid or already expired!\"}",
                StatusCode = 400
            };
        }

        // Check user's group in token payload to see if he's admin
        try
        {
            // Decode payload
            byte[] payloadData = Convert.FromBase64String(decodedToken.Payload);
            string decodedPayload = Encoding.UTF8.GetString(payloadData);
            context.Logger.LogLine("Parsing payload");

            using (JsonDocument doc = JsonDocument.Parse(decodedPayload))
            {
                context.Logger.LogLine("Retrieving user group");
                JsonElement root = doc.RootElement;
                JsonElement userGroups = root.GetProperty("cognito:groups");
                for (int i = 0; i < userGroups.GetArrayLength(); i++)
                {
                    if (userGroups[i].ValueEquals("admins"))
                    {
                        break;
                    }
                    else if (i == userGroups.GetArrayLength() - 1)
                    {
                        context.Logger.LogLine("User not admin according to token");
                        return new APIGatewayHttpApiV2ProxyResponse
                        {
                            Body = "{\"error\": \"User must be an admin!\"}",
                            StatusCode = 400
                        };
                    }
                }
            }
        }
        catch (Exception ex)
        {
            context.Logger.LogLine("Can't parse payload");
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Error in using token payload!\"}",
                StatusCode = 400
            };
        }

        // Upload all members
        try
        {
            using (JsonDocument doc = JsonDocument.Parse(request.Body))
            {
                context.Logger.LogLine("Uploading members");
                JsonElement root = doc.RootElement;
                for (int i = 0; i < root.GetArrayLength(); i++)
                {
                    var query = new QueryRequest
                    {
                        TableName = "ChurchMemberProd",
                        IndexName = "email-index",
                        KeyConditionExpression = "email = :v_email",
                        ExpressionAttributeValues = new Dictionary<string, AttributeValue> {
                        {":v_email", new AttributeValue { S =  root[i].GetProperty("email").GetString() }}}
                    };

                    var response = await client.QueryAsync(query);
                    string id;

                    // Retrieve primary key to be able to upload the member info
                    if (response.Items.Count == 0)
                    {
                        id = root[i].GetProperty("email").GetString();
                    } else
                    {
                        AttributeValue primKey;
                        response.Items[0].TryGetValue("pk", out primKey);
                        id = primKey.S;
                    }
                    
                    Member member = new Member()
                    {
                        PK = id,
                        SK = id,
                        UserID = id,
                        Email = root[i].GetProperty("email").GetString(),
                        Phone = root[i].GetProperty("phone").GetString(),
                        GivenName = root[i].GetProperty("givenName").GetString(),
                        Surname = root[i].GetProperty("surname").GetString(),
                        Address = root[i].GetProperty("address").GetString()
                    };
                    await dbContext.SaveAsync(member);
                }
            }
        }
        catch (Exception ex)
        {
            context.Logger.LogLine(ex.Message);
            return new APIGatewayHttpApiV2ProxyResponse
            {
                Body = "{\"error\": \"Error in uploading members!\"}",
                StatusCode = 400
            };
        }
        
        context.Logger.LogLine("Success in uploading members");
        return new APIGatewayHttpApiV2ProxyResponse
        {
            Headers = respHeader,
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
        
        var query = new QueryRequest
        {
            TableName = "ChurchMemberProd",
            IndexName = "email-index",
            KeyConditionExpression = "email = :v_email",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue> {
        {":v_email", new AttributeValue { S =  email }}}
        };

        var response = await client.QueryAsync(query);

        // Remove members of given email to have a single instance of signed up member with the said email
        for ( int i = 0; i < response.Items.Count; i++)
        {
            AttributeValue pk, sk;
            if (response.Items[i].TryGetValue("pk", out pk) && response.Items[i].TryGetValue("sk", out sk))
            {
                var member = await dbContext.LoadAsync<Member>(pk.S, sk.S);
                await dbContext.DeleteAsync(member);
            }
        }

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
