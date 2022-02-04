<template>
  <el-container id="layout">
    <el-header id="header">
      <h2>IEEE P2668 for Lift Safety</h2>
    </el-header>
    <el-container id="body">
      <el-main id="main">
        <div id="monitors">
          <Monitor
            v-for="monitor in data.monitors"
            :key="monitor.index"
            :title="monitor.title"
            :current="monitor.current"
            :hint="monitor.hint"
          ></Monitor>
        </div>
        <h3 id="score">IDex Score = {{ data.score }}</h3>
        <div class="btn-set">
          <el-button @click="datasetOnLoad(1)" :disabled="data.starting"
            >Test Dataset 1</el-button
          >
          <el-button @click="datasetOnLoad(2)" :disabled="data.starting"
            >Test Dataset 2</el-button
          >
          <el-button
            type="primary"
            id="start-btn"
            @click="startOnClick()"
            :disabled="data.starting"
            >START</el-button
          >
        </div>
      </el-main>
      <el-aside id="aside">
        <!-- <el-upload action="" :on-change="handleChange" :auto-upload="false">
          <el-button size="small" type="primary">Upload</el-button>
        </el-upload> -->
        <el-table
          :data="data.tableData"
          border
          style="width: 100%"
          max-height="600"
        >
          <el-table-column
            v-for="column in config.columns"
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
const RUNNING_TIME = 10000; // running time config
const DATASET1_MIN_CURRENT = 0.005185;
const DATASET1_MAX_CURRENT = 0.034062;
const DATASET2_MIN_CURRENT = 0.305185;
const DATASET2_MAX_CURRENT = 5.734062;
const DATASET1_MIN_SCORE = 3.5;
const DATASET1_MAX_SCORE = 3.8;
const DATASET2_MIN_SCORE = 2.0;
const DATASET2_MAX_SCORE = 2.5;

import Monitor from "@/components/Monitor/index.vue";
import { ElMessage } from "element-plus";
import axios from "axios";
axios.defaults.baseURL = "http://iotlab.asuscomm.com:30035";

import { reactive, watch, onMounted } from "vue";

export default {
  name: "App",
  components: {
    Monitor,
  },
  setup() {
    let config = {
      columns: [
        // table config
        {
          prop: "FINDEX",
          label: "FINDEX",
        },
        {
          prop: "FIELD_NAME",
          label: "FIELD NAME",
        },
        {
          prop: "DESCRIPTION",
          label: "DESCRIPTION",
        },
        {
          prop: "DATA_TYPE",
          label: "DATA TYPE",
        },
        {
          prop: "VALUE",
          label: "VALUE",
        },
      ],
      dataset1: [],
      dataset2: [],
      currentDataset: [],
      minCurrent: 0,
      maxCurrent: 0,
      minScore: 0,
      maxScore: 0,
    };
    const data = reactive({
      tableData: [],
      score: "-",
      currentDatasetId: 0, // current Dataset ID
      starting: false, // is the process running
      monitors: [
        // monitors config
        {
          title: "Motor_Current",
          current: "-",
          hint: 100,
        },
        {
          title: "Brake_Current",
          current: "-",
          hint: 5,
        },
        {
          title: "Safety_Current",
          current: "-",
          hint: 5,
        },
        {
          title: "Door_Current",
          current: "-",
          hint: 5,
        },
      ],
    });
    // methods
    const datasetOnLoad = (id) => {
      if (
        config.dataset1 &&
        config.dataset1.length !== 0 &&
        config.dataset2 &&
        config.dataset2.length !== 0
      ) {
        data.currentDatasetId = id;
        ElMessage({
          message: `Dataset${id} Loaded.`,
          type: "success",
        });
      } else {
        ElMessage({
          message: `Dataset does not exist.`,
          type: "error",
        });
      }
    };
    const startOnClick = () => {
      if (data.currentDatasetId != 0 && config.currentDataset.length !== 0) {
        runMonitor(config.currentDataset.data);
        data.starting = true;
        setTimeout(() => {
          data.starting = false;
          data.score = createRand(
            config.minScore,
            config.maxScore,
            false
          ).toFixed(1);
          // create a random score
          data.tableData[0]["VALUE"] = data.score;
        }, RUNNING_TIME);
      } else {
        ElMessage({
          message: `No Dataset loaded now.`,
          type: "error",
        });
      }
    };
    const createRand = (min, max, isSymb) => {
      let symb = 1; //
      if (isSymb) {
        symb = Math.random() > 0.5 ? -1 : +1;
      }
      return symb * (Math.random() * (max - min) + min);
    };
    const setCurrent = (id, i) => {
      // monitor's id, data's id
      let monitorTitle = data.monitors[id].title;
      data.monitors[id].current = (
        parseFloat(config.currentDataset.data[i][monitorTitle]) +
        createRand(config.minCurrent, config.maxCurrent, true)
      ).toFixed(6);
    };
    const runMonitor = (dataset) => {
      for (let i = 0; i < dataset.length; i++) {
        setTimeout(() => {
          data.monitors.forEach((e, index) => {
            setCurrent(index, i);
          });
        }, (i * RUNNING_TIME) / dataset.length);
      }
    };
    const fetchData = () => { // fetch data from server
      axios
        .get("/p2688")
        .then((response) => {
          if (response.status === 200 && response.statusText == "OK") {
            // console.log(response.data);
            let res = response.data;
            data.tableData = res[0];
            config.dataset1 = res[1];
            config.dataset2 = res[2];
          } else {
            ElMessage({
              message: response.status + response.statusText,
              type: "error",
            });
          }
        })
        .catch((err) => {
          ElMessage({
            message: err,
            type: "error",
          });
        });
    };

    watch(
      () => data.currentDatasetId,
      (newValue) => {
        data.score = "-";
        data.monitors.forEach((e, index) => {
          e.current = "-";
        });
        if (data.tableData && data.tableData.length !== 0) {
          data.tableData[0]["VALUE"] = "";
        }
        switch (newValue) {
          case 1: {
            config.minCurrent = DATASET1_MIN_CURRENT;
            config.maxCurrent = DATASET1_MAX_CURRENT;
            config.minScore = DATASET1_MIN_SCORE;
            config.maxScore = DATASET1_MAX_SCORE;
            config.currentDataset = config.dataset1;
            break;
          }
          case 2: {
            config.minCurrent = DATASET2_MIN_CURRENT;
            config.maxCurrent = DATASET2_MAX_CURRENT;
            config.minScore = DATASET2_MIN_SCORE;
            config.maxScore = DATASET2_MAX_SCORE;
            config.currentDataset = config.dataset2;
            break;
          }
          default:
            break;
        }
        console.log(newValue);
      },
      { deep: true, immediate: true }
    );

    onMounted(fetchData);

    return {
      data,
      config,
      datasetOnLoad,
      startOnClick,
    };
  },
};
</script>

<style lang="scss" scoped>
#header {
  height: 10vh;
}

#body {
  height: 90vh;
}

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
