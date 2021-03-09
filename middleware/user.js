exports.username = (req, res, next)=>{
    const user = req.cookies.user;
    const {username} = JSON.parse(user)
    console.log('username:', username)
    req.username = username;
    next()
}