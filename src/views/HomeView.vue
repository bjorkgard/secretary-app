<template>
  <div>
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mt-2 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceGroup />
        <Exports />
        <NewPublishers />
      </div>
    </div>
  </div>
</template>

<script setup>
import Exports       from '@/components/widgets/Exports.vue'
import ServiceGroup  from '@/components/widgets/ServiceGroup.vue'
import NewPublishers from '@/components/widgets/NewPublishers.vue'

</script>
