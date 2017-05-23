<template>
  <section>
    <news-content></news-content>
    <div class="ajax-loader" v-show="$store.state.loader"></div>
    <button v-show="$store.state.news_pagemore && !$store.state.loader" @click.stop="f_get_more">点击加载更多！</button>
    <button v-show="!$store.state.news_pagemore && !$store.state.loader && this.$store.state.current_user" class="no_more">没有更多了哦！</button>
  </section>
</template>
<script>
import newsContent from "./news-list/newscontent"
export default {
  data() {
      return {}
    },
    mounted: function() {
      if (this.$store.state.current_user)
        this.$store.state.news_mounted(this.$store.state, this);
    },
    methods: {
      f_get_more: function() {
        _czc.push(["_trackEvent", "消息", "加载更多"]);
        TDAPP.onEvent("消息", "加载更多");
        this.$store.state.loader = true;
        this.$http({
          method: 'get',
          url: 'http://test.mrpyq.com/api/feed/messages',
          params: {
            'access_token': localStorage.getItem('access_token'),
            'page': this.$store.state.news_pagenumber,
            't': this.$store.state.news_date,
          },
          emulateJSON: true
        }).then((res) => {
          if (res.body.items) {
            this.$store.state.news_pagenumber++;
            this.$store.state.news_pagemore = res.body.pagemore;
            this.$store.state.news_items = this.$store.state.news_items.concat(res.body.items);
            for (var i = 0; i < res.body.items.length; i++) {
              var it = {
                dis: true,
                head_img_show: false,
                pi_show: false,
                play_user: res.body.items[i].feed ? (res.body.items[i].feed.play ? res.body.items[i].feed.play.user : this.$store.state.current_user) : this.$store.state.current_user,
              };
              this.$store.state.news_datas.push(it);
            }
          } else if (res.body.error)
            this.$store.state.f_error(this.$store.state, res.body.error);
          this.$store.state.loader = false;
        }, (res) => {
          this.$store.state.f_error(this.$store.state, "服务器正在开小差。。。");
        })
      },
    },
    components: {
      newsContent
    },
}
</script>
<style scoped>
section {
  width: 660px;
  padding-bottom: 25px;
}

button {
  height: 35px;
  line-height: 35px;
  width: 660px;
  background: #ccc;
  text-align: center;
  cursor: pointer;
  background: #ddd;
  border: 1px solid #ccc;
  border-radius: 3px;
  color: #777;
}

button.no_more {
  background: transparent;
  color: #dd6f5a;
  cursor: auto;
  border: none;
}
</style>
