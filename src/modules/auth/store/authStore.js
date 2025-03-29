import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import axios from "axios";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const router = useRouter();

  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  if (token.value) {
    setAuthHeader(token.value);
  }

  const login = async ({ email, password }) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/auth/login",
        {
          email,
          password,
        }
      );

      const { access_token, user } = response.data.data;
      const newToken = access_token;
      const userData = user;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      token.value = newToken;
      user.value = userData;

      // Configurar el header de autorización para futuras peticiones
      setAuthHeader(newToken);

      Notify.create({
        type: "positive",
        message: "Inicio de sesión exitoso",
        position: "top",
      });
    } catch (error) {
      let errorMessage = "Error al iniciar sesión";
      let errorDetails = "";

      if (error.response && error.response.data && error.response.data.error) {
        const { message, details } = error.response.data.error;
        errorMessage = message || errorMessage;
        errorDetails = details || "";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Notify.create({
        type: "negative",
        message: errorMessage,
        caption: errorDetails,
        position: "top",
        timeout: 3000,
      });

      throw error;
    }
  };

  // Función para verificar si el token es válido
  const checkAuth = async () => {
    if (!token.value) return false;

    try {
      // Opcional: verificar validez del token en el servidor
      await axios.get("http://127.0.0.1:8000/api/v1/auth/user");
      return true;
    } catch (error) {
      console.error("Token inválido:", error);
      // Si hay error, el token es inválido, hacer logout
      await logout();
      return false;
    }
  };

  const logout = async () => {
    try {
      // Opcional: realizar petición de logout al backend
      if (token.value) {
        await axios.post("http://127.0.0.1:8000/api/v1/auth/logout");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      // Limpiar datos independientemente del resultado
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      token.value = null;
      user.value = null;
      setAuthHeader(null);

      Notify.create({
        type: "info",
        message: "Sesión cerrada",
        position: "top",
      });

      router.push("/login");
    }
  };

  return {
    token,
    user,
    login,
    logout,
    checkAuth,
    isAuthenticated: () => !!token.value,
  };
});
