import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("token") || null);
  const user = ref(null);
  const router = useRouter();

  const login = async ({ email, password }) => {
    try {
      // Simulación de la petición a API (Reemplaza con una API real)
      if (email === "admin@example.com" && password === "password123") {
        const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"; // Token simulado
        localStorage.setItem("token", fakeToken);
        token.value = fakeToken;
        user.value = { email, name: "Administrador" }; // Datos de usuario simulados

        Notify.create({
          type: "positive",
          message: "Inicio de sesión exitoso",
        });
        router.push("/dashboard");
      } else {
        throw new Error("Credenciales incorrectas");
      }
    } catch (error) {
      Notify.create({ type: "negative", message: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    token.value = null;
    user.value = null;
    router.push("/login");
  };

  return {
    token,
    user,
    login,
    logout,
    isAuthenticated: () => !!token.value,
  };
});
