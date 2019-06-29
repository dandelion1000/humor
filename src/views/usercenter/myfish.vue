<template>
    <div class="dash-frame">
        1.创建鱼池
        2.选择鱼苗(初级用户只有一种鱼可选，默认每种有两只),可以通过做任务，发表优质泡泡增加等级，等级每升一个level，多一种鱼苗
        3.投食区（默认只有泥巴可吃，可以前往商城购买虚拟渔食物(海草／虾米／大鱼／蚯蚓之类的)）
        4.可通过发表优质泡泡内容攒u币，发表泡泡或点赞等活跃，每次会不定时赠送0.01u币或者锦鲤包（锦鲤包会赠送鱼苗种，鱼食，或u币）
        5.lv等级高的，投稿的用户趣文一经采纳即赠送u枕，餐具或其他商城用品
        6.当鱼苗养成大鱼，2只霸王鱼或锦鲤鱼可兑换商城的礼品（还可以赠送关注的好友）
        7.关于商城的物品这块成本问题需要好好构思，主要商城的物品还可以直接购买(商城的物品的设计，货源，都是大问题)
        8.技术问题，鱼塘需要动态的水，鱼可在里面游动，还有海藻，水螺，小贝这些元素，游戏元素的场景
    </div>
</template>
<script>
export default {
    data() {
        return {
            theme2: 'light'
        };
    },
    methods: {
        handleUpload(file) {
            console.log(file);
        }

    }
};
</script>
<style lang="less">
.dash-frame {
    .upload-file {
        width: 30vw;
        margin: 30px auto;

    }
}
</style>
