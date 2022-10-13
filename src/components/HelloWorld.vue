<template>
  <div class="font-medium">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  name  : 'HelloWorld',
  props : {
    msg: String
  }
}
</script>
