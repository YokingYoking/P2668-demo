<template>
  <el-container id="layout">
    <el-header id="header">
      <h2>IEEE P2668 for Lift Safety</h2>
    </el-header>
    <el-container id="body">
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
          <el-button @click="datasetOnLoad(1)">Test Dataset 1</el-button>
          <el-button @click="datasetOnLoad(2)">Test Dataset 2</el-button>
          <el-button
            type="primary"
            id="start-btn"
            @click="startOnClick()"
            :disabled="starting"
            >START</el-button
          >
        </div>
      </el-main>
      <el-aside id="aside">
        <el-upload action="" :on-change="handleChange" :auto-upload="false">
          <el-button size="small" type="primary">Upload</el-button>
        </el-upload>
        <el-table :data="tableData" border style="width: 100%" max-height="600">
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
import * as XLSX from "xlsx";
import { ElMessage } from "element-plus";
import axios from "axios";
axios.defaults.baseURL = "http://127.0.0.1:5000";

// import { reactive } from "vue";

export default {
  name: "App",
  components: {
    Monitor,
  },
  data() {
    return {
      monitors: [
        // monitors config
        {
          title: "Motor Current",
          current: "-",
          hint: 100,
        },
        {
          title: "Brake Current",
          current: "-",
          hint: 5,
        },
        {
          title: "Safety Current",
          current: "-",
          hint: 5,
        },
        {
          title: "Door Current",
          current: "-",
          hint: 5,
        },
      ],
      columns: [
        // table config
        {
          prop: "FINDEX",
          label: "FINDEX",
        },
        {
          prop: "FIELD NAME",
          label: "FIELD NAME",
        },
        {
          prop: "DESCRIPTION",
          label: "DESCRIPTION",
        },
        {
          prop: "DATA TYPE",
          label: "DATA TYPE",
        },
        {
          prop: "VALUE",
          label: "VALUE",
        },
      ],
      score: "-",
      dataset1: [],
      dataset2: [],
      currentDataset: [],
      currentDatasetId: 0, // current Dataset ID
      tableData: [],
      starting: false, // is the process running
      minCurrent: 0,
      maxCurrent: 0,
      minScore: 0,
      maxScore: 0,
    };
  },
  watch: {
    currentDatasetId(val) {
      let _this = this;
      this.score = "-";
      this.monitors.forEach((e) => {
        e.current = "-";
      });
      if (this.tableData && this.tableData.length !== 0) {
        this.tableData[0]["VALUE"] = "";
      }
      switch (val) {
        case 1: {
          _this.minCurrent = DATASET1_MIN_CURRENT;
          _this.maxCurrent = DATASET1_MAX_CURRENT;
          _this.minScore = DATASET1_MIN_SCORE;
          _this.maxScore = DATASET1_MAX_SCORE;
          _this.currentDataset = _this.dataset1;
          break;
        }
        case 2: {
          _this.minCurrent = DATASET2_MIN_CURRENT;
          _this.maxCurrent = DATASET2_MAX_CURRENT;
          _this.minScore = DATASET2_MIN_SCORE;
          _this.maxScore = DATASET2_MAX_SCORE;
          _this.currentDataset = _this.dataset2;
          break;
        }
        default:
          break;
      }
      console.log(val);
    },
  },
  setup() {
    axios.get("/p2688").then(function (response) {
      console.log(response.data);
      console.log(response.status);
      console.log(response.statusText);
      console.log(response.headers);
      console.log(response.config);
    });
  },
  methods: {
    handleChange(file) {
      this.importfxx(file.raw); // import xlsx
    },
    datasetOnLoad(id) {
      if (
        this.dataset1 &&
        this.dataset1.length !== 0 &&
        this.dataset2 &&
        this.dataset2.length !== 0
      ) {
        this.tableData = this.temp; // set current tableData
        this.currentDatasetId = id;
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
    },
    startOnClick() {
      let _this = this;
      if (this.currentDatasetId != 0 && this.currentDataset.length !== 0) {
        _this.runMonitor(_this.currentDataset);
        _this.starting = true;
        setTimeout(() => {
          _this.starting = false;
          _this.score = _this
            .createRand(_this.minScore, _this.maxScore, false)
            .toFixed(1); // create a random score
          // console.log(_this.score);
          _this.tableData[0]["VALUE"] = _this.score;
        }, RUNNING_TIME);
      } else {
        ElMessage({
          message: `No Dataset loaded now.`,
          type: "error",
        });
      }
    },
    createRand(min, max, isSymb) {
      let symb = 1; //
      if (isSymb) {
        symb = Math.random() > 0.5 ? -1 : +1;
      }
      return symb * (Math.random() * (max - min) + min);
    },
    setCurrent(id, i) {
      // monitor's id, data's id
      let _this = this;
      let monitorTitle = _this.monitors[id].title + "(A)";
      _this.monitors[id].current = (
        _this.currentDataset[i][monitorTitle] +
        this.createRand(_this.minCurrent, _this.maxCurrent, true)
      ).toFixed(6);
    },
    runMonitor(dataset) {
      let _this = this;
      for (let i = 0; i < dataset.length; i++) {
        setTimeout(() => {
          _this.monitors.forEach((e, index) => {
            this.setCurrent(index, i);
          });
        }, (i * RUNNING_TIME) / dataset.length);
      }
    },
    importfxx(obj) {
      let _this = this;
      let f = obj;
      let reader = new FileReader();
      FileReader.prototype.readAsBinaryString = function (f) {
        let binary = "";
        let reader = new FileReader();
        reader.onload = function () {
          var bytes = new Uint8Array(reader.result);
          var length = bytes.byteLength;
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }

          let wb = XLSX.read(binary, {
            type: "binary",
          });

          let dataset1 = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // import dataset1
          _this.dataset1 = dataset1;
          let dataset2 = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[1]]); // import dataset 2
          _this.dataset2 = dataset2;
          let tableData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[2]]); // import DIS
          _this.temp = tableData;
        };
        reader.readAsArrayBuffer(f);
      };

      reader.readAsBinaryString(f);
    },
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
