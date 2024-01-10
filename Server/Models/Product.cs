using System.ComponentModel.DataAnnotations.Schema;
public class ProductModel
{

    public required string Name_Product { get; set; }
    public required int CountProduct { get; set; }
    public required decimal Prince { get; set; }
    public string? Description { get; set; }
    public string? Image { get; set; }
    public bool Is_delete { get; set; }
    public required int ID_Brand { get; set; }
}