using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("Relaciones")]
    public class Relaciones
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        [Column("Id")]
        public int Id { get; set; }
        [Required]
        [Column("IdDoc")]
        public int IdDoc { get; set; }
        [Required]
        [Column("IdPatient")]
        public int IdPatient {  get; set; }
        [Column("Notas")]
        public string Notas { get; set; }
    }
}
