import apiClient from "../../../services/api";

const authService = {
  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise} Respuesta con datos del usuario y token
   */
  login(credentials) {
    return apiClient.post("/auth/login", credentials);
  },

  /**
   * Cerrar sesión del usuario actual
   * @returns {Promise} Respuesta del servidor
   */
  logout() {
    return apiClient.post("/auth/logout");
  },

  /**
   * Obtener información del usuario actual
   * @returns {Promise} Datos del usuario autenticado
   */
  getCurrentUser() {
    return apiClient.get("/auth/user");
  },
};

export default authService;
