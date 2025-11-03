import jsonwebtoken from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try{
        const token=req.cookies.token
        if(!token){
            return res.status(400).json({message:"token not found"})
        }
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(400).json({ message: "Token verification failed" });
        }
        
        req.userId = decoded.userId
        next()

    }catch (error){
        return res.status(500).json({message:"isauth middleware error"})
    }
}

export default isAuth;