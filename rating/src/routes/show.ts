import express, {Request, Response} from "express";

import { Quantity } from "../models/ticket";

const router = express.Router()


router.get('/api/rating', async(req: Request, res: Response) => {
     const allProducts = await Quantity.find({})
    
    console.log('get1')
    res.status(200).send(allProducts)
        
})


export {router as showAllRatingRouter}