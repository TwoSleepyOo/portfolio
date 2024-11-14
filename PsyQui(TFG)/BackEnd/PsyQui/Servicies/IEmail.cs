using PsyQui.Models;

namespace PsyQui.Servicies
{
    public interface IEmail
    {
        void SendEmail(EmailCONF request);
    }
}
