using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JWTTokenLib
{
    public record DecodedToken(
        string KeyId,
        string Issuer,
        List<string> Audience,
        List<(string Type, string Value)> Claims,
        DateTime Expiration,
        string SigningAlgorithm,
        string RawData,
        string Subject,
        DateTime ValidFrom,
        string Header,
        string Payload
    );
}
