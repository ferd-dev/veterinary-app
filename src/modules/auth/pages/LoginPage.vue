<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2" style="width: 350px">
      <q-card-section>
        <div class="text-h6">Iniciar Sesión</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="handleLogin">
          <q-input
            v-model="email"
            label="Correo Electrónico"
            type="email"
            lazy-rules
            :rules="[(val) => !!val || 'El correo es obligatorio']"
          />
          <q-input
            v-model="password"
            label="Contraseña"
            type="password"
            lazy-rules
            :rules="[(val) => !!val || 'La contraseña es obligatoria']"
            class="q-mt-md"
          />
          <q-btn
            type="submit"
            label="Ingresar"
            color="primary"
            class="full-width q-mt-md"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../store/authStore";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const email = ref("");
const password = ref("");
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });
    Notify.create({ type: "positive", message: "Inicio de sesión exitoso" });
    router.push("/dashboard");
  } catch (error) {
    Notify.create({
      type: "negative",
      message: error.message || "Error en inicio de sesión",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.q-card {
  max-width: 400px;
}
</style>
