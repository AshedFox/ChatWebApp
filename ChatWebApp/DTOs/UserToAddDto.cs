namespace ChatWebApp.DTOs
{
    public record UserToAddDto(string Username, string Email, 
        string PasswordHash, string Name, string ImageUrl);
}