using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyQui.Context;
using PsyQui.Models;

namespace PsyQui.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<PatientsController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var listPacientes = await _context.Patients.ToListAsync();
                return Ok(listPacientes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<PatientsController>/id/{idPatient}
        [HttpGet("id/{idPatient}")]
        public async Task<IActionResult> GetById(int idPatient)
        {
            try
            {
                var paciente = await _context.Patients.FindAsync(idPatient);
                return Ok(paciente);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<PatientsController>/email/{email}
        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            try
            {
                var patient = await _context.Patients.Where(p => p.Email == email).FirstOrDefaultAsync();
                return Ok(patient);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<PatientsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Patient paciente)
        {
            try
            {
                _context.Add(paciente);
                await _context.SaveChangesAsync();
                return Ok(paciente);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<PatientsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<PatientsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
