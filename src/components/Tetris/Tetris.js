import { tetris_items } from './tetris_items'
import _cloneDeep from 'lodash/cloneDeep'
import db from '@/plugins/firestore'
import { event } from '@/plugins/event'
// import SaveScoreDialog from '@/components/SaveScore/SaveScore.vue'
// import PlayInfo from '@/components/HowtoPlay/PlayInfo.vue'

export default { 
    name: 'tetris',

    //importing external components from exported defaults *new features*
    components: {

    },

    data: () => ({
        //stage 1
        arena: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
            
        ],
        //all variables of tetris
        new_tetris_item: null,
        new_tetris_position: 0, 
        game_interval: null,
        tetris_before_rotation: null,
        score_for_row: 100,
        total_score: 0,
        game_over: false,
        game_started: false,
        top10_users: [],
        save_score_dialog: false,
        score_submitted: false,
        animating: false,
        loading: false
    }),

    computed: {
        save_score() {
            if( this.score_submitted || !this.total_score) {
                return false;
        }
        let top_scores = this.top10_users.map(user => user.score)
            if( top_scores.length < 100) {
                return true;
            }
        return top_scores.some(score => score < this.total_score)
        }
    },

    watch: {
        game_over(value) {
            if( value && this.save_score){
                setTimeout(() => {
                    this.save_score_dialog = true;
                }, 1000)
            }
        },
        animating(value) {
            if(value) {
                clearInterval(this.game_interval)
            }else {
                this.game_interval = setInterval((this.game_flow, 1000))
            }
        }
    },
    create() {
        this.add_new_tetris()
        this.key_control()
        this.get_top10_users()
    },

    methods: {
        get_top10_users() {
            this.loading = true
            db.collection('users')
                .orderBy('score', 'desc')
                .limit(10)
                .onSnapshot(res => {
                    let users = []
                    res.docs.forEach(doc => {
                        users.push(doc.data())
                    })
                    this.top10_users = users
                    this.loading = false
                })
        },

        save_user(form) {
            db.collection('users')
                .add(form)
                .then(() => {
                    event.$emit('gamebar', 'Score saved successfully.')
                    this.score_submitted = true;
                })
        },

        
    }
}


