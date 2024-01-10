using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/[controller]/[action]")]
public class OrderController : ControllerBase
{
    public readonly DBContextUser context;
    public OrderController(DBContextUser context)
    {
        this.context = context;
    }
    [HttpGet]
    public ActionResult GetAllOrder()
    {
        var Orders = context.Order.ToList();
        return Ok(Orders);
    }
    [HttpGet]
    public ActionResult AcceptOrder([FromQuery] int id)
    {
        var Orders = context.Order.FirstOrDefault(o => o.ID_Order == id);
        if (Orders == null)
        {
            return NotFound("Order not null");
        }
        else
        {
            Orders.Status = 1;
            context.SaveChanges();
            return Ok();
        }
    }
    [HttpGet]
    [Authorize]
    public async Task<ActionResult> History()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != null)
        {
            var ordersByDay = await context.Order
                .Where(o => o.Id == userId)
                .Include(o => o.OrderDetails)
                .GroupBy(o => o.OrderDay.Date)
                .Select(group => new
                {
                    OrderDate = group.Key,
                    Orders = group.Select(o => new
                    {
                        OrderId = o.ID_Order,
                        OrderDate = o.OrderDay,
                        Status = o.Status,
                        OrderDetails = o.OrderDetails.Select(od => new
                        {
                            ID_orderDetail = od.ID_OrderDetail,
                            ProductName = od.Product.Name_Product,
                            ImageUrl = od.Product.Image,
                            countOrder = od.CountOrder,
                        })
                    })
                })
                .ToListAsync();

            JsonSerializerOptions options = new()
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                WriteIndented = true
            };


            var ordersForDays = ordersByDay.Select(day => new
            {
                OrderDate = day.OrderDate,
                Orders = day.Orders.ToList()
            }).ToList();

            return ordersForDays.Any()
                ? Ok(JsonSerializer.Serialize(ordersForDays, options))
                : NotFound("No orders found");
        }
        else
        {
            return Unauthorized();
        }



    }
}