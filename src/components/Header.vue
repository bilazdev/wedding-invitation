<script setup lang="ts">
</script>

<template>
    <div class="container"> 
        <div class="name"> Bilal </div>
        <div class="name"> & </div>
        <div class="name"> Shahed </div>

    </div>
</template>

<style scoped>
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        background-color: var(--background);


    }

    .name {
        font-size: 4rem;
        margin: 2rem;
        font-family: var(--names-font-family);
        color: var(--primary);
    }
</style>
