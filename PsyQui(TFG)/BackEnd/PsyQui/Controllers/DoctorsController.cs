using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyQui.Context;
using PsyQui.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PsyQui.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorsController : ControllerBase
    {
        // GET: api/<DoctorsController>
        private readonly ApplicationDbContext _context;
        public DoctorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var listDoctores = await _context.Doctors.ToListAsync();
                return Ok(listDoctores);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("by-specialties")]
        public async Task<IActionResult> GetDoctorsBySpecialties([FromBody] string[] specialties)
        {
            try
            {
                var matchedDoctors = await _context.Doctors
                    .Where(d => specialties.Any(s => d.Especialidades.Contains(s)))
                    .ToListAsync();

                return Ok(matchedDoctors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("id/{idDoc}")]
        public async Task<IActionResult> GetById(int idDoc)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(idDoc);
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<DoctorsController>/5
        [HttpGet("email/{email}")]
        public async Task<IActionResult> GetByEmail(string email)
        {
            try
            {
                var doctor = await _context.Doctors.Where(p => p.Email == email).FirstOrDefaultAsync();
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("match-doctors")]
        public async Task<IActionResult> GetDoctorsByPatientDetails([FromBody] Patient patient)
        {
            try
            {
                var matchedDoctors = await _context.Doctors
                    .Where(d => d.Especialidades.Any(especialidad => patient.Detalles.Contains(especialidad)))
                    .ToListAsync();

                return Ok(matchedDoctors);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<DoctorsController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Doctor doctor)
        {
            try
            {
                _context.Add(doctor);
                await _context.SaveChangesAsync();
                return Ok(doctor);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<DoctorsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DoctorsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
