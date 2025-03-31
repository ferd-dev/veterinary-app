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
            @update:model-value="filtrarRoles"
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
        :rows="rolesFiltrados"
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
        <!-- Columna de acciones -->
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
              @click="confirmarEliminarRol(props.row)"
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
import { data } from "autoprefixer";

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

// Roles filtrados según la búsqueda
const rolesFiltrados = computed(() => {
  if (!buscar.value) return roles.value;

  const busqueda = buscar.value.toLowerCase();
  return roles.value.filter(
    (rol) =>
      rol.nombre.toLowerCase().includes(busqueda) ||
      rol.descripcion.toLowerCase().includes(busqueda)
  );
});

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

// Función para cargar los roles (simulación)
const cargarRoles = async () => {
  cargandoRoles.value = true;

  try {
    // Aquí iría la llamada a la API para obtener los roles
    // const response = await api.obtenerRoles();
    // roles.value = response.data;

    // Simulamos un retardo para mostrar el loading
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

// Función para filtrar roles
const filtrarRoles = () => {
  // La búsqueda se maneja con el computed rolesFiltrados
};

// Función para abrir el diálogo de creación de rol
const abrirDialogRol = () => {
  mostrarDialogRol.value = true;
};

// Función que se ejecuta cuando se crea un nuevo rol
const onRolCreado = (nuevoRol) => {
  // Asignar un ID al nuevo rol (esto normalmente vendría del backend)
  const id = roles.value.length + 1;

  // Agregar fechaCreacion
  // const fechaActual = new Date().toISOString().split("T")[0];

  // Agregar el nuevo rol al array
  roles.value.push({
    id,
    ...nuevoRol,
  });

  // Mostrar notificación de éxito
  $q.notify({
    color: "positive",
    position: "top",
    message: `Rol "${nuevoRol.nombre}" creado correctamente`,
    icon: "check_circle",
    timeout: 2000,
  });
};

// Función para editar un rol (puedes implementarla según tus necesidades)
const editarRol = (rol) => {
  $q.notify({
    color: "info",
    position: "top",
    message: `Editando rol: ${rol.nombre}`,
    icon: "edit",
  });
  // Aquí puedes implementar la lógica para editar roles
};

// Función para confirmar la eliminación de un rol
const confirmarEliminarRol = (rol) => {
  $q.dialog({
    title: "Confirmar eliminación",
    message: `¿Estás seguro de que deseas eliminar el rol "${rol.nombre}"?`,
    cancel: true,
    persistent: true,
  }).onOk(() => {
    // Eliminar el rol del array
    roles.value = roles.value.filter((r) => r.id !== rol.id);

    $q.notify({
      color: "positive",
      position: "top",
      message: `Rol "${rol.nombre}" eliminado correctamente`,
      icon: "check_circle",
    });
  });
};

// Cargar los roles al montar el componente
onMounted(() => {
  cargarRoles();
});
</script>
