<template>
    <button
        class="defalut-style pointer"
        :class="['u-button-size_' + size, 'u-button-type_' + type]"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>
<script>
// 判断参数是否是其中之一
function oneOf(value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

export default {
    props: {
        size: {
            validator(value) {
                return oneOf(value, ['small', 'large', 'default']);
            },
            default: 'default'
        },
        type: {
            validator(value) {
                return oneOf(value, ['danger', 'parmary', 'default', 'success']);
            },
            default: 'default'
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }
};
</script>
<style lang="less">
.defalut-style{
    font-size: 14px;
    border-radius: 4px;
}
.u-button-size_default {
    min-width: 90px;
    height: 30px;
    line-height: 28px;
    border: 1px solid #323a45;
    background-color: #323a45;
}
.u-button-size_small {


}
.u-button-size_large {

}
.u-button-type_default {
    background: #000;
    color: #fff;
}
.u-button-type_danger {
    background: red;
}
</style>
