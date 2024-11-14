using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsyQui.Context;
using PsyQui.Models;
using static PsyQui.Controllers.PendingController;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PsyQui.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public RelationsController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<RelacionesController>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var listRelaciones = await _context.Relaciones.ToListAsync();
                return Ok(listRelaciones);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{IdDoc}")]
        public async Task<IActionResult> GetPatients(int idDoc)
        {
            try
            {
                var relaciones = await _context.Relaciones.Where(p => p.IdDoc == idDoc).ToListAsync();
                return Ok(relaciones);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<RelacionesController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var relacion = await _context.Relaciones.FindAsync(id);
                return Ok(relacion);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("idDoc/{idDoc}")]
        public async Task<IActionResult> GetRelationsDoc(int idDoc)
        {
            try
            {
                var relacion = await _context.Relaciones.Where(r => r.IdDoc == idDoc).ToListAsync();
                return Ok(relacion);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("id/{idPatient}")]
        public async Task<IActionResult> GetRelationPatient(int idPatient)
        {
            try
            {
                var relacion = await _context.Relaciones.Where(r => r.IdPatient == idPatient).FirstOrDefaultAsync();
                return Ok(relacion);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST api/<RelacionesController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Relaciones relacion)
        {
            try
            {
                _context.Add(relacion);
                await _context.SaveChangesAsync();
                return Ok(relacion);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/<RelacionesController>/5
        public class NotasDto
        {
            public string Notas { get; set; }
        }

        [HttpPut("{idPatient}")]
        public async Task<IActionResult> Put(int idPatient, [FromBody] NotasDto notasDto)
        {
            try
            {
                var relation = await _context.Relaciones.Where(r => r.IdPatient == idPatient).FirstOrDefaultAsync();

                if (relation == null)
                {
                    return NotFound($"No se encontró una relación con el id de paciente {idPatient}");
                }
                else
                {
                    relation.Notas = notasDto.Notas;
                    _context.Relaciones.Update(relation);
                    await _context.SaveChangesAsync();
                    return Ok(relation);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Se produjo un error interno: {ex.Message}");
            }
        }


        // DELETE api/<RelacionesController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
