using Amazon.DynamoDBv2.DataModel;
using Microsoft.AspNetCore.Http;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(string id)
        {
            var member = await _dbContext.LoadAsync<Member>(id);
            if (member == null)
            {
                return NotFound();
            }
            return Ok(member);
        }

        [HttpPost]
        public async Task<IActionResult> AddMember(Member newMember)
        {
            var member = await _dbContext.LoadAsync<Member>(newMember.pk, newMember.sk);

            // Make sure this member is not already in the database
            if (member != null)
            {
                return BadRequest($"The member {newMember.GivenName} and {newMember.Surname} already exists.");
            }
            await _dbContext.SaveAsync(member);
            return Ok(member);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveMember(string id)
        {
            var member = await _dbContext.LoadAsync<Member>(id);

            // Make sure member is in the database
            if (member == null)
            {
                return NotFound();
            }

            await _dbContext.DeleteAsync(member);
            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateMember(Member currMember)
        {
            var member = await _dbContext.LoadAsync<Member>(currMember.pk, currMember.sk);

            // Make sure member is in the database
            if (member == null)
            {
                return NotFound();
            }

            await _dbContext.SaveAsync(member);
            return Ok(currMember);
        }
    }
}
