import express, {Request, Response} from "express";

import { Quantity } from "./model/ticket";

const router = express.Router()


router.get('/api/tickets/:id', async(req: Request, res: Response) => {
    const specificItem = await Quantity.findOne({
         _id: req.params.id
    });
    
  

    if (!specificItem) {
        res.status(200).send({
            message: "Item not found"
        })
    }



    res.status(200).send(specificItem)
        
})


export {router as showItemDetailRouter}