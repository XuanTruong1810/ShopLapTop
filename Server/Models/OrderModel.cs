public class OrderModel
{
    public required string Address { get; set; }
    public required string PhoneNumber { get; set; }
    public required List<OrderDetailModel> OrderDetailModels { get; set; }

}