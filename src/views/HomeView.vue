<template>
  <div>
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <ServiceGroup />
      <Exports />
      <NewPublishers />
    </div>
  </div>
</template>

<script setup>
import Exports       from '@/components/widgets/Exports.vue'
import ServiceGroup  from '@/components/widgets/ServiceGroup.vue'
import NewPublishers from '@/components/widgets/NewPublishers.vue'

</script>
