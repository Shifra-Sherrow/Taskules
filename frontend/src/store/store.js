import userStore from './modules/user.store';
import boardStore from './modules/board.store';
import Vue from 'vue';
import Vuex from 'vuex';
import bg1 from '../assets/bgs/full/bg1.jpg';
import bg2 from '../assets/bgs/full/bg2.jpg';
import bg3 from '../assets/bgs/full/bg3.jpg';
import bg4 from '../assets/bgs/full/bg4.jpg';
import bg5 from '../assets/bgs/full/bg5.jpg';
import bg6 from '../assets/bgs/full/bg6.jpg';
import bg7 from '../assets/bgs/full/bg7.jpg';
import bg8 from '../assets/bgs/full/bg8.jpg';
import bg9 from '../assets/bgs/full/bg9.jpg';
import bg10 from '../assets/bgs/full/bg10.jpg';
import bg11 from '../assets/bgs/full/bg11.jpg';
import bg12 from '../assets/bgs/full/bg12.jpg';
import sBg1 from '../assets/bgs/preview/bg1.jpg';
import sBg2 from '../assets/bgs/preview/bg2.jpg';
import sBg3 from '../assets/bgs/preview/bg3.jpg';
import sBg4 from '../assets/bgs/preview/bg4.jpg';
import sBg5 from '../assets/bgs/preview/bg5.jpg';
import sBg6 from '../assets/bgs/preview/bg6.jpg';
import sBg7 from '../assets/bgs/preview/bg7.jpg';
import sBg8 from '../assets/bgs/preview/bg8.jpg';
import sBg9 from '../assets/bgs/preview/bg9.jpg';
import sBg10 from '../assets/bgs/preview/bg10.jpg';
import sBg11 from '../assets/bgs/preview/bg11.jpg';
import sBg12 from '../assets/bgs/preview/bg12.jpg';


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        bgc: 'rgb(246, 207, 206)',
        bgSrcs: [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12],
        sBgSrcs: [sBg1, sBg2, sBg3, sBg4, sBg5, sBg6, sBg7, sBg8, sBg9, sBg10, sBg11, sBg12],
        clickPos: ''

    },
    getters: {
        bgc(state) {
            return state.bgc;
        },
        bgSrcs(state) {
            return state.bgSrcs;
        },
        sBgSrcs(state) {
            return state.sBgSrcs;
        }
    },
    mutations: {   
        loadBgc(state) {
            const board = this.getters.currBoard;
            const bgc = (board) ? board.style.background : 'rgb(246, 207, 206)';
            const style = (bgc.includes('rgb')) ? bgc : `url(${state.bgSrcs[+bgc]})`;
            state.bgc = style;
        },
        bgChange(state, { bgc }) {
            const style = (bgc.includes('rgb')) ? bgc : `url(${state.bgSrcs[+bgc]})`;
            state.bgc = style;
        }
    },
    actions: {},
    modules: {
        boardStore,
        userStore,
    }
})