﻿using System.IdentityModel.Tokens.Jwt;

namespace JWTTokenLib
{
    public class JWTUtils
    {
        public static JwtSecurityToken ConvertStringToToken(string jwt)
        {
            var handler = new JwtSecurityTokenHandler();
            return handler.ReadJwtToken(jwt);
        }

        public static DecodedToken DecodeJwt(JwtSecurityToken token)
        {
            var keyId = token.Header.Kid;
            var audience = token.Audiences.ToList();
            var claims = token.Claims.Select(claim => (claim.Type, claim.Value)).ToList();

            return new DecodedToken(keyId, token.Issuer, audience, claims, token.ValidTo, token.SignatureAlgorithm,
                token.RawData, token.Subject, token.ValidFrom, token.EncodedHeader, token.EncodedPayload);
        }
    }
}
