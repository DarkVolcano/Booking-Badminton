using Repositories;
using Repositories.DTO;
using Repositories.Entities;
using Google.Apis.Auth;
using Repositories.Repositories;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using Microsoft.Extensions.Caching.Memory;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;

namespace Services
{
    public interface IAccountServices
    {
        List<AccountDTO> GetAccount();
        AccountDTO GetAccountById(int id);
        AccountDTO GetAccountByName(string name);
        void DeleteAccount(int id);
        AccountDTO Login(string username, string password);
        List<AccountDTO> Search(string query);
        SelfProfile GetSelfProfile(int id);
        bool RegisterUser(RegisterInformation info);
        bool RegisterStaff(AccountDTO info);
        bool UpdatePassword(string email, UpdatePassword info);
        bool UpdateProfile(int user_id, UpdateProfileUser param);
        Task<int> SettingPassword(int user_id, SettingPasswordRequest info);
        bool IsUserExist(string? email);
        bool IsAdmin(int user_id);
        bool UpdateRoleUser(int user_id, Role role_id);
        Task UploadAccountImageAsync(int accountId, byte[] imageBytes);
        string GetAccountImagePath(int accountId);

        bool UpdateBalanceByPayment(int paymentId);

        Task<AccountDTO> GoogleLoginAsync(string token);

        Task<AccountDTO> MicrosoftLoginAsync(string token);
    }
    public class AccountServices : IAccountServices
    {
        private readonly UnitOfWork _unitOfWork;
        private string image = "clone-account.png";
        public AccountServices()
        {
            _unitOfWork ??= new UnitOfWork();
        }

