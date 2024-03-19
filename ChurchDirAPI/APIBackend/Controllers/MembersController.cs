using Amazon.DynamoDBv2.DataModel;
using Microsoft.AspNetCore.Mvc;
using APIBackend.Models;

namespace APIBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController : ControllerBase
    {
        private IDynamoDBContext _dbContext;
        public MembersController(IDynamoDBContext dBContext) { 
            _dbContext = dBContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMembers()
        {
            var members = await _dbContext.ScanAsync<Member>(default).GetRemainingAsync();
            return Ok(members);
        }

        [HttpGet("/GetMember/{username}")]
        public async Task<IActionResult> GetMember(string username)
        {
            var member = await _dbContext.LoadAsync<Member>(username);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }

        [HttpPost("/SignUp")]
        public async Task<IActionResult> SignUp(Member newMember)
        {
            var member = await _dbContext.LoadAsync<Member>(newMember.Username);

            // Make sure this member is not already in the database
            if (member != null)
            {
                return BadRequest($"The member with username {newMember.Username} already exists.");
            }
            await _dbContext.SaveAsync(newMember);
            return Ok(newMember);
        }

        [HttpPost("/SignIn")]
        public async Task<IActionResult> SignIn([FromForm] string username, [FromForm] string password)
        {
            var member = await _dbContext.LoadAsync<Member>(username);

            // Make sure this member is in the database
            if (member == null)
            {
                return BadRequest("Incorrect username.");
            }

            // Check if password matches
            if (member.Password != password)
            {
                return BadRequest("Incorrect password.");
            }
            return Ok(member);
        }

        [HttpDelete("/DeleteMember/{username}")]
        public async Task<IActionResult> RemoveMember(string username)
        {
            var member = await _dbContext.LoadAsync<Member>(username);

            // Make sure member is in the database
            if (member == null)
            {
                return NotFound();
            }

            await _dbContext.DeleteAsync(member);
            return NoContent();
        }

        [HttpPut("/ChangePwd")]
        public async Task<IActionResult> ChangePassword([FromForm] string username, [FromForm] string password)
        {
            var member = await _dbContext.LoadAsync<Member>(username);

            // Make sure member is in the database
            if (member == null)
            {
                return NotFound();
            }
            member.Password = password;

            await _dbContext.SaveAsync(member);
            return Ok("Password changed successfully!");
        }

        [HttpPut("/UpdateMember")]
        public async Task<IActionResult> UpdateMember(Member currMember)
        {
            var member = await _dbContext.LoadAsync<Member>(currMember.Username);

            // Make sure member is in the database
            if (member == null)
            {
                return NotFound();
            }

            await _dbContext.SaveAsync(currMember);
            return Ok(currMember);
        }
    }
}
