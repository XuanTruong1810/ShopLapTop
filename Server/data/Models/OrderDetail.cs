using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class OrderDetail
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ID_OrderDetail { get; set; }

    public int CountOrder { get; set; }
    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public decimal? Total { get; set; }

    public int ID_Product { get; set; }
    public int ID_Order { get; set; }

    public Product Product { get; set; }
    public Order Order { get; set; }
}