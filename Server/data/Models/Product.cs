using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Product
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Required]
    public int ID_Product { get; set; }
    [StringLength(256)]
    public required string Name_Product { get; set; }
    public required int Count_Product { get; set; }
    public required decimal Prince { get; set; }
    [Column(TypeName = "ntext")]
    public string? Description { get; set; }

    [Column(TypeName = "text")]
    public string? Image { get; set; }
    public int ID_Brand { get; set; }
    public Brand Brand { get; set; }
    public bool Is_delete { get; set; }

    public List<OrderDetail> OrderDetails { get; set; }
}