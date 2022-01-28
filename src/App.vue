<template>
  <el-container id="layout">
    <el-header id="header">
      <h2>IEEE P2668 for Lift Safety</h2>
    </el-header>
    <el-container>
      <el-main id="main">
        <div id="monitors">
          <Monitor
            v-for="monitor in monitors"
            :key="monitor.index"
            :title="monitor.title"
            :current="monitor.current"
            :hint="monitor.hint"
          ></Monitor>
        </div>
        <h3 id="score">IDex Score = {{ score }}</h3>
        <div class="btn-set">
          <el-button>Test Dataset 1</el-button>
          <el-button>Test Dataset 2</el-button>
          <el-button type="primary" id="start-btn">START</el-button>
        </div>
      </el-main>
      <el-aside id="aside">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column
            v-for="column in columns"
            :key="column.index"
            :prop="column.prop"
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
      tableData: [
        {
          findex: "1",
          fieldName: "Data Accuracy IDex",
          description: "Data Accuracy Level",
          dataType: "UInt32",
          value: "",
        },
        {
          findex: "2",
          fieldName: "DISID",
          description: "DISID",
          dataType: "UInt32",
          value: "0",
        },
        {
          findex: "3",
          fieldName: "Data Accuracy IDex",
          description: "Data Accuracy Level",
          dataType: "UInt32",
          value: "1",
        },
        {
          findex: "4",
          fieldName: "Data Accuracy IDex",
          description: "Data Accuracy Level",
          dataType: "UInt32",
          value: "1",
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
#monitors {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
}

#main {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

#score {
  align-self: center;
}

#aside {
  width: 40vw;
  padding: 20px;
}

#header {
  background-color: #409eff;
  h2 {
    color: white;
  }
}
.btn-set {
  display: flex;
  flex-direction: row;
  width: 100%;
  #start-btn {
    align-self: center;
    margin-left: auto;
  }
}
</style>
