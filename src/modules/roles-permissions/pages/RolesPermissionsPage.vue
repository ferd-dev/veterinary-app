<template>
  <div class="q-pa-md q-gutter-sm">
    <q-breadcrumbs class="text-fourth">
      <q-breadcrumbs-el icon="home" />
      <q-breadcrumbs-el label="Roles y permisos" icon="widgets" />
    </q-breadcrumbs>
  </div>
  <q-page class="q-px-md q-py-md">
    <p class="text-h4 flex items-center">
      <q-icon name="admin_panel_settings" class="text-first" />
      <span class="text-first">Roles y permisos</span>
    </p>

    <q-separator color="first" />

    <q-card class="q-mt-md">
      <q-card-section>
        <div class="flex justify-between items-center q-px-md">
          <q-input
            style="width: 300px"
            label="Buscar"
            debounce="300"
            v-model="buscar"
          />

          <q-btn
            class="q-py-sm"
            color="first"
            label="Agregar Rol"
            icon="add"
            size="sm"
            rounded
            @click="abrirDialogRol"
          />
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-mt-md">
      <q-table
        :rows="roles"
        :columns="columns"
        row-key="id"
        :loading="cargandoRoles"
        no-data-label="No hay roles disponibles"
      >
        <template v-slot:body-cell-permisos="props">
          <q-td :props="props">
            <div class="flex flex-wrap">
              <q-chip
                v-for="(item, index) in props.row.permisos"
                :key="index"
                color="second"
                text-color="white"
                size="sm"
              >
                {{ item }}
              </q-chip>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              dense
              color="info"
              icon="edit"
              @click="editarRol(props.row)"
            />
            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              @click="eliminarRol(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>

  <!-- Importamos el componente de diálogo -->
  <AddRoleModal v-model="mostrarDialogRol" @rol-created="onRolCreado" />
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import AddRoleModal from "../components/AddRoleModal.vue";

const $q = useQuasar();
const mostrarDialogRol = ref(false);
const cargandoRoles = ref(false);
const buscar = ref("");
const roles = ref([
  {
    id: 1,
    nombre: "Administrador",
    permisos: [
      "ver_usuarios",
      "crear_usuarios",
      "editar_usuarios",
      "eliminar_usuarios",
      "ver_roles",
      "admin_permisos",
    ],
  },
  {
    id: 2,
    nombre: "Editor",
    permisos: ["ver_usuarios", "ver_roles"],
  },
]);

const columns = [
  {
    name: "id",
    required: true,
    label: "ID",
    align: "left",
    field: "id",
    sortable: true,
  },
  {
    name: "nombre",
    required: true,
    label: "Nombre del Rol",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "permisos",
    label: "Permisos",
    field: "permisos",
    align: "center",
  },
  {
    name: "acciones",
    label: "Acciones",
    field: "acciones",
    align: "center",
  },
];

const cargarRoles = async () => {
  cargandoRoles.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (error) {
    $q.notify({
      color: "negative",
      position: "top",
      message: "Error al cargar los roles",
      icon: "error",
    });
  } finally {
    cargandoRoles.value = false;
  }
};

const abrirDialogRol = () => {
  mostrarDialogRol.value = true;
};

const onRolCreado = (nuevoRol) => {
  const id = roles.value.length + 1;

  roles.value.push({
    id,
    ...nuevoRol,
  });

  $q.notify({
    color: "positive",
    position: "top",
    message: `Rol "${nuevoRol.nombre}" creado correctamente`,
    icon: "check_circle",
    timeout: 2000,
  });
};

const editarRol = (rol) => {
  $q.notify({
    color: "info",
    position: "top",
    message: `Editando rol: ${rol.nombre}`,
    icon: "edit",
  });
};

const eliminarRol = (rol) => {
  $q.notify({
    color: "negative",
    position: "top",
    message: `Eliminar rol: ${rol.nombre}`,
    icon: "edit",
  });
};

onMounted(() => {
  cargarRoles();
});
</script>
