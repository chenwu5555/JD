<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card区域 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row class="row-but">
        <el-col>
          <el-button type="primary" @click="addSort">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <!-- selection-type  是否为多选类型表格 默认为false -->
      <!-- expand-type 是否为 展开行类型表格 默认为false -->
      <!-- show-index 是否显示数据索引 -->
      <!-- show-row-hover 鼠标悬停时，是否高亮 默认为true -->
      <tree-table
              :data="tableData"
              :columns="columns"
              :selection-type="false"
              :expand-type="false"
              show-index
              index-text="#"
              border
              :show-row-hover="false"
            >
            <!-- 是否有效 -->
              <template slot="isOk" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightreen"></i>
                <i v-else class="el-icon-circle-close" style="color:red"></i>
              </template>
              <!-- 排序s -->
              <template slot="order" slot-scope="scope">
                <el-tag v-if="scope.row.cat_level === 0" type="success">一级</el-tag>
                <el-tag v-else-if="scope.row.cat_level ===  1" type="info">二级</el-tag>
                <el-tag v-else-if="scope.row.cat_level === 2" type="warning">三级</el-tag>
              </template>
              <!-- 操作 -->
              <template slot="opt"  slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="modifyClick(scope.row.cat_id)">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(scope.row.cat_id)">删除</el-button>
              </template>
      </tree-table>
       <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类按钮 对话框-->
      <el-dialog
        title="添加分类"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addClose"
        >
        <el-form :model="addForm" :rules="addRules" ref="addRuleFormRef" label-width="100px" >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <!--  clearable 是否清空选项 默认false -->
          <el-form-item label="父级分类">    
                <el-cascader
                  v-model="selectedKeys"
                  :options="getParentList"
                  :props="cascaderProps"
                  @change="handleChange"
                  clearable
                >
                </el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false" >取 消</el-button>
          <el-button type="primary" @click="addClick">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑修改分类  按钮 -->
      <el-dialog
        title="修改分类"
        :visible.sync="modifyDialogVisible"
        width="50%"
      >
        <el-form ref="modifyFormRef" :model="modifyForm" :rules="modifyFormRules"  label-width="100px">
          <el-form-item label="分类名称">
            <el-input v-model="modifyForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="modifyDialogVisible = false" @close="modifyClose">取 消</el-button>
          <el-button type="primary" @click="addModify">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cate",
  data() {
    return {
      //保存到获取的数组 商品管理列表数据 默认为空
      tableData:[],
      // 查询条件
      queryInfo:{
        type:3,
        // 当前的页码数
        pagenum:1,
        // 当前每页显示多少条数据
        pagesize:5
      },
      // 获取到的总条数
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:"分类名称",
          prop:"cat_name"
        },
        {
          label:"是否有效",
          // 表示，将当前列定义为模板列
          type:"template",
          // 表示当前这一列使用模板名称
          template:"isOk"
        },
        {
          label:"排序",
          // 表示，将当前列定义为模板列
          type:"template",
          // 表示当前这一列使用模板名称
          template:"order"
        },
        {
          label:"操作",
          type:"template",
          template:"opt"
        }
      ],
      // 添加分类对话框的显示与隐藏
      addDialogVisible:false,
      // 绑定添加分类输入框的文本
      addForm:{
        // 将要添加的分类的名称
        cat_name:"",
        // 父级分类的id
        cat_pid:0,
        // 父级分类等级
        cat_level:0
      },
      // 添加分类表单的验证规则对象
      addRules:{
        cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 获取到父级分类的数据列表
      getParentList:[],
      // 数据的配置信息
      cascaderProps:{
        //可以选中一级内容
				checkStrictly:true,
        //指定触发方式
        expandTrigger: 'hover',
				//数据源parantList中的cat_id做数据绑定
				value:'cat_id',
				//数据源parantList的cat_name渲染出来的内容
				label:'cat_name',
				//数据源parantList的children做嵌套
				children:'children'
      },
      //选中项的cat_id数组
			selectedKeys:[],
      // 编辑修改对话框的显示与隐藏
      modifyDialogVisible:false,
      // 绑定编辑修改对话框的表单内容
      modifyForm:{
        cat_name:"",
        cat_id:""
      },
      // 修改编辑表单的校验规则
      modifyFormRules:{
         cat_name:[
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    // 页面挂载时获取到商品管理列表数据
    this.getProductList()
  },
  methods: {
   async getProductList() {
    const {data:res} =  await this.$http.get("/categories",{params:this.queryInfo})
      if(res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }else{
        this.$message.success("获取商品分类列表成功")
        // console.log(res.data);
        // 因为获取的res.data是一个对象
        // 把数据赋值给tableData
        this.tableData = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
      }
    },
    // 监听每条的页数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getProductList()
    },
    // 监听当前页码值
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getProductList()
    },
    // 点击添加分类按钮 弹出对话框
    addSort() {
      // 现获取父级分类的数据列表
      this.getParentCateList()
      // 再展开对话框
      this.addDialogVisible = true
    },
    // 获取父级分类的数据列表
   async getParentCateList() {
      const {data:res}  = await this.$http.get("categories",{params:{type:2}})
       if(res.meta.status !== 200) {
        return this.$message.error("获取商品分类列表失败");
      }else{
        this.$message.success("获取商品分类列表成功")
        // console.log(res.data);
        this.getParentList = res.data           
      }
    },
    // 选择项发生变化触发这个函数，返回改变之后的值
    handleChange() {
     console.log(this.selectedKeys);
    //  如果 selectedKeys 数组中的length 大于0 ，证明选中的父级分类
    // 反之，就说明没有选中任何父级分类
        if(this.selectedKeys.length>0){
          // 父级分类的id
          this.addForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
          // 为当前分类的等级赋值
          this.addForm.cat_level = this.selectedKeys.length
        }else{
          // 父级分类的id
          this.addForm.cat_pid = 0
          // 为当前分类的登记赋值
          this.addForm.cat_level = 0
        }
        
    },
    // 点击确定按钮，保存选定数据
    addClick() {
    //  console.log(this.addForm);
    // 点击确定后，校验表单数据，并发送请求
    this.$refs.addRuleFormRef.validate((async valid=>{
      if(!valid) return 
      const {data:res} = await this.$http.post("categories",this.addForm)
        if(res.meta.status !== 201) return this.$message.error("添加数据失败")
        this.$message.success("添加数据成功")
        this.getProductList()
        this.addDialogVisible = false
    }))
    },
    // 监听对话框的关闭事件，重置表单数据
    addClose(){
      this.$refs.addRuleFormRef.resetFields()
      this.selectedKeys = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 修改编辑对话框事件
    async modifyClick(id) {
      this.modifyDialogVisible = true

      const {data:res} = await this.$http.get("categories/"+id)
      if(res.meta.status !==200) return this.$message.error("获取父级分类数据失败")
      this.$message.success("获取父级分类数据成功")
      // 将获取到的数据赋值给modifyForm
      this.modifyForm = res.data
    },
    // 点击保存修改之后的数据
    addModify() {
      this.$refs.modifyFormRef.validate((async valid=>{
          if(!valid) return
        const {data:res} = await this.$http.put("categories/"+this.modifyForm.cat_id,{
            cat_name:this.modifyForm.cat_name
          })
          if(res.meta.status !== 200) return this.$message.error("修改数据失败")
          this.$message.success("修改数据成功")
          this.modifyDialogVisible = false
          this.getProductList()
      }))
    },
    // 点击编辑对话框 取消按钮 重置表单
    modifyClose() {
      this.$refs.modifyFormRef.resetFields()
    },
    // 删除分类
    async deleteClick(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).catch(err=>{
         return err
       })
      //  console.log(confirmResult);
      if(confirmResult !== "confirm"){
        return this.$message.info("已取消删除")
      }
      console.log("以确认删除");
        const {data:res} = await this.$http.delete("categories/"+id)
        if(res.meta.status !== 200) return this.$message.error("删除失败")
        this.$message.success("删除成功")
        this.getProductList()
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card{
  margin-top: 30px;
}
.row-but{
  margin-bottom: 10px;
}
.el-pagination{
  margin-top: 15px;
}
.addInput{
  margin-left: 20px;
}
.el-cascader{
  width: 100%;
}
</style>