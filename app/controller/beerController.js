const BeerDAO = require('../dao/beerDAO');
const Beer = require('../model/beer');

/* Load Controller Common function */
const ControllerCommon = require('./common/controllerCommon');

class BeerController {

    constructor() {
        this.beerDAO = new BeerDAO();
        this.common = new ControllerCommon();
    }


    findAll(res) {
        this.beerDAO.findAll()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }

    findById(req, res) {
        let id = req.params.id;
        this.beerDAO.findById(id)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    };
    findByName(req,res){ // /api/beer?name={name}
        let name = req.query.name;
        console.log("nom recherché : "+name);
        this.beerDAO.findByName(name)
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }
    create(req, res) {
        let beer = new Beer(req.body);
        return this.beerDAO.create(beer)
            .then(() => this.beerDAO.findById(beer.id))
            .then((categorie) => {
                res.status(201);
                res.json(beer);
            })
            .catch(this.common.serverError(res));

    }

    deleteById(req, res) {
        let id = req.params.id;

        this.beerDAO.deleteById(id)
            .then(this.common.editSuccess(res))
            .catch(this.common.serverError(res));
    };

    update(req, res) {
        let beer = new Beer();
        /*categorie.id = req.body.id;
        categorie.catName = req.body.catName;
        categorie.lastMod = req.body.lastMod;*/
        beer = Object.assign(beer, req.body);


        return this.beerDAO.update(beer)
            .then(this.beerDAO.findById(req.params.id))
            .then(() => this.beerDAO.findById(beer.id))
            .then((beer) => {
                res.status(201);
                res.json(beer);
            })
            .catch(err => console.log(err));

    };
    getPlusHautTaux(res) {
        this.beerDAO.findTaux()
            .then(this.common.findSuccess(res))
            .catch(this.common.findError(res));
    }
}


module.exports = BeerController;