        public List<AccountDTO> GetAccount()
        {   
            return _unitOfWork.AccountRepo.GetAll().Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountName = a.AccountName,
                Password = a.Password,
                FullName = a.FullName,
                Phone = a.Phone,
                Email = a.Email,
                RoleId = a.RoleId,
                Image = GetAccountImagePath(a.AccountId),
                Status = a.Status,
                Balance = a.Balance,
            }).ToList();
        }
        public AccountDTO GetAccountById(int id)
        {
            var account = _unitOfWork.AccountRepo.GetById(id);
            var image = GetAccountImagePath(id);
            if(account == null)
            {
                return null;
            }
            return new AccountDTO
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName,
                Password = account.Password,
                FullName = account.FullName,
                Phone = account.Phone,
                Email = account.Email,
                RoleId = account.RoleId,
                Status = account.Status,
                Image = image,
                Balance = account.Balance,
            };
        }

        public AccountDTO GetAccountByName(string name)
        {
            var account = _unitOfWork.AccountRepo.GetByName(name);
            if (account == null)
            {
                return null;
            }
            return new AccountDTO
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName,
                Password = account.Password,
                FullName = account.FullName,
                Phone = account.Phone,
                Email = account.Email,
                RoleId = account.RoleId,
                Status = account.Status,
                Image = account.Image,
                Balance = account.Balance,
            };
        }


        public void DeleteAccount(int id)
        {

            var account = _unitOfWork.AccountRepo.GetById(id);
            if (account != null)
            {
                account.Status = false;
                _unitOfWork.AccountRepo.Update(account);
                _unitOfWork.SaveChanges();
            }
        }


        public AccountDTO Login(string username, string password)
        {
            var account = _unitOfWork.AccountRepo.GetAccountByEmailAndPassword(username, password);
            var image = GetAccountImagePath(account.AccountId);
            if (account == null)
            {
                return null;
            }
            return new AccountDTO
            {
                AccountId = account.AccountId,
                AccountName = account.AccountName,
                Password = account.Password,
                FullName = account.FullName,
                Phone = account.Phone,
                Email = account.Email,
                RoleId = account.RoleId,
                Status = account.Status,
                Image = image,
                Balance = account.Balance,
            };
        }

        public List<AccountDTO> Search(string query)
        {
            var account = _unitOfWork.AccountRepo.GetAll();
            if (!string.IsNullOrEmpty(query))
            {
                account = account.Where(a => a.AccountName.Contains(query) || a.FullName.Contains(query)).ToList();
            }

            var accountDTOs = account.Select(a => new AccountDTO
            {
                AccountId = a.AccountId,
                AccountName = a.AccountName,
                Password = a.Password,
                FullName = a.FullName,
                Phone = a.Phone,
                Email = a.Email,
                Image = image,
                RoleId = a.RoleId,
                Status = a.Status,
                Balance = a.Balance,
            }).ToList();
            return accountDTOs;
        }

        public SelfProfile GetSelfProfile(int id)
        {
            var user = _unitOfWork.AccountRepo.GetById(id);
            var image = GetAccountImagePath(id);
            if (user == null || user.Status == false)
            {
                return null;
            }
            return new SelfProfile
            {
                UserName = user.AccountName,
                FullName = user.FullName,
                PhoneNumber = user.Phone,
                ImgUrl = image,
                Balance = user.Balance,
            };
        }

        public bool IsUserExist(string? email)
        {
            return _unitOfWork.AccountRepo.IsUserExist(email);
        }

        public bool RegisterUser(RegisterInformation info)
        {
            var check = _unitOfWork.AccountRepo.GetAccountByEmail(info.Email);
            if(check == null)
            {
                var user = new Account
                {
                    AccountName = info.UserName,
                    Phone = info.PhoneNum,
                    Email = info.Email,
                    FullName = info.FullName,
                    Password = info.Password,
                    Image = image,
                    RoleId = 2,
                    Status = true,
                    Balance = 0,
                };
                _unitOfWork.AccountRepo.Create(user);
                _unitOfWork.SaveChanges();
                return true;
            }
            return false;
        }

        public bool RegisterStaff(AccountDTO info)
        {
            var check = _unitOfWork.AccountRepo.GetAccountByEmail(info.Email);
            if (check == null)
            {
                var user = new Account
                {
                    AccountName = info.AccountName,
                    Phone = info.Phone,
                    Email = info.Email,
                    FullName = info.FullName,
                    Password = info.Password,
                    RoleId = info.RoleId,
                    Image = image,
                    Status = true,
                    Balance = 0,
                };
                _unitOfWork.AccountRepo.Create(user);
                _unitOfWork.SaveChanges();
                return true;
            }
            return false;
        }

        public bool UpdatePassword(string email, UpdatePassword info)
        {
            var user = _unitOfWork.AccountRepo.GetAccountByEmail(email);
            if (user.Password != info.NewPassword)
            {
                user.Password = info.NewPassword;
                _unitOfWork.AccountRepo.Update(user);
                _unitOfWork.SaveChanges();
                Console.WriteLine("Update sussecfully.");
                return true;
            }
            else
            {
                Console.WriteLine("Error: New password must be different from the current password.");
                return false;
            }
        }

        public bool UpdateProfile(int user_id, UpdateProfileUser param)
        {
            var user = _unitOfWork.AccountRepo.GetById(user_id);
            if (user != null)
            {
                user.AccountName = param.UserName;
                user.FullName = param.FullName;
                user.Phone = param.PhoneNumber;
                _unitOfWork.AccountRepo.Update(user);
                _unitOfWork.SaveChanges();
                return true;
            }return false;
        }

        public async Task<int> SettingPassword(int user_id, SettingPasswordRequest info)
        {
            var user =  _unitOfWork.AccountRepo.GetById(user_id);
            if (user == null || user.Status == false)
            {
                return -2;
            }

            if (user.Password != info.OldPass)
            {
                return 0;
            }

            if (info.NewPass != info.ReEnterPass)
            {
                return -1;
            }

            user.Password = info.NewPass;
            _unitOfWork.AccountRepo.Update(user);
            _unitOfWork.SaveChanges();
            return 1;
        }
        public bool IsAdmin(int user_id)
        {
            return _unitOfWork.AccountRepo.IsAdmin(user_id);
        }


        public bool UpdateRoleUser(int user_id, Role role_id)
        {
            var user = _unitOfWork.AccountRepo.GetById(user_id);

            if (user == null || user.Status == false)
                throw new Exception("Invalid user id");

            if (user.RoleId != role_id.RoleId)
            {
                user.RoleId = role_id.RoleId;
                _unitOfWork.AccountRepo.Update(user);
                _unitOfWork.SaveChanges();
            }

            return true;
        }

        public async Task UploadAccountImageAsync(int accountId, byte[] imageBytes)
        {
            var account = _unitOfWork.AccountRepo.GetById(accountId);
            if (account == null)
            {
                Console.WriteLine("Account not found.");
                return;
            }

            var fileName = Guid.NewGuid().ToString() + ".png";
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");

            if (!Directory.Exists(uploadPath))
            {
                Console.WriteLine("Creating uploads directory.");
                Directory.CreateDirectory(uploadPath);
            }

            var filePath = Path.Combine(uploadPath, fileName);

            await File.WriteAllBytesAsync(filePath, imageBytes);

            account.Image = fileName;

            _unitOfWork.AccountRepo.Update(account);
            _unitOfWork.SaveChanges();

            Console.WriteLine("Image saved successfully.");
        }
        public string GetAccountImagePath(int accountId)
        {
            var account = _unitOfWork.AccountRepo.GetById(accountId);
            if (account == null)
            {
                throw new Exception("Account not found.");
            }

            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            var imagePath = Path.Combine(uploadPath, account.Image);

            if (!System.IO.File.Exists(imagePath))
            {
                throw new Exception("Image file not found.");
            }

            return imagePath;
        }

        public bool UpdateBalanceByPayment(int paymentId)
        {
            var payment = _unitOfWork.PaymentRepo.GetById(paymentId);
            if (payment == null)
            {
                return false;
            }

            var accountId = payment.UserId;
            var account = _unitOfWork.AccountRepo.GetById((int)accountId);
            if (account == null)
            {
                return false;
            }

            account.Balance = payment.TotalAmount;
            _unitOfWork.AccountRepo.Update(account);
            _unitOfWork.SaveChanges();
            return true;
        }

        public async Task<AccountDTO> GoogleLoginAsync(string token)
        {
            try
            {
                // Validate the token and get the payload
                GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token);

                if (payload == null || string.IsNullOrEmpty(payload.Email))
                {
                    throw new Exception("Invalid Google user.");
                }

                var user = _unitOfWork.AccountRepo.GetAccountByEmail(payload.Email);
                if (user == null)
                {
                    user = new Account
                    {
                        AccountName = payload.Name,
                        Email = payload.Email,
                        FullName = payload.Name,
                        RoleId = 2,
                        Status = true,
                        Balance = 0,
                        Image = image
                    };
                    _unitOfWork.AccountRepo.Create(user);
                    _unitOfWork.SaveChanges();
                }

                return new AccountDTO
                {
                    AccountId = user.AccountId,
                    AccountName = user.AccountName,
                    FullName = user.FullName,
                    Email = user.Email,
                    RoleId = user.RoleId,
                    Status = user.Status,
                    Balance = user.Balance,
                    Image = GetAccountImagePath(user.AccountId),
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Google login failed: {ex.Message}");
            }
        }

        public async Task<AccountDTO> MicrosoftLoginAsync(string token)
        {
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                // Extract email and name from various possible claims
                var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "preferred_username" || c.Type == "email" || c.Type == "upn");
                var email = emailClaim?.Value;
                var nameClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "name" || c.Type == "given_name" || c.Type == "nickname");
                var name = nameClaim?.Value;

                if (string.IsNullOrEmpty(email))
                {
                    throw new Exception("Invalid Microsoft user. Email claim not found.");
                }

                var user = _unitOfWork.AccountRepo.GetAccountByEmail(email);
                if (user == null)
                {
                    user = new Account
                    {
                        AccountName = name,
                        Email = email,
                        FullName = name,
                        RoleId = 2, 
                        Status = true,
                        Balance = 0,
                        Image = image
                    };
                    _unitOfWork.AccountRepo.Create(user);
                    _unitOfWork.SaveChanges();
                }

                return new AccountDTO
                {
                    AccountId = user.AccountId,
                    AccountName = user.AccountName,
                    FullName = user.FullName,
                    Email = user.Email,
                    RoleId = user.RoleId,
                    Status = user.Status,
                    Balance = user.Balance,
                    Image = GetAccountImagePath(user.AccountId),
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Microsoft login failed: {ex.Message}");
            }
        }

    }

}
