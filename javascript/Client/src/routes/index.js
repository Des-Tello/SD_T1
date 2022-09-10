const { Router }= require('express')
const router=Router()



const { searchitems,Getitems }=require('../controllers/index.controller')


router.post('/inventory/search/',searchitems)
// router.get('/Inventary',Getitems)

module.exports=router;