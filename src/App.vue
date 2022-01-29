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
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-table :data="tableData" border style="width: 100%;" max-height="500">
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

import Monitor from "@/components/Monitor/index.vue";
import * as XLSX from "xlsx";
// import { ElMessage } from 'element-plus';
// import { reactive } from "vue";

export default {
  name: "App",
  components: {
    Monitor,
  },
  data() {
    return {
      monitors: [ // monitors config
        {
          title: "Motor Current",
          current: '-',
          hint: 100,
        },
        {
          title: "Brake Current",
          current: '-',
          hint: 5,
        },
        {
          title: "Safety Current",
          current: '-',
          hint: 5,
        },
        {
          title: "Door Current",
          current: '-',
          hint: 5,
        },
      ],
      columns: [ // table config
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
      score: '-',
      dataset1: [],
      dataset2: [],
      currentDataset: 0,
      tableData: [],
      starting: false, // is the process running
    };
  },
  methods: {
    handleChange(file) {
      this.importfxx(file.raw); // import xlsx
    },
    datasetOnLoad(id) {
      this.tableData = this.temp; // set current tableData
      console.log(this.tableData);
      this.currentDataset = id;
      // ElMessage({
      //   message: 'Dataset1 Loaded.',
      //   type: 'success',
      // })
    },
    startOnClick() {
      let _this = this;
      if (this.currentDataset != 0) {
        switch(_this.currentDataset) {
          case 1: {
            _this.runMonitor(_this.dataset1);
            break;
          }
          case 2: {
            _this.runMonitor(_this.dataset2);
            break;
          }
          default: break;
        }
        _this.starting = true;
        setTimeout(() => {
          _this.starting = false;
          _this.score = (Math.random() * 0.3 + 3.5).toFixed(1); // create a random score
          console.log(_this.score)
          _this.tableData[0]["VALUE"] = _this.score;
        }, RUNNING_TIME);
      }
    },
    createRand(min, max) {
      let symb = Math.random() > 0.5 ? -1 : +1;
      return symb * (Math.random() * (max - min) + min);
    },
    setCurrent(id, i, dataset) { // monitor's id, data's id
     let _this = this;
    let min = 0;
    let max = 1;
    if(_this.currentDataset === 1) {
      min = DATASET1_MIN_CURRENT;
      max = DATASET1_MAX_CURRENT;
    } else if (_this.currentDataset === 2) {
      min = DATASET2_MIN_CURRENT;
      max = DATASET2_MAX_CURRENT;
    } else {
      min = 0;
      max = 1;
    }
     
      let monitorTitle =  _this.monitors[id].title + "(A)";
        _this.monitors[id].current = (
            dataset[i][monitorTitle] + this.createRand(min, max)
          ).toFixed(6);
    },
    runMonitor(dataset) {
      let _this = this;
      for (let i = 0; i < dataset.length; i++) {
        setTimeout(() => {
          _this.monitors.forEach((e, index) => {
            this.setCurrent(index, i, dataset)
          })
        }, i * RUNNING_TIME / dataset.length);
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
