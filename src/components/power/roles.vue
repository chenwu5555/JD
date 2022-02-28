<template>
  <!-- 角色列表部分 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡视图片区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <!-- expand 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightByid(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                  >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级,三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环来嵌套二级权限 -->
                <!-- closable 删除小图标 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightByid(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      :class="['bdbottom', i3 === 0 ? 'bdtop' : '']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightByid(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <pre>
                 {{ scope.row }}
              </pre
            >
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-tag type="success">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="editClick(scope.id)">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialong(scope.row)"
              >
                分配权限</el-button
              >
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="closeDefkeys"
    >
      <!-- 树形控件 -->
      <!-- default-expand-all 是否展开所有节点 默认为false -->
      <!-- show-checkbox 节点是否可被选择  默认为false --> 
      <!-- :props 里面是写上树形嵌套的属性 -->
      <!-- default-checked-keys 默认勾选的节点的key的数组 -->
      <div class="dialogTree-box">
          <el-tree
          :data="rightsList"
          :props="treeProps"
          show-checkbox
          default-expand-all
          :default-checked-keys="defkeys"
          node-key="id"
          ref="treeRef"
        ></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click="allotRighrs"
        >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改状态的对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="editDialogVisible"
      width="50%"
    >
    <el-form :model="rolesFrom" :rules="editFormRules" ref="editFormRef" label-width="70px" >
        <el-form-item label="角色名称" >
          <el-input v-model="rolesFrom.roleName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="roleDesc">
          <el-input v-model="rolesFrom.roleDesc"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button 
          type="primary" 
          @click="editRighrs"
        >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roles",
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 角色列表表单数据对象
      rolesFrom: {
        roleName: "",
        roleDesc: "",
      },
      // 控制分配权限的对话框显示与隐藏
      setRightDialogVisible: false,
      // 获取到的权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点id数组
      defkeys:[],
      // 当前即将分配权限的角色id
      roleId:"",
      // 编辑角色信息的对话框
      editDialogVisible:false,
      editFormRules:{},
    };
  },
  // 页面加载前立即获取到角色列表
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    // 根据ID删除对应的权限
    async removeRightByid(role, rightId) {
      //  弹框提示用户是否需要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      console.log(confirmResult);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      // console.log("已确认删除");
      // 发送删除个人权限请求
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      console.log(res.data);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success("删除权限成功");
      // 避免重新获取，所以不建议用
      // this.getRolesList()

      // 因为res.data已经是当前最新的数据了，所以可以直接赋值
      role.children = res.data;
      console.log('zoudaozheli')
    },
    // 展示分配权限的对话框
    async showSetRightDialong(row) {
      // 打开弹窗前，先请求获取所有权限列表
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      } else {
        this.$message.success("获取权限列表成功");
        // 把获取到的权限数据赋值到rightsList里面去
        this.rightsList = res.data;
        // console.log("nha1"+row)
        // console.log(this.handleTreeData([row]))
        // this.defkeys = this.handleTreeData([row])
        console.log(row,"当前所选的内容");
        // 递归获取三级节点的id
        this.handleTreeData(row,this.defkeys)
      }
      // 拿到当前父节点的id
      this.roleId = row.id
      // console.log("西河四"+this.roleId)
      this.setRightDialogVisible = true;
    },
    // 通过绑定递归的形式。获取角色下所有的三级权限的id，并保存到defkeys数组中去
    // handleTreeData (treeData) {
    //   if (!treeData.length) return []
    //   const result = []
    //   function loop (data) {
    //     data.forEach (item => {
    //       if (item.children) {
    //         loop(item.children)
    //       } else {
    //         result.push(item.id)
    //       }
    //     })
    //   }
    //   loop(treeData)
    //   return result
    // },
    handleTreeData(node,arr){
      // 如果当前node 节点不包括children属性，则为三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item=>{
        this.handleTreeData(item,arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    closeDefkeys() {
      this.defkeys = []
    },

    //点击确定时，为角色分配权限
    // getCheckedKeys() 可以返回被选到的节点的key
    // getHalfCheckedKeys 可以返回被半选到的节点的key
   async allotRighrs() {
     const keys = [
       ...this.$refs.treeRef.getCheckedKeys(),
       ...this.$refs.treeRef.getHalfCheckedKeys()
     ]
    //  console.log(keys)
    const idStr = keys.join(",")
    const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
    if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.$message.success(res.meta.msg)
    this.getRolesList();
    this.setRightDialogVisible = false
   },
   editClick(id){
     console.log(id);
     this.editDialogVisible = true
   },
   editRighrs(){

   },
  },
};
</script>
<style lang="scss" scoped>
.el-breadcrumb {
  margin-top: 15px;
  font-size: 20px;
  box-shadow: 0, 1px, rgba(0, 0, 0, 0.15);
}

.el-card {
  margin-top: 25px;
}
.el-table {
  margin-top: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
.dialogTree-box{
  overflow-y: scroll;
  max-height: 400px;
}
</style>