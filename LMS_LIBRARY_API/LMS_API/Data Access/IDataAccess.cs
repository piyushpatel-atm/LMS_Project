using LMS_API.Models;

namespace LMS_API.Data_Access
{
    public interface IDataAccess
    {
        int CreateUser(User user);
        bool isEmailAvailable(string email);
        bool AuthenticatedUser(string email,string password,out User? user);
        IList<Book> getAllBooks();
        bool OrderBook(int userId, int bookId);
        IList<Order> GetOrdersOfUser(int userId);
        IList<Order> GetAllOrders();
        bool ReturnBook(int userId,int bookId);
        IList<User> GetUsers();

        void BlockUser(int userId);
        void UnBlockUser(int userId);
        void DeactivateUser(int userId);
        void ActiveUser(int userId);

        void InsertNewBook(Book book);
        bool DeleteBook(int bookId);
        void CreateCategory(BookCategory bookCategory);
    }
}
