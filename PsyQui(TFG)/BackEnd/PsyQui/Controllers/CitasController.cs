using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyQui.Context;
using PsyQui.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PsyQui.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CitasController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<CitasController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet("noDisponibles/{idDoc}")]
        public async Task<IActionResult> GetNoDisponibles(int idDoc)
        {
            try
            {
                var noDisponiblesDoc = await _context.NoDisponibles.Where(nd => nd.IdDoc == idDoc).ToListAsync();
                return Ok(noDisponiblesDoc);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<CitasController>/5
        [HttpGet("citasDoc/{idDoc}")]
        public async Task<IActionResult> GetCitasDoc(int idDoc)
        {
            try
            {
                var citasDoc = await _context.Citas.Where(c => c.IdDoc == idDoc).ToListAsync();
                return Ok(citasDoc);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("citasPatient/{idPatient}")]
        public async Task<IActionResult> GetCitasPatient(int idPatient)
        {
            try
            {
                var citasPatient = await _context.Citas.Where(c => c.IdPatient == idPatient).ToListAsync();
                return Ok(citasPatient);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("citasFecha/{fecha}")]
        public async Task<IActionResult> GetCitasDia(string fecha)
        {
            try
            {
                var citasDia = await _context.Citas.Where(c => c.Fecha == fecha).ToListAsync();
                return Ok(citasDia);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("noDisponibles/")]
        public async Task<IActionResult> PostND([FromBody] NoDisponibles noDisponible)
        {
            try
            {
                _context.Add(noDisponible);
                await _context.SaveChangesAsync();
                return Ok(noDisponible);
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<CitasController>
        [HttpPost("Appointment/")]
        public async Task<IActionResult> PostApp([FromBody] Cita appointment)
        {
            try
            {
                _context.Add(appointment);
                await _context.SaveChangesAsync();
                return Ok(appointment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<CitasController>/5
        [HttpPut("cambiarEstado/{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] EstadoD estadoDto)
        {
            try
            {
                Cita cita = await _context.Citas.FindAsync(id);
                if (cita != null)
                {
                    cita.Estado = estadoDto.Estado;
                    await _context.SaveChangesAsync();
                }
                return Ok(cita);
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        public class EstadoD
        {
            public string Estado { get; set; }
        }

        // DELETE api/<CitasController>/5
        [HttpDelete("delCita/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var cita = await _context.Citas.FindAsync(id);
                if (cita == null)
                {
                    return NotFound();
                }

                _context.Citas.Remove(cita);
                await _context.SaveChangesAsync();
                return Ok();
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delForFecha/{fecha}")]
        public async Task<IActionResult> Delete(string fecha)
        {
            try
            {
                var citas = await _context.Citas.Where(c=> c.Fecha == fecha).ToListAsync();
                foreach (var cita in citas)
                {
                    _context.Citas.Remove(cita);
                    await _context.SaveChangesAsync();
                }
                return Ok();
            }catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
