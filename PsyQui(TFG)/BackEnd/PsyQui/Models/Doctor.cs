using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("Doctores")]
    public class Doctor
    {
        [Key]
        [Required]
        [Column("IdDoc")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdDoc { get; set; }
        [Required]
        [Column("Email")]
        public string Email { get; set; }
        [Required]
        [Column("Nombre")]
        public string Nombre { get; set; }
        [Required]
        [Column("Apellidos")]
        public string Apellidos { get; set; }
        [Required]
        [Column("Genero")]
        public string Genero { get; set; }
        [Required]
        [Column("Fecha_nac")]
        public string Fecha_nac { get; set; }
        [Required]
        [Column("Telefono")]
        public string Telefono { get; set; }
        [Required]
        [Column("Provincia")]
        public string Provincia { get; set; }
        [Column("Direccion")]
        public string Direccion { get; set; }
        [Required]
        [Column("Modalidad")]
        public string Modalidad { get; set; }
        [Required]
        [Column("Especialidades")]
        public string[] Especialidades { get; set; }
    }
}
