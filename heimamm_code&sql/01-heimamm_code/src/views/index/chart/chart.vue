<template>
  <div class="chart-container">
    <el-card class="chart-header">
      <ul class="circle-box">
        <li class="circle-item">
          <div class="circle primary">{{dataTitle.increment_users}}</div>
          <span>今日新增用户</span>
        </li>
        <li class="circle-item">
          <div class="circle primary">{{0}}</div>
          <span>用户总量</span>
        </li>
        <li class="circle-item">
          <div class="circle warning">{{dataTitle.total_users}}</div>
          <span>新增试题</span>
        </li>
        <li class="circle-item">
          <div class="circle warning">{{dataTitle.total_questions}}</div>
          <span>总试题量</span>
        </li>
        <li class="circle-item">
          <div class="circle success">{{dataTitle.total_done_questions}}</div>
          <span>总刷题量</span>
        </li>
        <li class="circle-item">
          <div class="circle success">{{dataTitle.personal_questions}}</div>
          <span>人均刷题量</span>
        </li>
      </ul>
    </el-card>
    <el-card class="chart-main">
      <div class="main"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import { dataTitle, dataEnterprise } from '@/api/chart.js'
export default {
  name: 'chart',
  data() {
    return {
      // 面板数据列表
      dataTitle: {}
    }
  },
  methods: {
    // 声明发送获取面板数据
    getDataTitle() {
      dataTitle().then(res => {
        if (res.code === 200) {
          this.dataTitle = res.data
        } else {
          return this.$message.warning(res.message)
        }
      })
    },
    // 声明发送获取企业题目统计数据
    getDataEnterprise() {
      dataEnterprise().then(res => {
        // 企业题目统计数据
        let enterpriseList = []
        // 企业题目名称
        let enterpriseName = []
        if (res.code === 200) {
          enterpriseList = res.data
          res.data.forEach(item => {
            enterpriseName.push(item.name)
          })
        }
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.querySelector('.main'))
        let option = {
          title: {
            text: '整体数据',
            left: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            data: enterpriseName
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              color: ['#f76137', '#f9b358', '#409eff', '#68a132', '#55CD78'],
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: enterpriseList
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option)
      })
    }
  },
  created() {
    // 调用数据面板获取面板数据函数
    this.getDataTitle()
    this.$nextTick(() => {
      // 调用企业题目统计数据
      this.getDataEnterprise()
    })
  }
}
</script>

<style lang="less">
.chart-container {
  .circle-box {
    display: flex;
    justify-content: space-around;
    .circle {
      width: 99px;
      height: 99px;
      text-align: center;
      line-height: 99px;
      margin-bottom: 10px;
      font-size: 34px;
      border-radius: 50%;
    }
    .primary {
      color: #0086fa;
      border: 2px solid #0086fa;
    }
    .warning {
      color: #f76137;
      border: 2px solid #f76137;
    }
    .success {
      color: #55cd78;
      border: 2px solid#55CD78;
    }
    span {
      display: block;
      text-align: center;
      font-size: 16px;
      color: #737373;
    }
  }
  .chart-main {
    margin-top: 12px;
    .main {
      width: 100%;
      height: 500px;
    }
  }
}
</style>
