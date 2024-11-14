
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PsyQui.Models;

namespace PsyQui.Context
{
    public class ApplicationDbContext : DbContext {
        public DbSet<User> Users { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Relaciones> Relaciones { get; set; }
        public DbSet<CodigosGUID> GUIDCods { get; set; }
        public DbSet<Pendientes> Pendientes { get; set; }
        public DbSet<Cita> Citas { get; set; }
        public DbSet<NoDisponibles> NoDisponibles { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }
    }
}
