<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索不好使？？？？？？？？？？ -->
      <el-row :gutter="10">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getOdersList">
            <template #append>
              <el-button icon="el-icon-search" @click="getOdersList"></el-button>
            </template>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="70px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="80px">
          <template #="{ row }">
            <el-tag type="success" v-if="row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-if="row.pay_status === '0'">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80px">
          <template #="{ row }">
            <el-tag type="success" v-if="row.is_send === '是'">已发货</el-tag>
            <el-tag type="danger" v-if="row.is_send === '否'">未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="140px"
          ><template #="{ row }">
            {{ $filters.dateFormat(row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row }">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showModify(row)"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showLocation(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog title="修改地址" v-model="addressVisible" width="50%" @close="modifyAddressDialogclosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1"> <el-cascader :options="cityDataList" :props="cascaderProps" v-model="addressForm.address1"></el-cascader></el-form-item>
        <el-form-item label="详细地址" prop="address2"> <el-input v-model="addressForm.address2"></el-input></el-form-item>
        <el-form-item><h2 style="color:red;">此功能尚未完成</h2></el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addressVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyAddress">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 显示物流进度对话框   接口有问题-->
    <el-dialog title="物流进度" v-model="locationVisible" width="50%" @close="locationDialogclosed">
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in locationInfo" :key="index" :timestamp="activity.time"
          >接口有问题
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../assets/cityData.json'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderList: [],
      addressVisible: false,
      locationVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityDataList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'label',
        children: 'children'
      },
      locationInfo: []
    }
  },
  created() {
    this.getOdersList()
    this.cityDataList = cityData //需要加载Json数据
  },
  methods: {
    async getOdersList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      this.orderList = res.data.goods
      this.total = res.data.total
      // console.log(this.orderList);
    },
    //-------------------分页设置------------------------
    //监听页面范围改变事件
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getOdersList()
    },
    //监听当前页码值改变事件
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getOdersList()
    },
    //-------------------修改地址------------------------
    showModify(row) {
      this.addressVisible = true
    },
    modifyAddressDialogclosed() {
      this.$refs.addressFormRef.resetFields()
    },
    modifyAddress() {
      //此功能未完成，需后续完成
      // console.log(this.addressForm);
      this.addressVisible = false
    },
    //-------------------显示进度------------------------
    async showLocation(row) {
      // const { data: res } = await this.$http.get("/kuaidi/1106975712662")
      // if (res.meta.status !== 200) {
      //     return this.$message.error("获取物流信息失败")
      // }
      // this.locationInfo = res.data

      this.locationVisible = true
    },
    locationDialogclosed() {
      this.locationVisible = true
    }
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100% !important;
}
</style>
