import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token"); // O Backend deve enviar o token como query param no sucesso

    if (token) {
      localStorage.setItem("token", token);
      toast.success("Identidade sincronizada com sucesso!");
      // Redireciona e força um refresh para o Header ler o token
      window.location.href = "/";
    } else {
      const error = params.get("error");
      toast.error(error || "Falha na autenticação OAuth2.");
      navigate("/");
    }
  }, [location, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skillswap-teal mx-auto mb-4"></div>
        <p className="text-muted-foreground font-bold">Sincronizando com o reator central...</p>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;