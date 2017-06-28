import Vue from 'vue'
import VueRouter from 'vue-router'

//全局路由
Vue.use(VueRouter);


//路由懒加载，进入main_page之后进行，提高login页面的打开速度
const Login = resolve => require(['components/Login'], resolve)
const Not_found = resolve => require(['components/Not_found'], resolve)
const Main_page = resolve => require(['components/Main_page'], resolve)
const Personal = resolve => require(['components/main_page/Personal'], resolve)
const Home = resolve => require(['components/main_page/Home'], resolve)
const News = resolve => require(['components/main_page/News'], resolve)
const Detail = resolve => require(['components/main_page/Detail'], resolve)
const Addresslist = resolve => require(['components/main_page/Addresslist'], resolve)

const router = new VueRouter({
	//mode: "history",
	//这个模式需要服务器配置所有的请求都返回index文件，让文件自己判断路由到哪个地方，因为这是单页面程序，且需要自己加404页面
	routes: [
		{
			path: '/',
			component: Login
			},
		{
			path: '/Login',
			component: Login
		},
		{
			path: '/Main_page',
			component: Main_page,
			children: [{
					path: '',
					component: Home
			}, {
					path: 'Addresslist',
					component: Addresslist
			}, {
					path: 'Personal',
					component: Personal
			}, {
					path: 'Home',
					component: Home
			},
				{
					path: 'News',
					component: News
			},
				{
					path: 'Detail',
					component: Detail,
					children: [
						{
							path: '*',
							component: Detail
						}
					],
			}
				 ]
		},

		{
			path: '*',
			component: Not_found
		}, ],

	//		切换页面自动上滑
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return {
				x: 0,
				y: 0
			}
		}
	}
})
export default router;
