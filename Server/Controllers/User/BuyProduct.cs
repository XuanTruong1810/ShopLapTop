using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[ApiController]
[Route("/api/[controller]")]
public class BuyProduct : ControllerBase
{
    public readonly DBContextUser context;

    public BuyProduct(DBContextUser context)
    {
        this.context = context;
    }
    [HttpPost]
    [Authorize]
    public ActionResult Post([FromBody] OrderModel orderModels)
    {

        if (ModelState.IsValid)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var newOrder = new Order
                {
                    Id = userId,
                    Address = orderModels.Address,
                    PhoneNumber = orderModels.PhoneNumber,
                };
                context.Order.Add(newOrder);
                context.SaveChanges();

                int idOrder = newOrder.ID_Order;
                orderModels.OrderDetailModels.ForEach(o =>
            {
                var orderDetail = new OrderDetail
                {
                    ID_Order = idOrder,
                    ID_Product = o.ID_Product,
                    CountOrder = o.CountOrder,
                };
                var result = context.OrderDetail.Add(orderDetail);
                context.SaveChanges();

            });
            }
            return Ok("Thành công");
        }
        else
        {
            return NotFound();
        }
    }
}