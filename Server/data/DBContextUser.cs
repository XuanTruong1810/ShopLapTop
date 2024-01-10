using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class DBContextUser : IdentityDbContext<ApplicationUser>
{
    public DbSet<Brand> Brand { get; set; }
    public DbSet<Order> Order { get; set; }
    public DbSet<OrderDetail> OrderDetail { get; set; }
    public DbSet<Product> Product { get; set; }
    public DBContextUser(DbContextOptions<DBContextUser> options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<ApplicationUser>().ToTable("User");
        builder.Entity<IdentityRole>().ToTable("Role");
        builder.Entity<IdentityUserRole<string>>().ToTable("UserRole");
        builder.Entity<IdentityUserClaim<string>>().ToTable("UserClaim");
        builder.Entity<IdentityUserLogin<string>>().ToTable("UserLogin");
        builder.Entity<IdentityUserToken<string>>().ToTable("UserToken");
        builder.Entity<IdentityRoleClaim<string>>().ToTable("RoleClaim");

        builder.Entity<Brand>();
        builder.Entity<Order>();
        builder.Entity<OrderDetail>();
        builder.Entity<Product>();


        builder.Entity<Product>()
            .HasOne(p => p.Brand)
            .WithMany(p => p.Products)
            .HasForeignKey(p => p.ID_Brand);

        builder.Entity<Order>()
            .HasOne(p => p.ApplicationUser)
            .WithMany(p => p.Orders)
            .HasForeignKey(p => p.Id);
        builder.Entity<OrderDetail>()
            .HasOne(p => p.Product)
            .WithMany(p => p.OrderDetails)
            .HasForeignKey(p => p.ID_Product);
        builder.Entity<OrderDetail>()
                    .HasOne(p => p.Order)
                    .WithMany(p => p.OrderDetails)
                    .HasForeignKey(p => p.ID_Order);

        //// Trigger
        builder.Entity<OrderDetail>(entry =>
                {
                    entry.ToTable("OrderDetail", tb => tb.HasTrigger("CalculateTotalTrigger"));

                });
        builder.Entity<OrderDetail>(entry =>
               {
                   entry.ToTable("OrderDetail", tb => tb.HasTrigger("UpdateOrderTotal"));
               });
        builder.Entity<OrderDetail>(entry =>
               {
                   entry.ToTable("OrderDetail", tb => tb.HasTrigger("UpdateProductQuantity"));
               });


        builder.Entity<Order>()
                    .Property(o => o.OrderDay)
                    .HasDefaultValueSql("GETDATE()");

        builder.Entity<Product>()
            .Property(p => p.Is_delete)
            .HasDefaultValue(0);




    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }
}