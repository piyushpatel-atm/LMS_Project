using LMS_API.Data_Access;
using LMS_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace LMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LibraryController : ControllerBase
    {
        private readonly IDataAccess _library;
        private readonly IConfiguration _configuration;
        public LibraryController(IDataAccess library,IConfiguration configuration=null)
        {
            this._library = library;
            this._configuration = configuration;
        }
        [HttpPost("CreateAccount")]
        public IActionResult CreateAccount(User user)
        {
            if (!_library.isEmailAvailable(user.Email))
            {
                return Ok("Email is not Available");
            }
            user.CreatedOn = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
            user.UserType=UserType.USER;
            _library.CreateUser(user);
            return Ok("Account Created Successfully");
        }
        [HttpGet("Login")]
        public IActionResult Login(string email,string password)
        {
            if(_library.AuthenticatedUser(email,password,out User? user))
            {
                if(user != null)
                {
                    var jwt = new Jwt(_configuration["Jwt:Key"], _configuration["Jwt:Duration"]);
                    var token = jwt.GenerateToken(user);
                    return Ok(token);
                }
            }
            return Ok("Invalid");
        }
        [HttpGet("GetAllBooks")]
        public IActionResult GetAllBooks()
        {
            var books = _library.getAllBooks();
            var BookToSend = books.Select(book =>new
            {
                book.Id,
                book.Title,
                book.Category.Category,
                book.Category.SubCategory,
                book.Price,
                Available=!book.Ordered,
                book.Author,

            }).ToList();
            return Ok(BookToSend);
        }
        [HttpGet("OrderBook/{userId}/{bookId}")]
        public IActionResult OrderBook(int userId,int bookId)
        {
            var result =_library.OrderBook(userId,bookId)? "success":"fail";
            return Ok(result);
        }
        [HttpGet("GetOrders/{id}")]
        public IActionResult GetOrders(int id)
        {
            return Ok(_library.GetOrdersOfUser(id));
        }
        [HttpGet("GetAllOrders")]
        public IActionResult GetAllOrders()
        {
            return Ok(_library.GetAllOrders());
        }
        [HttpGet("ReturnBook/{bookId}/{userId}")]
        public IActionResult ReturnBook(string bookId,string userId)
        {
            var result=_library.ReturnBook(int.Parse(userId),int.Parse(bookId));
            return Ok(result == true ? "success" : "not returned");
        }

        [HttpGet("GetAllUsers")]
        public IActionResult GetAllUsers()
        {
            var users = _library.GetUsers();
            var result = users.Select(user => new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Mobile,
                user.Blocked,
                user.Active,
                user.CreatedOn,
                user.UserType,
                user.Fine
            });
            return Ok(result);
        }

        [HttpGet("ChangeBlockStatus/{status}/{id}")]
        public IActionResult ChangeBlockStatus(int status,int id)
        {
            if(status == 1)
            {
                _library.BlockUser(id);
            }
            else
            {
                _library.UnBlockUser(id);
            }
            return Ok("success");
        }

        [HttpGet("ChangeEnableStatus/{status}/{id}")]
        public IActionResult ChangeEnableStatus(int status, int id)
        {
            if (status == 1)
            {
                _library.ActiveUser(id);
            }
            else
            {
                _library.DeactivateUser(id);
            }
            return Ok("success");
        }

        [HttpPost("InsertBook")]
        public IActionResult InsertBook(Book book)
        {
            book.Title=book.Title.Trim();
            book.Author=book.Author.Trim();
            book.Category.Category = book.Category.Category.ToLower();
            book.Category.SubCategory=book.Category.SubCategory.ToLower();

            _library.InsertNewBook(book);
            return Ok("Inserted");
        }

        [HttpDelete("DeleteBook/{bookId}")]
        public IActionResult DeleteBook(int bookId)
        {
            var returnResult=_library.DeleteBook(bookId) ? "success":"fail";
            return Ok(returnResult);
        }
        [HttpPost("InsertCategory")]
        public IActionResult InsertCategory( BookCategory bookCategory)
        {
            bookCategory.Category=bookCategory.Category.ToLower();
            bookCategory.SubCategory=bookCategory.SubCategory.ToLower();
            _library.CreateCategory(bookCategory);
            return Ok("Inserted");
        }
    }
}
