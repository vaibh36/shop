import express, {Request, Response} from "express";

import { Quantity } from "./model/ticket";

const router = express.Router()


router.get('/api/tickets', async(req: Request, res: Response) => {
     const allProducts = await Quantity.find({},  '-rating')
    

    res.status(200).send(allProducts)
        
})


export {router as showAllItemRouter}