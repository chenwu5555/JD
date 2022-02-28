<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择器 -->
          <!-- show-all-levels 是否选择完整路径 默认为true ，flase 之后会选最后一项 -->
          <el-cascader
            v-model="selectId"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- Tabs标签页  -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData"  border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 展开后循环Tab标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable >
                  {{item}}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 点击切换成输入框 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                 <el-button class="el-icon-edit" type="primary" size="mini" @click="modifPyarameters(scope.row.attr_id)">修改</el-button>
                  <el-button class="el-icon-delete" type="danger" size="mini" @click="deleteClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的按钮 -->
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData"  border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand" >
              <template slot-scope="scope">
                <!-- 循环的Tab标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable>{{item}}</el-tag>
                 <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 点击切换成输入框 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                 <el-button class="el-icon-edit" type="primary" size="mini" @click="modifPyarameters(scope.row.attr_id)" @close="modifyClose">修改</el-button>
                  <el-button class="el-icon-delete" type="danger" size="mini" @click="deleteClick(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加动态/静态参数的对话框 -->
    <el-dialog
      :title="'添加'+titleTab"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addClose"
    >
    <el-form  ref=addFormRef :model="addForm" :rules="addFormRules"  label-width="100px">
      <el-form-item :label="titleTab" prop="attr_name">
        <el-input v-model="addForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClick" >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框 -->
    <el-dialog
      :title="'修改'+titleTab"
      :visible.sync="modifyDialogVisible"
      width="50%"
    >
    <el-form ref="modifyRef" :model="modifyForm" :rules="modifyRules" label-width="100px">
      <el-form-item :label="titleTab" prop="attr_name">
        <el-input v-model="modifyForm.attr_name"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" >
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "params",
  data() {
    return {
      // 商品分类列表数组
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        // value:'cat_id',
        // lable:'cat_name',
        // children:'children',

        value: "cat_id",
        //数据源parantList的cat_name渲染出来的内容
        label: "cat_name",
        //数据源parantList的children做嵌套
        children: "children",
        //  expandTrigger: 'hover',
      },
      // 级联选择器双向绑定到的数组 选中的id值
      selectId: [],
      // 被激活的页签名称
      activeName: "many",
      // 接受获取的参数
      parameter: [],
      // 接受many动态参数数据
      manyTableData: [],
      // 接受only静态属性数据
      onlyTableData: [],
      // 控制动态参数显示与隐藏的
      addDialogVisible:false,
      // 双向绑定表单数据
      addForm:{
        attr_name:"",
        // goods_price:'',
        // goods_number:"",
        // goods_weight:"",
        // goods_introduce:"",
      },
      // 添加动态静态参数的校验规则对象
      addFormRules:{
        attr_name:[
         { required: true, message: '请输入分类名称', trigger: 'blur' },
         { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 控制修改参数的对话框显示与隐藏
      modifyDialogVisible:false,
      // 双向绑定修改参数的数据
      modifyForm:{
        attr_name:"",
        attr_id:""
      },
      // 校验修改表单之后的数据规则
      modifyRules:{
         attr_name:[
           { required: true, message: '请输入分类名称', trigger: 'blur' },
           { min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur' }
         ]
      },
      // directives: {
      //   focus: {
      //     inserted: function(el) {
      //       el.children[0].focus();
      //     },
      //   }
      // }

    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isBtnDisabled() {
      // 如果按钮需要禁用，则返回true，否则返回false
      if (this.selectId.length !== 3) {
        return true;
      } else {
        return false;
      }
    },
    // 获取第三级的id
    categoriesId() {
      if (this.selectId.length === 3) {
        return this.selectId[2];
      } else {
        return null;
      }
    },
    // 区分动态静态的对话框标题
    titleTab() {
      if(this.activeName === "many"){
        return "动态参数"
      }else{
        return "静态属性"
      }
    }
  },
  methods: {
    // 获取商品分类列表    getParamsData
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取分类列表失败");
      this.$message.success("获取分类列表成功");
      this.cateList = res.data;
    },
    // 级联选择框选中项发生改变，触发这个函数
    handleChange() {
      this.getParamsData();
    },
    // Tab 页签点击事件的处理函数
    handleClick() {
      // console.log(this.activeName);
      // 切换面板的时候，清空级联选择器里面的id
      this.getParamsData();
    },

    // 获取参数的列表数据
    async getParamsData() {
      // 证明选中的不是三级分类
      if (this.selectId.length !== 3) {
        this.selectId = [];
        return;
      }
      // 证明是选中的三级分类
      // console.log(this.selectId);
      // 根据所选分类的id，和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(
        `categories/${this.categoriesId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) return this.$message.error("获取参数失败");
      this.$message.success("获取参数成功");
       this.parameter = res.data

      // 循环出数据里面每一下项的attr_vals,
      // 并且为每一项绑定一个单独的 inputVisible 和 inputValue
      // 用于判断
      res.data.forEach(item=>{
        item.attr_vals = item.attr_vals.split("")
        // 控制按钮与文本框的切换
        item.inputVisible = false
        // 双向绑定文本输入框的数据
        item.inputValue = ""
      })
      console.log(res.data);

      if (this.activeName === "many") {
        this.manyTableData = res.data;
        // console.log(this.manyTableData);
      } else {
        this.onlyTableData = res.data;
      }
    },
    // 点击确定，校验表单
    addClick() {
      this.$refs.addFormRef.validate((async valid=>{
        if(!valid) return
       const {data:res} = await this.$http.post(`categories/${this.categoriesId}/attributes`,{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
         if(res.meta.status !== 201) return this.$message.error("添加失败")
         this.$message.success("添加成功")
         this.getParamsData()
         this.addDialogVisible = false
      }))
    },
      // 添加参数完成之后，清空表单数据
    addClose(){
      // console.log("清空");
      this.$refs.addFormRef.resetFields()
    },
    // 修改动态参数
    async modifPyarameters(id) {
      this.modifyDialogVisible = true
      const {data:res} = await this.$http.get(`categories/${this.categoriesId}/attributes/${id}`)
      if(res.meta.status !== 200) return this.$message.error("获取数据失败")
      this.$message.success("获取数据成功")
      this.modifyForm = res.data
    },
    // 重置修改的表单
    modifyClose() {
      this.$refs.modifyRef.resetFields()
    },
    // 点击修改好之后的确定按钮，请求修改数据
    modifyClick() {
      this.$refs.modifyRef.validate((async valid=>{
        if(!valid) return 
        // console.log("过来了");
        const {data:res} = await this.$http.put(`categories/${this.categoriesId}/attributes/${this.modifyForm.attr_id}`,
        {attr_name:this.modifyForm.attr_name,attr_sel:this.activeName})
        if(res.meta.status !== 200) return this.$message.error("修改数据失败")
        this.$message.success("修改数据成功")
        this.getParamsData()
        this.modifyDialogVisible = false
      }))
    },
    // 根据id删除对应的参数项
    async deleteClick(id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
       }).catch(err=>{
         return err
       })
        if(confirmResult !== "confirm"){
          return this.$message.info("已取消删除")
        }
        console.log("以确认删除");
        const {data:res} = await this.$http.delete(`categories/${this.categoriesId}/attributes/${id}`)
          if(res.meta.status !== 200) this.$message.error("删除参数失败")
          this.$message.success("删除参数成功")
          this.getParamsData()

    },
    // 点击按钮展示文本输入框 
    showInput(row) {
      console.log(row)
      row.inputVisible = true
      console.log(row.inputVisible);
      // $nextTick 方法的作用：就是当页面上的元素被重新
      // 渲染之后，才会指定为回调函数中的代码
      // this.$nextTick(()=>{
      //   this.$refs.saveTagInput.$refs.input.focus()
      // })
      
    },
    // 文本失去焦点，或者摁下Enter都会触发
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0){
        row.inputValue = ""
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
       row.inputValue = ''
       row.inputVisible = false
       
      // 如果没有return 则证明输入内容，需要做后续处理
    }
  },
};
</script>

<style lang="scss" scoped>
.el-card {
  margin-top: 15px;
}
.el-row {
  margin-top: 15px;
  font-size: 15px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag{
  width: 120px;
}
</style>