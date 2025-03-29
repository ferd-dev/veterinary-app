import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import authService from "../services/authService";
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

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);

      const { access_token, user } = response.data.data;
      const newToken = access_token;
      const userData = user;

      // Persistir datos
      _setUserData(newToken, userData);

      Notify.create({
        type: "positive",
        message: "Inicio de sesión exitoso",
        position: "top",
      });
    } catch (error) {
      _handleError(error, "Error al iniciar sesión");
      throw error;
    }
  };

  /**
   * Verifica si el usuario está autenticado correctamente
   * @returns {Promise<boolean>} Estado de autenticación
   */
  const checkAuth = async () => {
    if (!token.value) return false;

    try {
      const response = await authService.getCurrentUser();

      if (response.data.success === false) {
        throw new Error("Token inválido");
      }

      return true;
    } catch (error) {
      console.error("Error de autenticación:", error);
      await logout();
      return false;
    }
  };

  /**
   * Maneja el cierre de sesión
   */
  const logout = async () => {
    try {
      if (token.value) {
        await authService.logout();
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      _clearUserData();

      Notify.create({
        type: "info",
        message: "Sesión cerrada",
        position: "top",
      });

      router.push("/login");
    }
  };

  /**
   * Almacena los datos del usuario en localStorage y en el estado
   * @param {string} newToken - Token de autenticación
   * @param {Object} userData - Datos del usuario
   * @private
   */
  const _setUserData = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    token.value = newToken;
    user.value = userData;
  };

  /**
   * Limpia los datos del usuario
   * @private
   */
  const _clearUserData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    token.value = null;
    user.value = null;
  };

  /**
   * Maneja los errores de forma consistente
   * @param {Error} error - Error capturado
   * @param {string} defaultMessage - Mensaje por defecto
   * @private
   */
  const _handleError = (error, defaultMessage = "Error en la operación") => {
    let errorMessage = defaultMessage;
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
