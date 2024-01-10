using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Order
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_Order { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public decimal? Total { get; set; }
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime OrderDay { get; set; }
    public int Status { get; set; }
    public required string Address { get; set; }

    public required string PhoneNumber { get; set; }
    [StringLength(450)]
    public required string Id { get; set; }
    public ApplicationUser ApplicationUser { get; set; }
    public List<OrderDetail> OrderDetails { get; set; }

}