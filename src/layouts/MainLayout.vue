<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-first text-white">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Sistema de Administración </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list>
          <q-item-label header> Menu </q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />

          <q-item-label header> Accesos </q-item-label>

          <EssentialLink
            v-for="link in linksListAccesos"
            :key="link.title"
            v-bind="link"
          />

          <q-item-label header> Gestión </q-item-label>

          <EssentialLink
            v-for="link in linksListGestion"
            :key="link.title"
            v-bind="link"
          />
          <q-item-label header> Agenda </q-item-label>

          <EssentialLink
            v-for="link in linksListAgenda"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        src="https://cdn.quasar.dev/img/material.png"
        style="height: 150px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useAuthStore } from "src/modules/auth/store/authStore";

const linksList = [
  {
    title: "Dashboard",
    icon: "dashboard",
    link: "/dashboard",
  },
];

const linksListAccesos = [
  {
    title: "Roles y Permisos",
    icon: "admin_panel_settings",
    link: "/roles",
  },
  {
    title: "Staffs",
    icon: "group",
    link: "/staffs",
  },
];

const linksListGestion = [
  {
    title: "Veterinarios",
    icon: "person",
    link: "/veterinarians",
  },
  {
    title: "Macotas",
    icon: "group",
    link: "/pets",
  },
];

const linksListAgenda = [
  {
    title: "Citas Médicas",
    icon: "event_note",
    link: "/appointments",
  },
  {
    title: "Calendario",
    icon: "calendar_today",
    link: "/calendar",
  },
  {
    title: "Vacunas",
    icon: "vaccines",
    link: "/vaccines",
  },
  {
    title: "Procedimientos Quirúrgicos",
    icon: "spellcheck",
    link: "/surgical-procedures",
  },
  {
    title: "Historial Clínico",
    icon: "history_edu",
    link: "/clinical-history",
  },
  {
    title: "Salir",
    icon: "logout",
    link: "/",
    class: "text-red",
    onclick: logout,
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

async function logout() {
  try {
    await useAuthStore().logout();
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
}
</script>
