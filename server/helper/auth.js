import jwt from 'jsonwebtoken'
const { verify } = jwt

const auth = (req, res, next) => {
    // grab auth token from post req
    const token = req.headers['authorization']
    if(!token) {
        return res.status(401).json({message: "No token provided"})
    }
    verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: "Failed to auth token"})
        }
        next()
    })
}

export { auth }