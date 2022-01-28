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
          <el-button type="primary" id="start-btn" @click="startOnClick()"
            >START</el-button
          >
        </div>
      </el-main>
      <el-aside id="aside">
        <el-upload action="" :on-change="handleChange" :auto-upload="false">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
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
import * as XLSX from "xlsx";
import { reactive } from "vue";

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
          prop: "value",
          label: "VALUE",
        },
      ],
      score: 0.1,
      file: {},
      temp: [],
    };
  },
  methods: {
    handleChange(file) {
      this.file = file.raw;
    },
    startOnClick() {
      this.importfxx(this.file);
      console.log(this.temp);
      this.tableData[0] = this.temp[0];
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

          let outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[2]]); //outdata就是你想要的东西
          console.log(outdata);
          _this.temp = outdata;
          // console.log(_this.tableData);
        };
        console.log('sda');
        reader.readAsArrayBuffer(f);
      };

      reader.readAsBinaryString(f);
    },
  },

  mounted() {
    // console.log(this.tableData); // 是一个proxy
  },
  setup() {
    const tableData = reactive([
      {
        FINDEX: "1",
        "FIELD NAME": "Data Accuracy IDex",
        DESCRIPTION: "Data Accuracy Level",
        "DATA TYPE": "UInt32",
        VALUE: "",
      },
      {
        FINDEX: "1",
        "FIELD NAME": "Data Accuracy IDex",
        DESCRIPTION: "Data Accuracy Level",
        "DATA TYPE": "UInt32",
        VALUE: "",
      },
      {
        FINDEX: "1",
        "FIELD NAME": "Data Accuracy IDex",
        DESCRIPTION: "Data Accuracy Level",
        "DATA TYPE": "UInt32",
        VALUE: "",
      },
      {
        FINDEX: "1",
        "FIELD NAME": "Data Accuracy IDex",
        DESCRIPTION: "Data Accuracy Level",
        "DATA TYPE": "UInt32",
        VALUE: "",
      },
    ]);
    return {
      tableData,
    };
  },
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
