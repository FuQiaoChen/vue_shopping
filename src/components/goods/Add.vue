<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-cart>
            <el-alert
                title="添加商品信息"
                type="info"
                effect="dark"
                center
                :closable="false"
            >
            </el-alert>
            <el-steps
                :space="200"
                :active="activeIndex - 0"
                finish-status="success"
                align-center
            >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成任务"></el-step>
            </el-steps>
            <el-form
                :model="addForm"
                :rules="addFormRules"
                ref="ruleFormRef"
                label-position="top"
            >
                <el-tabs
                    :tab-position="'left'"
                    v-model="activeIndex"
                    :before-leave="beforeTabLeave"
                    @tab-click="tabClick"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cascaderProps"
                                @change="CateChange"
                                clearable
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key='i' border></el-checkbox>                          
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                         <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
                             <el-input v-model="item.attr_vals"></el-input>
                         </el-form-item>    
                    </el-tab-pane >
                    <el-tab-pane label="商品图片" name="3" >
                        <!-- action为图片上传的API地址 -->
                        <el-upload 
                            :action='uploadURL'
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headersOBJ"
                            :on-success='handleSuccess'>
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane >
                    <el-tab-pane label="商品内容" name="4" >角色管理</el-tab-pane
                    >
                </el-tabs>
            </el-form>
        </el-cart>
    </div>
    <!-- 图片预览弹窗 -->
    <el-dialog
        title="图片预览"
        v-model="previewVisible"
        width="50%">
        <img :src="previewPath" alt="" class="previewImg">
        
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            activeIndex: "0",
            addForm: {
                goods_name: "",
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                goods_cat: [],
                pics:[],
                goods_introduce:''
            },
            addFormRules: {
                goods_name: [
                    {
                        required: true,
                        message: "请输入商品名称",
                        trigger: "blur",
                    },
                ],
                goods_price: [
                    {
                        required: true,
                        message: "请输入商品价格",
                        trigger: "blur",
                    },
                ],
                goods_weight: [
                    {
                        required: true,
                        message: "请输入商品重量",
                        trigger: "blur",
                    },
                ],
                goods_number: [
                    {
                        required: true,
                        message: "请输入商品数量",
                        trigger: "blur",
                    },
                ],
                goods_cat: [
                    {
                        required: true,
                        message: "请选择商品分类",
                        trigger: "blur",
                    },
                ],
            },
            cateList: [],
            cascaderProps: {
                expandTrigger: "hover",
                value: "cat_id",
                label: "cat_name",
                children: "children",
            },
            manyTabData: [],
            onlyTabData: [],
            uploadURL:"http://127.0.0.1:8888/api/private/v1/upload",
            //设置图片上传的请求头
            headersOBJ:{Authorization:window.sessionStorage.getItem("token")},
            previewPath:'',
            previewVisible:false,            
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get("categories")
            if (res.meta.status !== 200) {
                return this.$message.error("获取商品分类列表失败")
            }
            this.cateList = res.data
        },
        //级联选择框变化触发方法
        CateChange() {
            if (this.addForm.goods_cat === null) {
                this.addForm.goods_cat = []
                return
            }
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
                return
            }
        },
        beforeTabLeave(activeName, oldActiveName) {
            if (this.addForm.goods_cat.length !== 3 && oldActiveName === "0") {
                this.$message.error("请先选择商品分类")
                return false
            }
        },
        //通过判断activeIndex的值来请求动态或静态参数 并将attr_vals转化为数组
        async tabClick() {
            console.log(this.activeIndex)
            if (this.activeIndex === "1") {
                const { data: res } = await this.$http.get(
                    `categories/${this.addForm.goods_cat[2]}/attributes`,
                    {
                        params: { sel: "many" },
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error("获取参数列表失败")
                }
                res.data.forEach((item) => {
                    item.attr_vals = item.attr_vals
                        ? item.attr_vals.split(" ")
                        : []
                })
                this.manyTabData = res.data
            }

            if (this.activeIndex === "2") {
                const { data: res } = await this.$http.get(
                    `categories/${this.addForm.goods_cat[2]}/attributes`,
                    {
                        params: { sel: "only" },
                    }
                )
                if (res.meta.status !== 200) {
                    return this.$message.error("获取参数列表失败")
                }
                res.data.forEach((item) => {
                    item.attr_vals = item.attr_vals
                        ? item.attr_vals.split(" ")
                        : []
                })
                this.onlyTabData = res.data
            }
        },
        // 图片预览
        handlePreview(file){
            this.previewPath=file.response.data.url
            this.previewVisible=true
        },
        // 图片移除操作
        handleRemove(file){
            const filePath=file.response.data.tmp_path
            const i=this.addForm.pics.findIndex(x=>x===filePath)
            this.addForm.pics.splice(i,1)
            //  console.log(this.addForm)
        },
        // 图片上传完成后操作
        handleSuccess(response){
            // console.log(response);
            const picInfo={pic:response.data.tmp_path}
            this.addForm.pics.push(picInfo)
            // console.log(this.addForm)
        }

    },
}
</script>

<style scoped>
.el-steps {
    margin-top: 30px;
}
.el-tabs {
    margin-top: 25px;
}
.el-checkbox{
     margin:0 5px 0 0;     
}
.el-button+.el-button, .el-checkbox.is-bordered+.el-checkbox.is-bordered {
    margin-left: 0px;
}
.previewImg{
    width: 100%;
}
</style>