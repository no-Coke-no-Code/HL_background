export default function (to, from){
    app.bus.$emit('router-change')
}
