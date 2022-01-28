<template>
  <div id="container">
    <h3>{{ title }}:</h3>
    <h4 id="current">{{ current }} A</h4>
    <p>Measurement range: ±{{ hint }} A</p>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Monitor",
  props: {
    title: {
      type: String,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    hint: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
#container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 25vw;
  border: 1px black solid;
  margin-bottom: 20px;
  padding: 10px;
}

#current {
  align-self: center;
}
</style>
