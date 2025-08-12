<template>
    <div class="my-2 text-center">
        <h5 class="text-muted">
            <slot>Please wait...</slot>
        </h5>
        <div class="spinner-border text-primary my-2" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>
