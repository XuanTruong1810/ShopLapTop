using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("/api/[controller]/[action]")]
public class ManagerController : ControllerBase
{
    private readonly DBContextUser context;
    private readonly UserManager<ApplicationUser> userManager;
    private readonly SignInManager<ApplicationUser> signInManager;
    private readonly RoleManager<IdentityRole> roleManager;

    public ManagerController(DBContextUser context, UserManager<ApplicationUser> userManager,
     SignInManager<ApplicationUser> signInManager, RoleManager<IdentityRole> roleManager)
    {
        this.context = context;
        this.userManager = userManager;
        this.signInManager = signInManager;
        this.roleManager = roleManager;
    }
    [HttpGet]

    public ActionResult GetAllUser()
    {
        var Users = context.Users.ToList();
        return Ok(Users);
    }
    [HttpDelete]

    public async Task<ActionResult> DeleteUser([FromBody] List<string> listId)
    {
        Console.WriteLine(listId);
        foreach (var userId in listId)
        {
            var user = await userManager.FindByIdAsync(userId);

            if (user != null)
            {
                var result = await userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return NotFound("Xóa k thành công");
                }
            }
            else
            {
                return NotFound("Khong tim thay");
            }
        }
        return NotFound("lôi");

    }

    [HttpGet]

    public ActionResult GetAllProduct()
    {
        var productsWithBrand = context.Product
         .Where(p => p.Is_delete == false)
         .Join(context.Brand,
             product => product.ID_Brand,
             brand => brand.ID_Brand,
             (product, brand) => new
             {
                 product.ID_Product,
                 product.Name_Product,
                 product.Count_Product,
                 product.Prince,
                 product.Description,
                 product.Image,
                 brand.Name_Brand
             })
         .ToList();

        return Ok(productsWithBrand);
    }
    [HttpPost]

    public ActionResult AddProduct([FromBody] ProductModel newProduct)
    {
        var addProduct = new Product
        {
            Name_Product = newProduct.Name_Product,
            Count_Product = newProduct.CountProduct,
            Prince = newProduct.Prince,
            ID_Brand = newProduct.ID_Brand,
            Image = newProduct.Image,
            Description = newProduct.Description,
        };
        context.Product.Add(addProduct);
        context.SaveChanges();
        return Ok("Add Success");
    }
    [HttpPut]

    public ActionResult UpdateProduct([FromQuery] int id, [FromBody] ProductModel updateProduct)
    {
        var product = context.Product.Where(p => p.ID_Product == id).FirstOrDefault();
        if (product == null)
        {
            return NotFound();
        }
        product.Name_Product = updateProduct.Name_Product;
        product.Count_Product = updateProduct.CountProduct;
        product.Prince = updateProduct.Prince;
        product.Description = updateProduct.Description;
        product.Image = updateProduct.Image;
        context.SaveChanges();
        return Ok("Thành công");
    }
    [HttpDelete]

    public ActionResult DeleteProduct([FromQuery] int id)
    {
        var deleteProduct = context.Product.Where(p => p.ID_Product == id)
            .FirstOrDefault();
        if (deleteProduct != null)
        {
            deleteProduct.Is_delete = true;
            context.SaveChanges();
            return Ok("Xóa thành công");
        }
        else
        {
            return NotFound("Xóa không thành công");
        }
    }
    [HttpPut]

    public ActionResult AcceptOrder([FromQuery] int id)
    {
        var orderAccept = context.Order.Where(order => order.ID_Order == id).FirstOrDefault();
        if (orderAccept != null)
        {
            orderAccept.Status = 1;
            context.SaveChanges();
        }
        return Ok("Thành công");
    }
    [HttpGet]

    public ActionResult GetAllProductOrder([FromQuery] int id)
    {
        var orderDetails = context.OrderDetail.Where(order => order.ID_Order == id)
            .Select(orderDetail => new
            {
                NameProduct = orderDetail.Product.Name_Product,
                ImageUrl = orderDetail.Product.Image,
                QuantityOrdered = orderDetail.CountOrder,
                UnitPrice = orderDetail.Product.Prince
            }).ToList();
        if (orderDetails != null && orderDetails.Count > 0)
        {
            return Ok(orderDetails);
        }
        return NotFound();
    }
    [HttpDelete]

    public ActionResult DeleteOrder([FromQuery] int id)
    {
        var orderAccept = context.Order.Where(order => order.ID_Order == id).FirstOrDefault();
        if (orderAccept != null)
        {
            context.Remove(orderAccept);
            context.SaveChanges();
        }
        return Ok();
    }
    [HttpPost]

    public ActionResult AddBrand([FromQuery] string name)
    {

        var brands = context.Brand.Where(b => b.Name_Brand == name).FirstOrDefault();

        if (brands != null)
        {
            return BadRequest("Đã tồn tại");
        }
        else
        {
            Brand newBrand = new Brand()
            {
                Name_Brand = name,
            };
            context.Brand.Add(newBrand);
            context.SaveChanges();

            return Ok("Thêm thành công");
        }
    }
    [HttpGet]
    public async Task<ActionResult> Report()
    {
        var usersWithUserRole = await userManager.GetUsersInRoleAsync("User");
        var accountCount = usersWithUserRole.Count;
        var products = await context.Product.Where(p => p.Is_delete == false).SumAsync(p => p.Count_Product);
        var soldProductCount = await context.OrderDetail.SumAsync(p => p.CountOrder);
        var totalRevenue = await context.Order.SumAsync(o => o.Total);
        var stats = new
        {
            UserCount = accountCount,
            ProductCount = products,
            SoldProductCount = soldProductCount,
            TotalRevenue = totalRevenue
        };
        return Ok(stats);
    }
    [HttpGet]
    public async Task<IActionResult> GetLoginStats()
    {
        var facebookLoginsCount = await context.UserLogins.CountAsync(l => l.LoginProvider == "Facebook");
        var googleLoginsCount = await context.UserLogins.CountAsync(l => l.LoginProvider == "Google");

        var usersWithUserRole = userManager.GetUsersInRoleAsync("User").Result;
        var regularUsersCount = usersWithUserRole.Count(user =>
            !userManager.GetLoginsAsync(user).Result.Any(login =>
                login.LoginProvider == "Facebook" || login.LoginProvider == "Google")
        );
        var stats = new
        {
            FacebookLoginsCount = facebookLoginsCount,
            GoogleLoginsCount = googleLoginsCount,
            RegularUsersCount = regularUsersCount
        };

        return Ok(stats);
    }
    [HttpGet]
    public IActionResult GetOrderStatistics(
       int startYear, int startMonth, int startDay,
       int endYear, int endMonth, int endDay)
    {
        try
        {
            DateTime startDate = new DateTime(startYear, startMonth, startDay);
            DateTime endDate = new DateTime(endYear, endMonth, endDay);


            var salesData = context.Order
            .Where(s => s.OrderDay >= startDate && s.OrderDay <= endDate)
            .ToList();

            var monthlySales = salesData
                .GroupBy(s => new { s.OrderDay.Year, s.OrderDay.Month })
                .Select(g => new
                {
                    MonthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                    TotalSales = g.Sum(s => s.Total)
                })
                .OrderBy(g => g.MonthYear)
                .ToList();

            return Ok(monthlySales);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi: {ex.Message}");
        }
    }
    [HttpGet()]
    public async Task<IActionResult> GetRecentFourWeeksOrderStatistics()
    {
        DateTime today = DateTime.Today;

        var recentFourWeeksOrders = await context.Order
            .Where(o => o.OrderDay >= today.AddDays(-28))
            .OrderByDescending(o => o.OrderDay)
            .ToListAsync();

        var weeklySummaries = recentFourWeeksOrders
            .GroupBy(o => CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(o.OrderDay, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday))
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                WeekNumber = "Tuần " + g.Key,
                TotalRevenue = g.Sum(o => o.Total)
            })
            .ToList();

        var lastFourWeeks = weeklySummaries.TakeLast(4).ToList();

        return Ok(lastFourWeeks);





    }


    [HttpGet]
    public IActionResult GetYearlyOrderStatistics([FromQuery] int Year)
    {
        DateTime startDate = new DateTime(Year, 1, 1);
        DateTime endDate = new DateTime(Year, 12, 31);

        var orderData = context.Order
            .Where(o => o.OrderDay >= startDate && o.OrderDay <= endDate)
            .ToList();

        var monthlyStatistics = orderData
            .GroupBy(o => new { o.OrderDay.Year, o.OrderDay.Month })
            .Select(g => new MonthlyOrderStatistics
            {
                MonthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month)} {g.Key.Year}",
                TotalAmount = g.Sum(o => o.Total)
            })
            .OrderBy(g => g.MonthYear)
            .ToList();


        var twelveMonths = new List<MonthlyOrderStatistics>();
        for (int i = 1; i <= 12; i++)
        {
            string monthYear = $"{CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(i)} {DateTime.Now.Year}";
            var existingMonthData = monthlyStatistics.FirstOrDefault(m => m.MonthYear == monthYear);
            if (existingMonthData != null)
            {
                twelveMonths.Add(existingMonthData);
            }
            else
            {
                twelveMonths.Add(new MonthlyOrderStatistics { MonthYear = monthYear, TotalAmount = 0 });
            }
        }

        return Ok(twelveMonths);
    }

    [HttpGet]
    public ActionResult GetHourlySalesStatistic()
    {
        DateTime today = DateTime.Today;
        DateTime startOfDay = today.Date;
        DateTime endOfDay = startOfDay.AddDays(1);

        var hourlyEarnings = new List<object>();

        var earningsOfDay = context.Order
            .Where(e => e.OrderDay >= startOfDay && e.OrderDay < endOfDay)
            .ToList();

        for (int i = 0; i < 24; i += 2)
        {
            DateTime startHour = startOfDay.AddHours(i);
            DateTime endHour = startHour.AddHours(2);

            decimal earningsInHour = earningsOfDay
                .Where(e => e.OrderDay >= startHour && e.OrderDay < endHour)
                .Sum(e => e.Total ?? 0);

            hourlyEarnings.Add(new
            {
                Hour = $"{startHour.Hour}:00 - {endHour.Hour}:00",
                Earnings = earningsInHour
            });
        }

        return Ok(hourlyEarnings);
    }
    [HttpPost]
    public async Task<ActionResult> CreateRole(string roleName)
    {
        var roleExists = await roleManager.RoleExistsAsync(roleName);

        if (!roleExists)
        {
            var newRole = new IdentityRole(roleName);

            var result = await roleManager.CreateAsync(newRole);

            if (result.Succeeded)
            {
                return Ok(true);
            }
            else
            {
                return Ok(false);
            }
        }
        else
        {
            return Ok(false);
        }
    }
    [HttpGet]
    public IActionResult GetRoles()
    {

        var roles = roleManager.Roles.ToList();
        return Ok(roles);
    }
    [HttpPost]
    public async Task<IActionResult> AssignRole(string userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound();
        }

        var roleExists = await roleManager.RoleExistsAsync(roleName);

        if (!roleExists)
        {
            return NotFound();
        }
        var isInRole = await userManager.IsInRoleAsync(user, roleName);

        if (!isInRole)
        {
            await userManager.AddToRoleAsync(user, roleName);
            return Ok($"Added role {roleName} to user {user.UserName} successfully.");
        }
        else
        {
            return BadRequest($"User {user.UserName} already has the role {roleName}.");
        }
    }
    [HttpDelete]
    public async Task<IActionResult> RemoveRole(string userId, string roleName)
    {
        var user = await userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return NotFound();
        }
        var isInRole = await userManager.IsInRoleAsync(user, roleName);

        if (isInRole)
        {
            await userManager.RemoveFromRoleAsync(user, roleName);
            return Ok($"Removed role {roleName} from user {user.UserName} successfully.");
        }
        else
        {
            return BadRequest($"User {user.UserName} doesn't have the role {roleName}.");
        }
    }
}
