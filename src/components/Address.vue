<template>
  <div v-if="address">
    <span v-if="address.address1">{{ address.address1 }}<br></span>
    <span v-if="address.address2">{{ address.address2 }}<br></span>
    <span v-if="address.zip">{{ address.zip }}&nbsp;</span><span v-if="address.city">{{ address.city }}</span>
  </div>
</template>

<script setup>
defineProps ({
    address: { type: Object, default: null },
})
</script>
