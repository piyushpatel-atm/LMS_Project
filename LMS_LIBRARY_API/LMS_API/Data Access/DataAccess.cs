using Dapper;
using LMS_API.Models;
using System.Data.SqlClient;

namespace LMS_API.Data_Access
{
    public class DataAccess : IDataAccess
    {
        private readonly IConfiguration _configuration;
        private readonly string Dbconnection;
        public DataAccess(IConfiguration config)
        {
            this._configuration = config;
            this.Dbconnection = _configuration["ConnectionStrings:LMSconnection"] ?? "";

        }

        

        public bool AuthenticatedUser(string email, string password, out User? user)
        {
            var result=false;
            using(var conn=new SqlConnection(this.Dbconnection))
            {
                result=conn.ExecuteScalar<bool>("select count(1) from Users where email=@email and password=@password", new {email,password});
                if (result)
                {
                    user=conn.QueryFirst<User>("select * from Users where email=@email", new {email});
                }
                else
                {
                    user = null;
                }
            }
            return result;
        }


        public int CreateUser(User user)
        {
            var result = 0;
            using(var conn = new SqlConnection(this.Dbconnection))
            {
                var param = new
                {
                    fn = user.FirstName,
                    ln = user.LastName,
                    em = user.Email,
                    ps = user.Password,
                    mb = user.Mobile,
                    blk = user.Blocked,
                    act = user.Active,
                    con = user.CreatedOn,
                    type = user.UserType.ToString(),

                };
                var sql = "Insert into Users(FirstName,LastName,Email,Mobile,Password,Blocked,Active,CreatedOn,UserType) values(@fn,@ln,@em,@mb,@ps,@blk,@act,@con,@type);";
                conn.Execute(sql,param);
            }
            return result;
        }

        public IList<Book> getAllBooks()
        {
            IEnumerable<Book> books = null;
            using(SqlConnection conn = new SqlConnection(this.Dbconnection))
            {
                books = conn.Query<Book>("Select * from Books");
                foreach(var book in books)
                {
                    book.Category = conn.QuerySingle<BookCategory>("select * from BookCategories where Id=" + book.CategoryId);
                }
            }
            return books.ToList();
        }

        public IList<Order> GetAllOrders()
        {
            IEnumerable<Order> orders;
            using (var connection = new SqlConnection(Dbconnection))
            {
                var sql = @"select
                           o.Id as Id,u.Id as UserId, CONCAT(u.FirstName,' ',u.LastName) as Name,
                           o.BookId as BookId,b.Title as BookName,
                           o.OrderedOn as OrderDate, o.Returned as Returned
                           from Users u LEFT JOIN Orders o ON u.Id=o.UserId
                           LEFT JOIN Books b ON o.BookId=b.Id
                           where o.Id IS NOT NULL;";
                orders = connection.Query<Order>(sql);
            }
            return orders.ToList();
        }

        public IList<Order> GetOrdersOfUser(int userId)
        {
            IEnumerable<Order> orders;
            using(var connection =new SqlConnection(Dbconnection))
            {
                var sql = @"select
                           o.Id as Id,u.Id as UserId, CONCAT(u.FirstName,' ',u.LastName) as Name,
                           o.BookId as BookId,b.Title as BookName,
                           o.OrderedOn as OrderDate, o.Returned as Returned
                           from Users u LEFT JOIN Orders o ON u.Id=o.UserId
                           LEFT JOIN Books b ON o.BookId=b.Id
                           where o.UserId IN(@Id);";
                orders = connection.Query<Order>(sql, new {Id=userId});
            }
            return orders.ToList();
        }

