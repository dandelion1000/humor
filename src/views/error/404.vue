<template >
    <div class="not-found white-bg crm_full_page">
        <div class="err-img">
            <i class="icon icon-visit_error"></i>
        </div>
        <div class="error-text">
            该页面不存在
        </div>
        <div class="crm-go-index">
            <router-link to="/"  >
                <i class="icon icon-home"></i>
            </router-link>
        </div>
    </div>
</template>

<style>
@import "./error.less";
</style>
