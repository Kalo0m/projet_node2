#!/bin/sh

#Affichage des bières
echo '------------------------------------------------------------------------------'
echo "Affichage des 20 premières bières (numéro de page et nombre de bières par page non donné --> valeur par default)"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer
echo
echo '------------------------------------------------------------------------------'
echo "Affiche la bière avec le plus haut degré d'alcool"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer/plusHautTaux
echo
echo '------------------------------------------------------------------------------'
echo "Affichage des bières allant de la 30ème jusqu'à la 40ème (4ème page de 10 bières)"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer?page=4&count=10
echo
echo '------------------------------------------------------------------------------'
echo "Afichage des bières dont le nom contient la chaine de caractères 'Hocus'"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer?name='Hocus'
echo
echo '------------------------------------------------------------------------------'
echo "Affichage des bières dont le nom contient la chaine de caractères 'Hocus' et dont le pays contient 'United'"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer?name='Hocus'&country='United'
echo
echo '------------------------------------------------------------------------------'
echo "Affichage des bières dont le nom contient la chaine de caractères 'Hocus' et dont le pays contient 'United' et dont la catégorie contient 'Oth'"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer?name='Hocus'&country='United'&categorie='Oth'
echo
echo '------------------------------------------------------------------------------'
echo "Affichage de la première bière"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer/1
echo
echo '------------------------------------------------------------------------------'
echo "Affichage d'une bière inexistante"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer/1234
echo
echo '------------------------------------------------------------------------------'
body='{"Name": "Biere", "id": 44444,"brewery_id":12,"alcohol_by_volume":15,"international_bitterness_units":30,"standard_reference_method":45,"universal_product_code":60,"last_mod":80}'
echo "Creation de la bière $body"
curl --noproxy "*" -H "Content-Type: application/json"  -X POST -d $body http://localhost:3000/api/beer/
echo
echo '------------------------------------------------------------------------------'
body='{"Name": "Biere", "id": 44444,"brewery_id":12,"alcohol_by_volume":15,"international_bitterness_units":30,"standard_reference_method":45,"universal_product_code":60,"last_mod":80}'
echo "Creation d'un double la bière $body"
curl --noproxy "*" -H "Content-Type: application/json"  -X POST -d $body http://localhost:3000/api/beer/
echo
echo '------------------------------------------------------------------------------'
body='{"Name": "Nouveau_nom", "id": 133,"brewery_id":12,"alcohol_by_volume":15,"international_bitterness_units":30,"standard_reference_method":45,"universal_product_code":60,"last_mod":80}'
echo "Mise à jour de la bière 133 : $body"
curl --noproxy "*" -H "Content-Type: application/json"  -X PUT -d $body http://localhost:3000/api/beer/132
echo
echo '------------------------------------------------------------------------------'
echo "Suppression de la bière 100"
curl --noproxy "*" -H "Content-Type: application/json" -X DELETE http://localhost:3000/api/beer/100
echo
echo '------------------------------------------------------------------------------'
echo "Suppression d'une bière inexistante 1234"
curl --noproxy "*" -H "Content-Type: application/json" -X DELETE http://localhost:3000/api/beer/1234
echo
echo '------------------------------------------------------------------------------'
echo "Affichage de la bière 100"
curl --noproxy "*" -H "Content-Type: application/json" -X GET http://localhost:3000/api/beer/100
echo
