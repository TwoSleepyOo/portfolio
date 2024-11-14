using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PsyQui.Models
{
    [Table("GUIDs")]
    public class CodigosGUID
    {
        [Key]
        [Required]
        [Column("GUIDcod")]
        public string GUIDcod { get; set; }
        [Required]
        [Column("IdUser")]
        public int IdUser { get; set; }
    }
}
