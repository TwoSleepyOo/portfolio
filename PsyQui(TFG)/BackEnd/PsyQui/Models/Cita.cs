using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("Citas")]
    public class Cita
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public int Id { get; set; }
        [Required]
        [Column("IdPatient")]
        public int IdPatient { get; set; }
        [Required]
        [Column("IdDoc")]
        public int IdDoc { get; set; }
        [Required]
        [Column("Fecha")]
        public string Fecha { get; set; }
        [Required]
        [Column("Hora")]
        public string Hora { get; set; }
        [Column("Estado")]
        public string Estado { get; set; }
    }
}
