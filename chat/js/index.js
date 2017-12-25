	/*
	*	created by Xie Zefeng on 2017-12-14
	*/
	//window.onload = function() {
		Vue.component('v-header', {
			template: "#header",
			props: {
				msg: {
					type: String,
					default: '说 说'
				},
				back: {
					type: Boolean,
					default: false
				},
				search: {
					type: Boolean,
					default: false
				},
				plus: {
					type: Boolean,
					default: false
				},
				ellipsis: {
					type: Boolean,
					default: false
				},
				user: {
					type: Boolean,
					default: false
				},
				camera: {
					type: Boolean,
					default: false
				}
			},
			data: function() {
				return {
					'showTool': false,
					classMap: ['fa fa-commenting', 'fa fa-user-plus', 'fa fa-usb', 'fa fa-paypal', 'fa fa-envelope-o']
				}
			},
			methods: {
				toggleHandleTool: function() {
					this.showTool = !this.showTool;
				},
				goBack: function() {
					this.$emit('toggle-back');
				}
			},
			created: function() {
				this.tool = ['发起群聊', '添加朋友', '扫一扫', '收付款交易', '反馈与帮助'];
			}
		})
		
		/* 输入框、发送 */
		var INPUT = {
			template: "#input-wrapper",
			data: function() {
				return {
					content:'',
					count: 0
				}
			},
			methods: {
				sendContent: function() {
					if(this.content === '') {
						return false;
					}
					this.count++;
					var content = {
						"type": this.count % 2,
		            	"time": Date.parse( new Date() ),
		            	"say": this.content
					}
					this.$emit('send', content);
					this.content = '';
				},
				textareaFocus: function() {   // 当文本输入框获取焦点时， 向父组件派发事件， 刷新 iscroll 
					this.$emit("refresh-iscroll");
				}
			}
		}
		/* END */
		
		/*聊天页面*/
		var TALK = {
			template: '#talk-wrapper',
			props: {
				friend: {
					type: Object
				},
				myData: {
					type: Object
				},
				fromDetail: {
					type: Boolean,
					default: false
				}
			},
			data: function() {
				return {
					back: true,
					user: true
				}
			},
			created: function() {
				this.$nextTick(function() {
					this._initTalkScroll();
				});
			},
			methods: {
				_initTalkScroll: function() {
					if(!this.talkScroll) {
						this.talkScroll = new IScroll(this.$refs.talk, {
							probeType: 3
						})
					} else {
						this.talkScroll.refresh();
					}
				},
				_scrollToElement: function() {
					var allItem = this.$refs.content.getElementsByClassName("item-hook");
					this.talkScroll.scrollToElement(allItem[allItem.length - 1], 10);
				},
				receiveMessage: function(content) { // 接收子组件发送的信息
					this.friend.content.push(content);
					this.$nextTick(function() {	
						this.talkScroll.refresh();
						this._scrollToElement();
					});
				},
				toggleBack: function () {
					this.$emit("back");
				},
				refreshIscroll: function() {  // 文本输入框获取焦点时刷新 IScroll 
					this._initTalkScroll();
					this._scrollToElement();
				},
				//  页面过渡进入期间执行的方法
				transitioning: function(el,done) {
					if(!!this.fromDetail) {	  // 从详细页面进入时才执行
						this._initTalkScroll();
						this._scrollToElement();
					}
				}
				// END
			},
			watch: {
				'friend': function() {
					this.$nextTick(function() {
						this._initTalkScroll();
						this._scrollToElement();
					})
				}
			},
			filters: {
				farmatTime: function(date) {
					return new Date(date).pattern('yyyy-MM-dd HH:mm:ss')
				}
			},
			components: {
				'v-input': INPUT
			}
		}
		/* END */
		
		/* 个人详细信息 */
		var DETAIL = {
			template: '#detail-wrapper',
			props: {
				friend: {
					type: Object
				},
				myData: {
					type: Object
				}
			},
			data: function() {
				return {
					msg: '个人资料',
					ellipsis: true,
					back: true,
					talking: false,
					fromDetail: true   // 进入 talk 页面过渡动画的标识
				}
			},
			methods: {
				showTalking: function() {
					this.talking = !this.talking;
				},
				toBack: function() {
					this.$emit("go-back");
				},
				goBack: function() {
					this.talking = false;
				}
			},
			components: {
				"v-talk": TALK
			}
		}
		/* END */
		
		/* 对话 */
		var CHAT = {
			template: '#chat-wrapper',
			props: {
				myData: {
					type: Object
				}
			},
			data:function() {
				return {
					msg: '对 话',
					search: true,
					plus: true,
					friend: {},
					talking: false
				}
			},
			created:function() {
				this.$nextTick(function() {
					this._initScroll();
				});
			},
			methods: {
				_initScroll: function() {
					if(!this.chatScroll) {
						this.chatScroll = new IScroll(this.$refs.chat, {
							probeType: 3,
							click: true
						});
					} else {
						this.chatScroll.refresh();
					}
					var self = this;
					this.chatScroll.on("scroll", function() {
						self._addClass();
					})
				},
				openFriend: function(friend, event) {
					if(!event._constructed) {   // 阻止 PC 端的 click 默认事件
						return false;
					}
					this.friend = friend;
					this.talking = !this.talking;
					this.chatScroll.disable();   // 禁止 iscroll 的所有事件, 阻止上层滚动的时候穿透到下一层同时滚动。
				},
				_addClass: function() {
					var list = this.$refs.list.getElementsByClassName("active-hook");
					list[list.length - 1].className = "list-item flex border-bottom-1px active-hook border-none";
				},
				changeBack: function() {
					this.talking = false;
					this.chatScroll.enable();  // 打开 iscroll 的事件
				}
			},
			watch: {
				'myData': function() {	// myData 数据变更时重新刷新 IScroll
					this.$nextTick(function() {
						this._initScroll();
						this._addClass();
					});
				}
			},
			filters: {
				farmatTime: function(date) {
					return new Date(date).pattern('yyyy-MM-dd HH:mm:ss')
				}
			},
			components: {
				'v-talk': TALK
			}
		};
		/* END */
		
		/* 通讯录 */
		var LIST = {
			template: '#list-wrapper',
			props: {
				myData: {
					type: Object
				}
			},
			data: function() {
				return {
					msg: '通信录',
					search: true,
					plus: true,
					person: {},
					detail: false
				}
			},
			created: function() {
				this.$nextTick(function() {
					this._initScroll();
				});
			},
			methods: {
				_initScroll: function() {
					if(!this.listScroll) {
						this.listScroll = new IScroll(this.$refs.lists, {
							click: true
						});
					}else {
						this.listScroll.refresh();
					}
				},
				showDetail: function(event, friend) {
					if(!event._constructed) {
						return false;
					}
					this.person = friend;
					this.detail = !this.detail;
					this.listScroll.disable();
				},
				goBack: function() {
					this.detail = !this.detail;
					this.listScroll.enable();
				}
			},
			watch: {
				'myData': function() {
					this.$nextTick(function() {
						this._initScroll();
					});
				}
			},
			components: {
				'v-detail': DETAIL
			}
		};
		/* END */
		
		/* 课程导航栏 */
		var SUBJECTNAV = {
			template: '#subject-nav',
			props: {
				content: {
					type: Object
				}
			},
			data: function() {
				return {
					activeIndex: 0
				}
			},
			created: function() {
				this.$nextTick(function() {
					this._initScroll();
				});
			},
			methods: {
				navClick: function(event, index) {
					if(!event._constructed) {   // 阻止 click 的默认事件
						return false;
					}
					this.$emit("transmit-index", index);
				},
				_initScroll: function() {
					if(!this.navScroll) {
						this.navScroll = new IScroll(this.$refs.nav, {
							click: true
						});
					} else {
						this.navScroll.refresh();
					}
				},
				outIndex: function(currentIndex) {   // 给父组件调用，并接收参数
					this.activeIndex = currentIndex;
				}
			},
			watch: {
				'content': function() {
					this.$nextTick(function() {
						this._initScroll();
					});
				}
			}
		}
		/* END */
		
		/* 课程内容 */
		var SUBJECTCONTENT = {
			template: '#subject-content',
			props: {
				subContent: {
					type: Object
				}
			},
			data: function() {
				return {
					listHeight: [],
					scrollY: 0
				}
			},
			created: function() {
				this.$nextTick(function() {
					this._initScroll();
				});
			},
			computed: {
				currentIndex: function () {
					for(var i = 0, len = this.listHeight.length; i < len; i++){
						// 获取两个区间值
						var height_1 = this.listHeight[i];
						var height_2 = this.listHeight[i + 1];
						if(!height_2 || (this.scrollY >= height_1 && this.scrollY < height_2)) {
							return i;
						}
					}
					return 0;
				}
			},
			methods: {
				_initScroll: function() {
					var self = this;
					if(!this.contentScroll) {
						this.contentScroll = new IScroll(this.$refs.content, {
							probeType: 3,    //表示能实时监听到 IScroll 滚动的位置
							click: true
						});
					} else {
						this.contentScroll.refresh();
					}
					this.contentScroll.on("scroll", function() {
						self.scrollY = Math.abs( Math.ceil( this.y ) ) + 1;   //优化取值，由于 y 可能是一个带小数的值会损失精度，为满足体验效果所以 + 1.
						self.$emit('transmit-current', self.currentIndex); // 向外派发出内容栏当前滚动到的元素是第几个
					})
				},
				_calculateHeight: function() {  // 计算区间值
					var listHook = this.$refs.list.getElementsByClassName("single-hook");
					var height = 0;
					this.listHeight.push(height);
					for(var i = 0, len = listHook.length; i < len; i++) {
						height += listHook[i].clientHeight;
						this.listHeight.push(height);
					}
				},
				outIndex: function (index) {  //给父组件调用，并接收参数
					var listHook = this.$refs.list.getElementsByClassName("single-hook");
					this.contentScroll.scrollToElement(listHook[index], 300);
				}
			},
			filters: {
				farmatTime: function(date) {
					return new Date(date).pattern("yyyy-MM-dd");
				}
			},
			watch: {
				'subContent': function() {
					this.$nextTick(function() {
						this.contentScroll.refresh();
						this._calculateHeight();
					});
				}
			}
		}
		/* END */
		
		/* ps-grade-one */
		var psGradeOne = {
			template: "#ps-grade-one",
			data: function() {
				return {
					grade_one: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.grade_one = response.body.grade_one; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ps-grade-two */
		var psGradeTwo = {
			template: "#ps-grade-two",
			data: function() {
				return {
					grade_two: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.grade_two = response.body.grade_two; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ps-grade-three */
		var psGradeThree = {
			template: "#ps-grade-three",
			data: function() {
				return {
					grade_three: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.grade_three = response.body.grade_three; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ps-grade-four */
		var psGradeFour = {
			template: "#ps-grade-four",
			data: function() {
				return {
					grade_four: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.grade_four = response.body.grade_four; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ps-grade-five */
		var psGradeFive = {
			template: "#ps-grade-five",
			data: function() {
				return {
					grade_five: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.grade_five = response.body.grade_five; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ps-grade-six */
		var psGradeSix = {
			template: "#ps-grade-six",
			data: function() {
				return {
					grade_six: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.grade_six = response.body.grade_six; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ms-grade-one */
		var msGradeOne = {
			template: "#ms-grade-one",
			data: function() {
				return {
					m_grade_one: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.m_grade_one = response.body.m_grade_one; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ms-grade-two */
		var msGradeTwo = {
			template: "#ms-grade-two",
			data: function() {
				return {
					m_grade_two: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.m_grade_two = response.body.m_grade_two; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* ms-grade-three */
		var msGradeThree = {
			template: "#ms-grade-three",
			data: function() {
				return {
					m_grade_three: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.m_grade_three = response.body.m_grade_three; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* hs-grade-one */
		var hsGradeOne = {
			template: "#hs-grade-one",
			data: function() {
				return {
					h_grade_one: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.h_grade_one = response.body.h_grade_one; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* hs-grade-two */
		var hsGradeTwo = {
			template: "#hs-grade-two",
			data: function() {
				return {
					h_grade_two: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.h_grade_two = response.body.h_grade_two; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* hs-grade-three */
		var hsGradeThree = {
			template: "#hs-grade-three",
			data: function() {
				return {
					h_grade_three: {}
				}
			},
			created: function() {
				this.$http.get('data/studio.json').then(function(response) {
					this.h_grade_three = response.body.h_grade_three; 
				}, function(error) {
					console.log(error);
				});
			},
			methods: {
				transmitCurrent: function(index) {   // 接收内容栏派发过来的事件，调用课程菜单栏的事件并将参数传递过去
					this.$refs.nav.outIndex(index);
				},
				activeIndex: function(activeIndex) {  // 接收课程导航栏派发过来的事件，调用内容栏的事件并将参数传递过去
					this.$refs.content.outIndex(activeIndex);
				}
			},
			components: {
				'v-subject-nav': SUBJECTNAV,
				'v-subject-content': SUBJECTCONTENT
			}
		}
		/* END */
		
		/* 学习天地 */
		var COVER = {
			template: '#cover-wrapper',
			created: function() {
				this.$nextTick(function() {
					this._calcNavWidth();
				});
			},
			data: function() {
				return {
					msg: '学习天地',
					search: true,
					plus: true,
				}
			},
			methods: {
				_initNavScroll: function() {
					if(!this.navScroll) {
						this.navScroll = new IScroll(this.$refs.cover, {
							click: true,
							scrollX: true
						});
					} else {
						this.navScroll.refresh();
					}
				},
				_calcNavWidth: function() {
					var navChildren = this.$refs.nav.getElementsByTagName("a");
					var len = navChildren.length;
					var width = navChildren[0].offsetWidth;
					var marginRight = 5;
					var allWidth = (width + marginRight) * len - 5;
					this.$refs.nav.style.width = allWidth + "px";
					this._initNavScroll();
				}
			}
		};
		/* END */
		
		/* 个人 */
		var MINE = {
			template: '#mine-wrapper',
			data: function() {
				return {
					msg: '个人设置',
					camera: true
				}
			}
		};
		/*END*/
		
		
		
		var routes = [
			{path: '/', redirect: '/list'},  //路由重定向，当路径为空时自动跳转至 '/list' 页面
			{path: '/chat',component: CHAT, props: true},
			{path: '/list',component: LIST},
			{
				path: '/cover',
				component: COVER,
				// linkActiveClass: 'active',  //路由激活的类名只能全局更改，不能只单独更改某一个子级的路由列表
				children: [
					{path: '/cover/', redirect: '/cover/ps_g_one'},
					{path: '/cover/ps_g_one', component: psGradeOne},
					{path: '/cover/ps_g_two', component: psGradeTwo},
					{path: '/cover/ps_g_three', component: psGradeThree},
					{path: '/cover/ps_g_four', component: psGradeFour},
					{path: '/cover/ps_g_five', component: psGradeFive},
					{path: '/cover/ps_g_six', component: psGradeSix},
					{path: '/cover/ms_g_one', component: msGradeOne},
					{path: '/cover/ms_g_two', component: msGradeTwo},
					{path: '/cover/ms_g_three', component: msGradeThree},
					{path: '/cover/hs_g_one', component: hsGradeOne},
					{path: '/cover/hs_g_two', component: hsGradeTwo},
					{path: '/cover/hs_g_three', component: hsGradeThree},
				]
			},
			{path: '/mine',component: MINE}
		];
		
		var router = new VueRouter({
			routes: routes
		})
		
		var app = new Vue({
			el: '#web-app',
			router,
			data: function() {
				return {
					mine: "This is a webApp",
					myData: {},
					msg: '说 说'
				}
			},
			created: function() {
				this.$http.get('data/chat.json').then(function(response) {
					this.myData = response.body; 
					//console.log(this.myData);
				}, function(err) {
					console.log(err);
				})
				/*$.ajax({
					type: 'GET',
					url: 'data/chat.json',
					success: function(resp) {
						console.log(resp);
					},
					error: function(err) {
						console.log(err);
					}
				})*/
			}
		})
	//}