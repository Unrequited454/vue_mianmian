<template>
  <div class="add-question">
    <el-dialog
      title="新增试题"
      :visible.sync="$parent.addDlvisible"
      width="100%"
      top="0"
      center
      :before-close="cancalAdd"
    >
      <!-- 表单区域 -->
      <el-form ref="addQuestionRef" :model="addQuestionForm" :rules="addQuestionRul">
        <el-form-item label="学科" prop="subject">
          <el-select v-model="addQuestionForm.subject" placeholder="请选择学科">
            <el-option
              v-for="(item, index) in $parent.subjectData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段" prop="step">
          <el-select v-model="addQuestionForm.step" placeholder="请选择阶段">
            <el-option label="初级" :value="1"></el-option>
            <el-option label="中级" :value="2"></el-option>
            <el-option label="高级" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="addQuestionForm.enterprise" placeholder="请选择阶段">
            <el-option
              v-for="(item, index) in $parent.enterpriseData"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-cascader
            v-model="addQuestionForm.city"
            :options="cityOptions"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="addQuestionForm.type">
            <el-radio label="1">单选</el-radio>
            <el-radio label="2">多选</el-radio>
            <el-radio label="3">简答</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="addQuestionForm.difficulty">
            <el-radio :label="1">简单</el-radio>
            <el-radio :label="2">一般</el-radio>
            <el-radio :label="3">困难</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider></el-divider>
        <!-- 试题标题区域 -->
        <el-form-item label="试题标题" prop="title"></el-form-item>
        <quill-editor v-model="addQuestionForm.title"></quill-editor>
        <!-- 单选区域 -->
        <el-form-item v-if="addQuestionForm.type === '1'" label="单选" prop="single_select_answer">
          <el-radio-group v-model="addQuestionForm.single_select_answer">
            C
            <div class="raido-box">
              <el-radio label="A">A</el-radio>
              <el-input v-model="addQuestionForm.select_options[0].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleASuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageAUrl" :src="imageAUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="raido-box">
              <el-radio label="B">B</el-radio>
              <el-input v-model="addQuestionForm.select_options[1].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleBSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageBUrl" :src="imageBUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="raido-box">
              <el-radio label="C">C</el-radio>
              <el-input v-model="addQuestionForm.select_options[2].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleCSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageCUrl" :src="imageCUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="raido-box">
              <el-radio label="D">D</el-radio>
              <el-input v-model="addQuestionForm.select_options[3].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleDSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageDUrl" :src="imageDUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-radio-group>
        </el-form-item>
        <!-- 多选区域 -->
        <el-form-item
          v-else-if="addQuestionForm.type === '2'"
          label="多选"
          prop="multiple_select_answer"
        >
          <el-checkbox-group v-model="addQuestionForm.multiple_select_answer">
            <div class="raido-box">
              <el-checkbox label="A">A</el-checkbox>
              <el-input v-model="addQuestionForm.select_options[0].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleASuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageAUrl" :src="imageAUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="raido-box checkbox-radio">
              <el-checkbox label="B">B</el-checkbox>
              <el-input v-model="addQuestionForm.select_options[1].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleBSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageBUrl" :src="imageBUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="raido-box checkbox-radio">
              <el-checkbox label="C">C</el-checkbox>
              <el-input v-model="addQuestionForm.select_options[2].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleCSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageCUrl" :src="imageCUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
            <div class="raido-box checkbox-radio">
              <el-checkbox label="D">D</el-checkbox>
              <el-input v-model="addQuestionForm.select_options[3].text"></el-input>
              <el-upload
                class="avatar-uploader"
                :action="uploadAction"
                :show-file-list="false"
                :on-success="handleDSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="imageDUrl" :src="imageDUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-checkbox-group>
        </el-form-item>
        <!-- 简单区域 -->
        <el-form-item v-else label="简答" prop="short_answer">
          <el-input v-model="addQuestionForm.short_answer" type="textarea"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <!-- 视频上传区域 -->
        <el-form-item label="解析视频">
          <el-upload
            :action="uploadAction"
            :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
            :before-remove="beforeVideoRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传video/mp4文件，且不能超过2MB</div>
          </el-upload>
          <video v-show="isShowVideo" class="video" :src="videoUrl" controls></video>
        </el-form-item>
        <el-divider></el-divider>
        <!-- 答案解析区域 -->
        <el-form-item label="答案解析" prop="answer_analyze"></el-form-item>
        <quill-editor v-model="addQuestionForm.answer_analyze"></quill-editor>
        <el-divider class="divider"></el-divider>
        <!-- 试题备注区域 -->
        <el-form-item label="试题备注" prop="remark">
          <el-input type="textarea" v-model="addQuestionForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancalAdd">取 消</el-button>
        <el-button type="primary" @click="ensureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 导入element-china-area-data
