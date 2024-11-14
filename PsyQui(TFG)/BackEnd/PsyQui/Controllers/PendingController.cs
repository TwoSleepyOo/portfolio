using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyQui.Context;
using PsyQui.Models;

namespace PsyQui.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PendingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public PendingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<PendientesController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var listPendientes = await _context.Pendientes.ToListAsync();
                return Ok(listPendientes);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<PendientesController>/doc/{idDoc}
        [HttpGet("idDoc/{idDoc}")]
        public async Task<IActionResult> GetDoc(int idDoc)
        {
            try
            {
                var pendientesDoc = await _context.Pendientes.Where(x => x.IdDoc == idDoc).ToListAsync();
                return Ok(pendientesDoc);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<PendientesController>/patient/{idPatient}
        [HttpGet("idPatient/{idPatient}")]
        public async Task<IActionResult> GetPatient(int idPatient)
        {
            try
            {
                var pendientesPatient = await _context.Pendientes.Where(x => x.IdPatient == idPatient).ToListAsync();
                return Ok(pendientesPatient);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<PendientesController>/id/{id}
        [HttpGet("id/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var pendiente = await _context.Pendientes.FindAsync(id);
                return Ok(pendiente);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<PendientesController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Pendientes pendiente)
        {
            try
            {
                _context.Add(pendiente);
                await _context.SaveChangesAsync();
                return Ok(pendiente);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<PendientesController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] EstadoDto estadoDto)
        {
            try
            {
                var pending = await _context.Pendientes.Where(p => p.Id == id).FirstOrDefaultAsync();

                if (pending == null)
                {
                    return NotFound($"No se encontró un pendiente con el id {id}");
                }

                if (estadoDto.Estado == "Aceptado" || estadoDto.Estado == "Rechazado")
                {
                    pending.Estado = estadoDto.Estado;
                    _context.Update(pending);
                    await _context.SaveChangesAsync();
                    return Ok(pending);
                }
                else
                {
                    return BadRequest("Estado inválido. Debe ser 'Aceptado' o 'Rechazado'.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Se produjo un error interno: {ex.Message}");
            }
        }

        // DTO para recibir el estado
        public class EstadoDto
        {
            public string Estado { get; set; }
        }


        // DELETE api/<PendientesController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var pending = await _context.Pendientes.FindAsync(id);
                if (pending == null)
                {
                    return NotFound();
                }

                _context.Pendientes.Remove(pending);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
