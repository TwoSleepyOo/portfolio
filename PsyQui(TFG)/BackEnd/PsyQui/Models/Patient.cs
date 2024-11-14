﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("Paciente")]
    public class Patient
    {
        [Key]
        [Required]
        [Column("IdPatient")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int IdPatient { get; set; }

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

        [Column("Domicilio")]
        public string Domicilio { get; set; }

        [Column("Detalles")]
        public string[] Detalles { get; set; }

        [Column("Comentario")]
        public string Comentario { get; set; }
    }
}