import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import actions from './action'

Vue.use(Vuex)

export default new Vuex.Store({
	state,
	getters:{
		cartNum:(state)=>{
			let count = 0;
			state.cartList.forEach(item=>{
				count += item.goodsNum;
			})
			return count;
		}
	},
	mutations,
	actions
})