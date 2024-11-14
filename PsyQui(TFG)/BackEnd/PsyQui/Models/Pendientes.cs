using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("Pendientes")]
    public class Pendientes
    {
        [Key]
        [Column("Id")]
        [Required]
        public int Id { get; set; }
        [Column("IdDoc")]
        [Required]
        public int IdDoc { get; set; }
        [Column("IdPatient")]
        [Required]
        public int IdPatient { get; set; }
        [Column("Estado")]
        [Required]
        public string Estado { get; set; }
    }
}
