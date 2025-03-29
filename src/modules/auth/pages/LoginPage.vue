<template>
  <q-page class="flex flex-center">
    <q-card class="q-pa-md shadow-2" style="width: 350px">
      <q-card-section class="q-pt-lg flex justify-center">
        <q-img src="logo1.jpg" alt="Logo" spinner-color="primary" width="60%" />
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center">Iniciar Sesión</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="handleLogin">
          <q-input
            v-model="email"
            label="Correo Electrónico"
            type="email"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'El correo es obligatorio']"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Contraseña"
            filled
            lazy-rules
            :rules="[(val) => !!val || 'La contraseña es obligatoria']"
            class="q-mt-md"
          >
            <template v-slot:prepend>
              <q-icon name="lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            type="submit"
            label="Ingresar"
            class="full-width q-mt-lg bg-first text-white"
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

const email = ref("tester@example.com");
const password = ref("password");
const isPwd = ref(true);
const loading = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login({ email: email.value, password: password.value });

    router.push("/dashboard");
  } catch (error) {
    console.error(error);
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
