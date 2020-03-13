const express = require('express');
const router = express.Router();

const BeerController = require('../../controller/beerController');
const beerController = new BeerController();


router.get('/', function (req, res) {
    console.log('route : a/')
    if(req.query.name==null){
        beerController.findAll(res);
    }else{
        beerController.findByName(req,res);
    }
});
router.get('/plusHautTaux', function (req, res) {
    console.log('route : /plusHautTaux');
    beerController.getPlusHautTaux(res);
});
router.get('/:id', function (req, res) {
    console.log('route : /id')

    beerController.findById(req, res);
    
});


router.get('/:deg', function (req, res) {
    console.log(req.params);
    beerController.compareDeg(req, res);
});

router.post('/', function (req, res) {
    beerController.create(req,res);
});
router.put('/:id', function (req, res) {
    beerController.update(req, res)
});
router.get('/degreSup/:id',function(req,res) {
    
});
router.delete('/:id', function (req, res) {
    beerController.deleteById(req, res)
});


module.exports = router;