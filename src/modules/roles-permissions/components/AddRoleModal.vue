<template>
  <q-dialog v-model="isOpen" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 80vw">
      <q-card-section class="row items-center bg-second text-white">
        <div class="text-h6">Nuevo Rol</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" ref="rolForm">
          <div class="q-gutter-md">
            <q-input
              color="first"
              v-model="rolData.nombre"
              label="Nombre del Rol"
              :rules="[(val) => !!val || 'El nombre es obligatorio']"
              outlined
              dense
            />

            <div class="text-subtitle2 q-mb-sm">Permisos</div>

            <q-list separator>
              <q-item
                clickable
                v-ripple
                v-for="(item, index) in opcionesPermisos"
                :key="index"
              >
                <q-item-section>{{ item.name }}</q-item-section>
                <q-item-section>
                  <div class="row q-gutter-sm">
                    <q-checkbox
                      v-for="(permiso, subIndex) in item.permisos"
                      :key="subIndex"
                      :label="permiso.name"
                      :val="permiso.permiso"
                      color="second"
                      v-model="selectedPermisos"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-form>
      </q-card-section>

      <q-separator color="first" />

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="fourth" v-close-popup />
        <q-btn
          :loading="loading"
          color="second"
          label="Guardar"
          @click="onSubmit"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { useQuasar } from "quasar";

import { permissions } from "../data/permissionList";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "rolCreated"]);
const $q = useQuasar();
const rolForm = ref(null);
const loading = ref(false);

const isOpen = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
  }
);

watch(
  () => isOpen.value,
  (newVal) => {
    emit("update:modelValue", newVal);
  }
);

const selectedPermisos = ref([]);

const rolData = ref({
  nombre: "",
});

const opcionesPermisos = permissions;

const onSubmit = async () => {
  const isValid = await rolForm.value.validate();

  if (!isValid) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "Por favor, completa todos los campos obligatorios.",
      icon: "error",
    });
    return;
  }

  loading.value = true;

  try {
    const nuevoRol = {
      nombre: rolData.value.nombre,
      permisos: [...selectedPermisos.value],
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));

    emit("rolCreated", nuevoRol);

    isOpen.value = false;

    $q.notify({
      color: "positive",
      position: "top",
      message: `Rol "${rolData.value.nombre}" creado correctamente`,
      icon: "check_circle",
      timeout: 2000,
    });
  } catch (error) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "Error al guardar el rol",
      icon: "error",
    });
  } finally {
    loading.value = false;
  }
};

const onDialogHide = () => {
  rolData.value = {
    nombre: "",
  };
  selectedPermisos.value = [];
};
</script>
