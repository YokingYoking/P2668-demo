<template>
  <el-container id="layout">
    <el-header>
      <h2>IEEE P2668 for Lift Safety</h2>
    </el-header>
    <el-container>
      <el-main id="main">
        <Monitor
          v-for="monitor in monitors"
          :key="monitor.index"
          :title="monitor.title"
          :current="monitor.current"
          :hint="monitor.hint"
        ></Monitor>
        <p>IDex Score = {{ score }}</p>
        <div class="btn-set">
          <el-button>Test Dataset 1</el-button>
          <el-button>Test Dataset 2</el-button>
          <el-button type="primary">START</el-button>
        </div>
      </el-main>
      <el-aside id="aside">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            v-for="column in columns"
            :key="column.index"
            :prop="column.title"
            :label="column.label"
          />
        </el-table>
      </el-aside>
    </el-container>
  </el-container>
</template>

<script>
import Monitor from "@/components/Monitor/index.vue";

export default {
  name: "App",
  components: {
    Monitor,
  },
  data() {
    return {
      monitors: [
        {
          title: "Motor Current",
          current: 1,
          hint: 100,
        },
        {
          title: "Brake Current",
          current: 1,
          hint: 5,
        },
        {
          title: "Safety Current",
          current: 1,
          hint: 5,
        },
        {
          title: "Door Current",
          current: 1,
          hint: 5,
        },
      ],
      columns: [
        {
          prop: "findex",
          label: "FINDEX",
        },
        {
          prop: "fieldName",
          label: "FIELD NAME",
        },
        {
          prop: "description",
          label: "DESCRIPTION",
        },
        {
          prop: "dataType",
          label: "DATA TYPE",
        },
        {
          prop: "value",
          label: "VALUE",
        },
      ],
      score: 0.1,
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
#layout {
  box-sizing: content-box;
  padding: 20px;
}

#main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

#aside {
  width: 40vw;
}
</style>