        public IList<User> GetUsers()
        {
            IEnumerable<User> users;
            using (var connection = new SqlConnection(Dbconnection))
            {
                var sql = $"select * from Users;";
                users = connection.Query<User>(sql);
                var listOfOrders =
                    connection.Query("select u.Id as UserId,o.BookId as BookId, o.OrderedOn as OrderDate,o.Returned as Returned from Users u LEFT JOIN Orders o ON u.Id=o.UserId");

                foreach(var user in users)
                {
                    var orders =listOfOrders.Where(lo=>lo.UserId == user.Id).ToList();
                    var fine = 0;
                    foreach(var order in orders)
                    {
                        if(order.BookId != null && order.Returned !=null && order.Returned == false)
                        {
                            var orderDate=order.OrderDate;
                            var maxDate = orderDate.AddDays(5);
                            var currentDate = DateTime.Now;

                            var extraDate=(currentDate -maxDate).Days;
                            extraDate=extraDate < 0?0:extraDate;

                            fine = extraDate * 10;
                            user.Fine += fine;
                        }
                    }
                }
            }
            return users.ToList();
        }

        public bool isEmailAvailable(string email)
        {
            var result=false;
            using (var connection = new SqlConnection(Dbconnection))
            {
                result = connection.ExecuteScalar<bool>("select * from Users where Email=@email;", new {email=email});
            }

            return !result;
        }

        public bool OrderBook(int userId, int bookId)
        {
            var ordered = false;
            using(var connection = new SqlConnection(Dbconnection))
            {
                var sql = $"insert into Orders(UserId,BookId,OrderedOn,Returned) values({userId},{bookId},'{DateTime.Now:yyyy-MM-dd HH:mm:ss}',0);";
                var inserted = connection.Execute(sql) == 1;
                if (inserted)
                {
                    sql = $"update Books set Ordered=1 where Id={bookId}";
                    var updated=connection.Execute(sql) == 1;
                    ordered = updated;
                }
            }
            return ordered;
        }

        public bool ReturnBook(int userId, int bookId)
        {
            var returned=false;
            using(SqlConnection connection = new SqlConnection(Dbconnection))
            {
                var sql = $"update Books set Ordered=0 where Id={bookId};";
                connection.Execute(sql);
                sql = $"update Orders set Returned=1 where UserId={userId} and BookId={bookId};";
                returned = connection.Execute(sql) == 1;
            }
            return returned;
        }

        public void UnBlockUser(int userId)
        {
            using (var connection = new SqlConnection(Dbconnection))
            {
                connection.Execute("update Users set Blocked=0 where Id=@Id", new { Id = userId });
            }
        }
        public void ActiveUser(int userId)
        {
            using (var connection = new SqlConnection(Dbconnection))
            {
                connection.Execute("update Users set Active=1 where Id=@Id", new { Id = userId });
            }
        }
        public void DeactivateUser(int userId)
        {
            using (var connection = new SqlConnection(Dbconnection))
            {
                connection.Execute("update Users set Active=0 where Id=@Id", new { Id = userId });
            }
        }

        public void BlockUser(int userId)
        {
           using(var connection = new SqlConnection(Dbconnection))
            {
                connection.Execute("update Users set Blocked=1 where Id=@Id", new {Id=userId});
            }
        }

        public void InsertNewBook(Book book)
        {
            using var conn=new SqlConnection(Dbconnection);
            var sql = "select Id from BookCategories where Category=@cat and SubCategory=@subcat";
            var parameter1 = new
            {
                cat = book.Category.Category,
                subcat = book.Category.SubCategory
            };
            var categoryId=conn.ExecuteScalar<int>(sql,parameter1);

            sql = "insert into Books(Title,Author,Price,Ordered, CategoryId) values(@title, @author,@price, @ordered,@catid)";
            var parameter2 = new
            {
                title = book.Title,
                author = book.Author,
                price = book.Price,
                ordered = false,
                catid = categoryId,
            };
            conn.Execute(sql,parameter2);
        }

        public bool DeleteBook(int bookId)
        {
            var deleted = false;
            using(var conn = new SqlConnection(Dbconnection))
            {
                var sql = $"delete Books where Id={bookId}";
                deleted = conn.Execute(sql) == 1;
            }
            return deleted;
        }

        public void CreateCategory(BookCategory bookCategory)
        {
            using var conn = new SqlConnection(Dbconnection);
            var parameter = new
            {
                cat = bookCategory.Category,
                subcat = bookCategory.SubCategory
            };
            conn.Execute("insert into BookCategories(category, subcategory) values (@cat, @subcat);", parameter);
           
        }
    }
}
