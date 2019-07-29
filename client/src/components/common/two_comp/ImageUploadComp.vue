<template>
    <div :style="props.style">
        <span class="demonstration">{{props.image.label}}</span>
        <el-image :src="props.image.url" :fit="fit"></el-image>
    </div>
</template>

<script>

export default {
    type:'two_comp',
    name:'image-upload-comp',
    props: ['props'],
    data () {
        return { }
    },
    components : {
        
    },
    created() {
        console.log('created')
    },
    mounted() {
        console.log('mounted')
    },
    destroyed() {
        console.log('destroyed')
    },

    handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
    },

    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
            this.$message.error('Avatar picture must be JPG format!');
        }
        if (!isLt2M) {
            this.$message.error('Avatar picture size can not exceed 2MB!');
        }
        return isJPG && isLt2M;
    }

}
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
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
</style>