import { regionDataPlus } from 'element-china-area-data'
import { questionAdd } from '@/api/question.js'
export default {
  name: 'add-question',
  data() {
    return {
      // 新增试题表单对象
      addQuestionForm: {
        // 默认选择单选按钮--string
        type: '1',
        // 默认选择简单按钮--int
        difficulty: 2,
        // 级联选择器城市绑定数据
        city: [],
        // 单/多选数据
        single_select_answer: '',
        multiple_select_answer: [],
        // 单选区域
        select_options: [
          {
            label: 'A',
            text: '单选A',
            image: ''
          },
          {
            label: 'B',
            text: '单选B',
            image: ''
          },
          {
            label: 'C',
            text: '单选C',
            image: ''
          },
          {
            label: 'D',
            text: '单选D',
            image: ''
          }
        ],
        // 简单
        short_answer: '',
        // 解析视频地址
        video: ''
      },
      // 表单验证规则
      addQuestionRul: {
        // 学科
        subject: [{ required: true, message: '请选择学科', trigger: 'blur' }],
        // 阶段
        step: [{ required: true, message: '请选择阶段', trigger: 'blur' }],
        // 企业
        enterprise: [{ required: true, message: '请选择企业', trigger: 'blur' }],
        // 城市
        city: [{ required: true, message: '请选择城市', trigger: 'blur' }],
        // 题型
        type: [{ required: true, message: '请选择题型', trigger: 'blur' }],
        // 难度
        difficulty: [{ required: true, message: '请选择难度', trigger: 'blur' }],
        // 标题
        title: [{ required: true, message: '请输入试题标题', trigger: 'blur' }],
        // 单选
        single_select_answer: [{ required: true, message: '请选择单选选项' }],
        // 多选
        multiple_select_answer: [{ required: true, message: '请选择双选选项', trigger: 'change' }],
        // 简单
        short_answer: [{ required: true, message: '请输入简答内容', trigger: 'blur' }],
        // 答案解析
        answer_analyze: [{ required: true, message: '请填写答案解析', trigger: 'blur' }],
        // 试题备注
        remark: [{ required: true, message: '请输入试题备注', trigger: 'blur' }]
      },
      // 级联选择器城市数据源
      cityOptions: regionDataPlus,
      // 单选区域图像上传路径
      uploadAction: process.env.VUE_APP_BASEURL + '/question/upload',
      // 头像预览路径
      imageAUrl: '',
      imageBUrl: '',
      imageCUrl: '',
      imageDUrl: '',
      // 视频路径
      videoUrl: '',
      // 是否显示视频盒子
      isShowVideo: false
    }
  },
  methods: {
    // 单选区域图像上传成功触发
    handleASuccess(res, file) {
      this.imageAUrl = URL.createObjectURL(file.raw)
      this.addQuestionForm.select_options[0].image = res.data.url
    },
    handleBSuccess(res, file) {
      this.imageBUrl = URL.createObjectURL(file.raw)
      this.addQuestionForm.select_options[1].image = res.data.url
    },
    handleCSuccess(res, file) {
      this.imageCUrl = URL.createObjectURL(file.raw)
      this.addQuestionForm.select_options[2].image = res.data.url
    },
    handleDSuccess(res, file) {
      this.imageDUrl = URL.createObjectURL(file.raw)
      this.addQuestionForm.select_options[3].image = res.data.url
    },
    // 单选区域图像上传之前触发
    beforeAvatarUpload(file) {
      let isJPG = file.type === 'image/jpeg'
      let isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片介绍只能是JPG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片介绍大小不能超过2MB！')
      }
      return isJPG && isLt2M
    },
    // 视频删除之前触发
    async beforeVideoRemove(file) {
      let confirmRes = await this.$confirm(`确定移除 ${file.name}？`)
      if (confirmRes === 'confirm') {
        this.isShowVideo = false
        this.videoUrl = ''
        this.addQuestionForm.video = ''
        return this.$message.success('删除视频成功')
      } else {
        return this.$message.info('已取消视频删除')
      }
    },
    // 视频长传成功触发
    handleVideoSuccess(res, file) {
      this.isShowVideo = true
      this.videoUrl = URL.createObjectURL(file.raw)
      if (res.code === 200) {
        this.addQuestionForm.video = res.data.url
      }
    },
    // 视频上传成功之前触发
    beforeVideoUpload(file) {
      let isVideo = file.type === 'video/mp4'
      let isLt2M = file.size / 1024 / 1024 < 2
      if (!isVideo) {
        this.$message.error('上传视频只能是viode/mp4格式')
      }
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过2MB')
      }
      return isVideo && isLt2M
    },
    // 取消新增试题
    cancalAdd() {
      this.$parent.addDlvisible = false
    },
    // 确定新增试题
    ensureAdd() {
      this.$refs.addQuestionRef.validate(valid => {
        if (!valid) {
          return this.$message.warning('请完善试题信息')
        } else {
          questionAdd(this.addQuestionForm).then(res => {
            console.log('新增表单成功', res)
            if (res.code === 200) {
              this.$message.success('新增试题成功！')
              this.$parent.getQuestionList()
              this.$parent.addDlvisible = false
              this.$refs.addQuestionRef.resetFields()
              // 预览地址清空
              this.imageAUrl = ''
              this.imageBUrl = ''
              this.imageCUrl = ''
              this.imageDUrl = ''
              this.videoUrl = ''
              this.isShowVideo = false
            } else {
              return this.$message.error('新增试题失败')
            }
          })
        }
      })
    }
  },
  created() {}
}
</script>

<style lang="less">
.add-question {
  width: 100%;
  // 表单居中
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
  // 表单标签与输入框间隙
  .el-form-item__label {
    padding-right: 40px;
  }
  // 下拉选项框样式
  .el-input {
    width: 364px;
  }
  // 富文本样式
  .quill-editor {
    width: 835px;
    height: 68px;
    margin-bottom: 100px;
  }
  // 单选区域样式
  .raido-box {
    display: flex;
    align-items: center;
    line-height: 0;
    .el-input {
      width: 476px;
    }
    .el-checkbox {
      margin-right: 29px;
    }
  }
  .checkbox-radio {
    margin-left: 80px;
  }
  // 分割线样式
  .el-divider--horizontal {
    margin: 36px 0;
  }
  // 最后一分割线样式
  .divider {
    height: 2px;
    margin-top: 128px;
  }
  // 上传头像样式
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    margin: 0 0 45px 20px;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  // 视频解析样式
  .el-upload__tip {
    margin-left: 92px;
  }
  .video {
    width: 360px;
    height: 180px;
    margin-left: 92px;
  }
  .el-upload-list {
    margin: 0 0 10px 92px;
  }
}
// 级联选择器样式
.el-cascader-panel {
  height: 200px;
}
</style>
