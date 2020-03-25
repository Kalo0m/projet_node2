const Beer = require('../model/beer');

const daoCommon = require('./commons/daoCommon');

class BeerDAO {

    constructor() {
        this.common = new daoCommon();
    }

    findByAll(name,categorie,country,page,count){
        const sqlRequest = "SELECT * FROM beer WHERE beer.name LIKE '%"+name+"%' AND beer.category LIKE '%"+categorie+"%' AND beer.country LIKE '%"+country+"%' LIMIT "+count+" OFFSET "+page;
        console.log('requete : ' + sqlRequest);
        return this.common.findAll(sqlRequest)
            .then(rows => {
                const beers = rows.map(row => new Beer(row));
                return beers;
            })
            .catch(err => console.log(err));
    }

    findAll(limite,page) {
        const sqlRequest = "SELECT * FROM beer LIMIT "+limite+" OFFSET "+page;

        return this.common.findAll(sqlRequest)
            .then(rows => {
                const beers = rows.map(row => new Beer(row));
                return beers;
            })
            .catch(err=> console.log(err));
    };
    findByName(name){
        //const sqlRequest = "SELECT * FROM beer WHERE beer.name=$name";
        const sqlRequest = "SELECT * FROM beer WHERE beer.name LIKE '"+name+"%' LIMIT 10";
        let sqlParams = {$name: name};
        return this.common.findAll(sqlRequest)
        .then(rows => {
            const beers = rows.map(row => new Beer(row));
            return beers;
        })
        .catch(err=> console.log(err));

    }
    findTaux(){
        const sqlRequest = "SELECT * FROM beer WHERE beer.alcohol_by_volume=(SELECT MAX(alcohol_by_volume) FROM beer)";
        let sqlParams = {$param: "alcohol_by_volume"};
        return this.common.findOne(sqlRequest, sqlParams)
            .then(row => new Beer(row))

    }
    findById(id) {
        let sqlRequest = "SELECT * FROM beer WHERE id=$id";
        let sqlParams = {$id: id};
        //console.log(sqlParams);
        return this.common.findOne(sqlRequest, sqlParams)
            .then(row => new Beer(row))

    };

    create(beer) {
        let s ="(";
        let s2 = "";
        Object.keys(beer).map(item=>{
            console.log(item);
            s=s.concat("?",',');
            s2=s2.concat(item,',');
        });
        s=s.substring(0, s.length - 1);
        s=s.concat('', ')');
        s2=s2.substring(0, s2.length - 1);
        console.log(s2);
        console.log(s);
        const sqlRequest = "INSERT INTO beer(" +
            s2+") " +
            "VALUES "+s;
        console.log(sqlRequest);
        //console.log(sqlParams, sqlRequest);
        return this.common.run(sqlRequest, Object.values(beer));



    };

    deleteById(id) {
        let sqlRequest = "DELETE FROM beer WHERE id=$id";
        let sqlParams = {$id: id};
        return this.common.run(sqlRequest, sqlParams);
    };

    update(beer) {
        let sqlRequest = "UPDATE beer SET " +
            "cat_name=$catName, " +
            "last_mod=$lastMod " +
            "WHERE id=$id";

        let sqlParams = {
            $catName: categorie.catName,
            $lastMod: categorie.lastMod,
            $id: categorie.id
        };
        return this.common.run(sqlRequest, sqlParams);
    };

}

module.exports = BeerDAO;