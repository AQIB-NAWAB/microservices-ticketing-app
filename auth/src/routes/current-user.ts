import express from "express"
import jwt from "jsonwebtoken"
import { currentUser } from "@aqibtickets/common"
import { requireAuth } from "@aqibtickets/common";
const router=express.Router();



router.get('/api/users/currentuser',currentUser, async(req, res) => {
    res.send({currentUser:req.currentUser || null})
  })




export {router as  currentUserRouter};
  
  
  