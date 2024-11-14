using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyQui.Context;
using PsyQui.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PsyQui.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var listUsuarios = await _context.Users.ToListAsync();
                return Ok(listUsuarios);
            }catch (Exception ex)                                                                                                                         
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{id},{password}")]
        public async Task<IActionResult> Get(int id, string password)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return NotFound();
                }
                if (Encriptador.GetSHA256(password) == user.Password)
                {
                    var codGuid = await _context.GUIDCods.Where(p => p.IdUser == id).FirstOrDefaultAsync();
                    return Ok(new { GUID = codGuid?.GUIDcod });
                }
                return Ok(new { GUID = (string)null });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }


        [HttpGet("CheckSession/{guid}")]
        public async Task<IActionResult> CheckSession(string guid)
        {
            try
            {
                var userGUID = await _context.GUIDCods.FirstOrDefaultAsync(p => p.GUIDcod == guid);
                if (userGUID == null)
                {
                    return NotFound(new { Error = "Session not found" });
                }

                var user = await _context.Users.FindAsync(userGUID.IdUser);
                if (user == null)
                {
                    return NotFound(new { Error = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            try
            {
                user.Password = Encriptador.GetSHA256(user.Password);
                string guid = Guid.NewGuid().ToString();
                _context.Add(user);
                await _context.SaveChangesAsync();
                CodigosGUID codGuid = new CodigosGUID() { GUIDcod = guid , IdUser = user.Id };
                _context.Add(codGuid);
                await _context.SaveChangesAsync();
                return Ok(user);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] User user)
        {
            try
            {
                if(id != user.Id)
                {
                    return NotFound();
                }
                _context.Update(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Usuario añadido con éxito."});
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if(user == null)
                {
                    return NotFound();
                }
                _context.Remove(user);
                await _context.SaveChangesAsync();
                return Ok(new { message = "El usuario fue eliminado con éxito." });
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
