import { createApp } from 'vue'
import App from './App.vue'
import GameView from "@/components/GameView.vue";
import {createRouter, createWebHashHistory} from "vue-router";

const app = createApp(App)

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', component: GameView },
    ]
})

app.use(router);

app.mount('#app')