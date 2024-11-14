using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("NoDisponibles")]
    public class NoDisponibles
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public int Id { get; set; }
        [Required]
        [Column("IdDoc")]
        public int IdDoc { get; set; }
        [Required]
        [Column("Fecha")]
        public string Fecha { get; set; }
    }
}
